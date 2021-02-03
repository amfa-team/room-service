import type { IParticipant } from "@amfa-team/room-service-types";
import { ParticipantStatus } from "@amfa-team/room-service-types";
import { Types } from "mongoose";
import type { FilterQuery } from "mongoose";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { MAX_PARTICIPANTS } from "../constants";
import {
  WEBHOOK_URL,
  createTwilioRoom,
  disconnectTwilioParticipant,
  getTwilioUniqueName,
} from "../twilio/client";
import type {
  ParticipantConnectedEvent,
  ParticipantDisconnectedEvent,
  RoomCreatedEvent,
  RoomEndedEvent,
} from "../twilio/webhook";
import { getModels } from "./mongo/client";
import type { IParticipantDocument } from "./mongo/model/participant";
import type { IRoomDocument } from "./mongo/model/room";

function generateRoomName() {
  return uniqueNamesGenerator({
    dictionaries: [
      adjectives, // 1,400 words
      colors, // 50 words
      animals, // 350 words
    ],
  });
}

export async function createRoom(
  spaceId: string,
  participant: IParticipantDocument,
): Promise<IRoomDocument> {
  const name = generateRoomName();

  const twilioSid = await createTwilioRoom({
    uniqueName: getTwilioUniqueName(spaceId, name),
  });

  const { RoomModel } = await getModels();
  const room = new RoomModel({
    _id: twilioSid,
    name,
    spaceId,
    size: 1,
    participants: [participant.id],
    live: true,
    webhookUrl: WEBHOOK_URL,
  });

  await room.save();

  return room;
}

export async function findOrCreateParticipant(
  participantId: string,
): Promise<IParticipantDocument> {
  const { ParticipantModel } = await getModels();
  const existingParticipant = await ParticipantModel.findById(participantId);
  if (existingParticipant) {
    return existingParticipant;
  }

  const participant = new ParticipantModel({
    _id: participantId,
    status: ParticipantStatus.disconnected,
  });

  await participant.save();

  return participant;
}

export async function getParticipantRoom(
  participant: IParticipant,
): Promise<IRoomDocument | null> {
  const { RoomModel } = await getModels();
  return participant.room ? RoomModel.findById(participant.room) : null;
}

export async function onRoomCreated(event: RoomCreatedEvent) {
  const { RoomModel } = await getModels();
  await RoomModel.findOneAndUpdate(
    { _id: event.RoomSid },
    { $set: { live: true } },
  );
}

export async function onRoomEnded(event: RoomEndedEvent) {
  const { RoomModel } = await getModels();
  await RoomModel.findOneAndUpdate(
    { _id: event.RoomSid },
    { $set: { live: false } },
  );
}

export async function onParticipantConnected(event: ParticipantConnectedEvent) {
  const { ParticipantModel } = await getModels();
  await ParticipantModel.findOneAndUpdate(
    { _id: event.ParticipantIdentity },
    { $set: { status: ParticipantStatus.connected, statusValidUntil: null } },
  );
}

async function updateDbOnDisconnect(roomId: string, participantId: string) {
  const { ParticipantModel, RoomModel } = await getModels();
  await Promise.all([
    RoomModel.findOneAndUpdate(
      {
        _id: roomId,
        participants: { $in: [participantId] },
      },
      {
        $inc: { size: -1 },
        $pull: { participants: participantId },
      },
      { new: true },
    ),
    ParticipantModel.findOneAndUpdate(
      // we need to use room filter to prevent race condition when shuffle is used
      // i.e. it's already connected to another room
      { _id: participantId, room: roomId },
      {
        $set: {
          status: ParticipantStatus.disconnected,
          statusValidUntil: null,
          room: null,
        },
      },
    ),
  ]);
}

export async function onParticipantDisconnected(
  event: ParticipantDisconnectedEvent,
) {
  const { ParticipantModel } = await getModels();
  await Promise.all([
    updateDbOnDisconnect(event.RoomSid, event.ParticipantIdentity),
    ParticipantModel.findOneAndUpdate(
      { _id: event.ParticipantIdentity },
      {
        $push: {
          roomVisits: {
            _id: Types.ObjectId(),
            id: event.RoomSid,
            duration: Number(event.ParticipantDuration),
            timestamp: new Date(event.Timestamp),
          },
        },
      },
    ),
  ]);
}

export async function disconnectParticipant(
  participant: IParticipantDocument,
): Promise<void> {
  if (participant.room) {
    const oldRoomId = participant.room;

    await Promise.all([
      updateDbOnDisconnect(oldRoomId, participant.id),
      disconnectTwilioParticipant({
        roomSid: oldRoomId,
        participantSid: participant.id,
      }),
    ]);
  }
}

async function setParticipantPending(
  roomId: string,
  participantId: string,
): Promise<IParticipantDocument> {
  const { ParticipantModel } = await getModels();
  const participant = await ParticipantModel.findOneAndUpdate(
    { _id: participantId },
    {
      $set: {
        status: ParticipantStatus.pending,
        room: roomId,
        statusValidUntil: new Date(Date.now() + 60_000),
      },
    },
    { new: true },
  );

  if (!participant) {
    throw new Error(
      "[lifecycleService/setParticipantPending]: participant not found",
    );
  }

  return participant;
}

export async function joinRoom(
  spaceId: string,
  participant: IParticipantDocument,
  roomName: string | null,
): Promise<null | [IRoomDocument, IParticipantDocument]> {
  const query: FilterQuery<IParticipantDocument> = {
    spaceId,
    webhookUrl: WEBHOOK_URL,
    live: true,
    size: { $lt: MAX_PARTICIPANTS },
  };

  if (roomName) {
    query.name = roomName;
  }

  if (participant.room) {
    query._id = { $ne: participant.room };
  }

  const { RoomModel } = await getModels();
  const [room] = await Promise.all([
    RoomModel.findOneAndUpdate(
      query,
      // @ts-ignore
      { $inc: { size: 1 }, $push: { participants: [participant._id] } },
      {
        new: true,
        sort: { spaceId: 1, webhookUrl: 1, live: 1, size: -1 },
      },
    ),
    disconnectParticipant(participant),
  ]);

  if (room === null && roomName !== null) {
    return null;
  }

  if (room === null) {
    const r = await createRoom(spaceId, participant);
    return [r, await setParticipantPending(r.id, participant._id)];
  }

  const p = await setParticipantPending(room.id, participant._id);

  return [room, p];
}
