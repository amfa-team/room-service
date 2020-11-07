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
  createTwilioRoom,
  disconnectTwilioParticipant,
} from "../twilio/client";

function generateRoomName() {
  return uniqueNamesGenerator({
    dictionaries: [
      adjectives, // 1,400 words
      colors, // 50 words
      animals, // 350 words
    ],
  });
}

export async function createRoom(spaceId: string): Promise<IRoomDocument> {
  const uniqueName = generateRoomName();

  const twilioSid = await createTwilioRoom({ uniqueName });

  const room = new RoomModel({
    _id: twilioSid,
    name: uniqueName,
    spaceId,
  });

  await room.save();

  return room;
}

export async function findOrCreateParticipant(
  participantId: string,
): Promise<IParticipantDocument> {
  const existingParticipant = await ParticipantModel.findOne({
    _id: participantId,
  });
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
        $dec: { size: 1 },
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
    size: { $lt: MAX_PARTICIPANTS },
    participants: { $nin: [participant.id] },
  };

  if (participant.room) {
    query._id = { $ne: participant.room };
  }

  const room = await RoomModel.findOneAndUpdate(
    query,
    { $inc: { size: 1 } },
    {
      new: true,
      sort: { size: -1 },
    },
  );

  if (room === null) {
    await createRoom(spaceId);
    return joinRandomRoom(spaceId, participant);
  }

  const p = await disconnectParticipant(participant, false);

  room.participants.push(participant.id);
  p.room = room.id;
  p.status = ParticipantStatus.pending;
  p.statusValidUntil = new Date(Date.now() + 60_000);

  await Promise.all([participant.save(), room.save()]);

  return [room, participant];
}
