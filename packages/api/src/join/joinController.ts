import type { JoinData, JoinPayload } from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
import {
  findOrCreateParticipant,
  getParticipantRoom,
  joinRoom,
} from "../service/lifecycleService";
import { parseUserServiceToken } from "../service/user/userService";
import { getParticipantTwilioToken } from "../twilio/client";

export const joinDecoder = JsonDecoder.object(
  {
    spaceId: JsonDecoder.string,
    participantToken: JsonDecoder.string,
    change: JsonDecoder.boolean,
    roomName: JsonDecoder.oneOf(
      [JsonDecoder.string, JsonDecoder.isExactly(null)],
      "roomName",
    ),
  },
  "joinDecoder",
);

export async function handleJoin(data: JoinData): Promise<null | JoinPayload> {
  let participant = await findOrCreateParticipant(
    parseUserServiceToken(data.participantToken).id,
  );
  let room = await getParticipantRoom(participant);

  if (data.change || !room || (data.roomName && room.name !== data.roomName)) {
    const result = await joinRoom(
      data.spaceId,
      participant,
      data.change ? null : data.roomName,
    );

    if (result === null) {
      return null;
    }

    [room, participant] = result;
  }

  return {
    room: room.toJSON(),
    token: getParticipantTwilioToken(participant, room),
  };
}
