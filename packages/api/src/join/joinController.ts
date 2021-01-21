import type { JoinData, JoinPayload } from "@amfa-team/room-service-types";
import { getSpace } from "@amfa-team/space-service-node";
import {
  canAccessSpace,
  checkBan,
  parseUserServiceToken,
} from "@amfa-team/user-service-node";
import type {
  APIGatewayEventRequestContext,
  APIGatewayProxyEventHeaders,
} from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { ForbiddenError } from "../services/io/exceptions";
import type { HandlerResult } from "../services/io/types";
import {
  findOrCreateParticipant,
  getParticipantRoom,
  joinRoom,
} from "../services/lifecycleService";
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

export async function handleJoin(
  data: JoinData,
  _headers: APIGatewayProxyEventHeaders,
  requestContext: APIGatewayEventRequestContext,
): Promise<HandlerResult<JoinPayload>> {
  const userData = parseUserServiceToken(data.participantToken);
  const [space] = await Promise.all([
    getSpace(data.spaceId, data.participantToken),
    checkBan(requestContext, () => {
      throw new ForbiddenError("banned", {
        userData,
        identity: requestContext.identity,
      });
    }),
  ]);

  if (!space) {
    return { payload: { success: false, notFound: true } };
  }

  if (!space.public && !canAccessSpace(userData, data.spaceId)) {
    return { payload: { success: false, notFound: true } };
  }
  let participant = await findOrCreateParticipant(userData.id);
  let room = await getParticipantRoom(participant);

  if (data.change || !room || (data.roomName && room.name !== data.roomName)) {
    const result = await joinRoom(
      data.spaceId,
      participant,
      data.change ? null : data.roomName,
    );

    if (result === null) {
      return { payload: { success: false, full: true } };
    }

    [room, participant] = result;
  }

  return {
    payload: {
      success: true,
      room: room.toJSON(),
      token: getParticipantTwilioToken(participant, room),
    },
  };
}
