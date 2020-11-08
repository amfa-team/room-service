import type { JoinData, JoinPayload } from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
import {
  findOrCreateParticipant,
  getParticipantRoom,
  joinRandomRoom,
} from "../service/lifecycleService";
import { getParticipantTwilioToken } from "../twilio/client";

export const joinDecoder = JsonDecoder.object(
  {
    spaceId: JsonDecoder.string,
    participantId: JsonDecoder.string,
  },
  "joinDecoder",
);

export async function handleJoin(data: JoinData): Promise<JoinPayload> {
  let participant = await findOrCreateParticipant(data.participantId);
  let room = await getParticipantRoom(participant);

  if (!room) {
    [room, participant] = await joinRandomRoom(data.spaceId, participant);
  }

  return {
    room: room.toJSON(),
    token: getParticipantTwilioToken(participant, room),
  };
}
