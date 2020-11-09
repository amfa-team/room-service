import type { IParticipant } from "@amfa-team/types";
import { ParticipantStatus } from "@amfa-team/types";
import type { FilterQuery } from "mongoose";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { MAX_PARTICIPANTS } from "../constants";
import type { IParticipantDocument } from "../mongo/model/participant";
import { ParticipantModel } from "../mongo/model/participant";
import type { IRoomDocument } from "../mongo/model/room";
import { RoomModel } from "../mongo/model/room";
import {
  WEBHOOK_URL,
  createTwilioRoom,
  disconnectTwilioParticipant,
} from "../twilio/client";
import type {
  ParticipantConnectedEvent,
  ParticipantDisconnectedEvent,
  RoomCreatedEvent,
  RoomEndedEvent,
} from "../twilio/webhook";

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
  const uniqueName = generateRoomName();

  const twilioSid = await createTwilioRoom({ uniqueName });

  const room = new RoomModel({
    _id: twilioSid,
    name: uniqueName,
    spaceId,
    size: 1,
    participants: [participant.id],
    live: true,
  });

  await room.save();

  return room;
}

export async function findOrCreateParticipant(
  participantId: string,
): Promise<IParticipantDocument> {
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
  return participant.room ? RoomModel.findById(participant.room) : null;
}

export async function onRoomCreated(event: RoomCreatedEvent) {
  await RoomModel.findOneAndUpdate(
    { _id: event.RoomSid },
    { $set: { live: true } },
  );
}

export async function onRoomEnded(event: RoomEndedEvent) {
  await RoomModel.findOneAndUpdate(
    { _id: event.RoomSid },
    { $set: { live: false } },
  );
}

export async function onParticipantConnected(event: ParticipantConnectedEvent) {
  await ParticipantModel.findOneAndUpdate(
    { _id: event.ParticipantIdentity },
    { $set: { status: ParticipantStatus.connected, statusValidUntil: null } },
  );
}

export async function onParticipantDisconnected(
  event: ParticipantDisconnectedEvent,
) {
  const [room, participant] = await Promise.all([
    RoomModel.findOneAndUpdate(
      { _id: event.RoomSid },
      { $inc: { size: -1 } },
      { new: true },
    ),
    ParticipantModel.findOneAndUpdate(
      { _id: event.ParticipantIdentity },
      {
        $set: {
          status: ParticipantStatus.disconnected,
          statusValidUntil: null,
        },
      },
    ),
  ]);

  const tasks: Promise<unknown>[] = [];
  if (room) {
    room.participants = room.participants.filter(
      (p) => p.toString() !== event.ParticipantIdentity,
    );
    tasks.push(room.save());
  }
  if (participant) {
    participant.roomVisits.push({
      id: event.RoomSid,
      duration: Number(event.ParticipantDuration),
      timestamp: new Date(event.Timestamp),
    });
    tasks.push(participant.save());
  }

  await Promise.all(tasks);
}

export async function disconnectParticipant(
  participant: IParticipantDocument,
  autoSave: boolean = true,
): Promise<IParticipantDocument> {
  if (participant.room) {
    const oldRoomId = participant.room;

    // eslint-disable-next-line no-param-reassign
    participant.status = ParticipantStatus.disconnected;
    // eslint-disable-next-line no-param-reassign
    participant.statusValidUntil = null;
    // eslint-disable-next-line no-param-reassign
    participant.room = null;

    const oldRoom = await RoomModel.findOneAndUpdate(
      { _id: oldRoomId },
      {
        $inc: { size: -1 },
      },
      { new: true },
    );

    if (oldRoom) {
      oldRoom.participants = oldRoom.participants.filter(
        (p) => p !== participant.id,
      );
      await oldRoom.save();
      await disconnectTwilioParticipant({
        roomSid: oldRoomId,
        participantSid: participant.id,
      });
    }

    if (autoSave) {
      await participant.save();
    }
  }

  return participant;
}

export async function joinRandomRoom(
  spaceId: string,
  participant: IParticipantDocument,
): Promise<[IRoomDocument, IParticipantDocument]> {
  const query: FilterQuery<IParticipantDocument> = {
    spaceId,
    webhookUrl: WEBHOOK_URL,
    live: true,
    size: { $gt: 0, $lt: MAX_PARTICIPANTS },
  };

  if (participant.room) {
    query._id = { $ne: participant.room };
  }

  const room = await RoomModel.findOneAndUpdate(
    query,
    { $inc: { size: 1 } },
    {
      new: true,
      sort: { spaceId: 1, webhookUrl: 1, live: 1, size: -1 },
    },
  );

  const p = await disconnectParticipant(participant, false);

  if (room === null) {
    const r = await createRoom(spaceId, participant);

    p.room = r.id;
    p.status = ParticipantStatus.pending;
    p.statusValidUntil = new Date(Date.now() + 60_000);

    await p.save();

    return [r, p];
  }

  room.participants.push(p.id);

  p.room = room.id;
  p.status = ParticipantStatus.pending;
  p.statusValidUntil = new Date(Date.now() + 60_000);

  await Promise.all([p.save(), room.save()]);

  return [room, p];
}
