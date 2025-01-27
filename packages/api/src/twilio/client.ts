import querystring from "querystring";
import type { IParticipant, IRoom } from "@amfa-team/room-service-types";
import { Twilio, jwt, validateRequest } from "twilio";
import { MAX_ALLOWED_SESSION_DURATION, MAX_PARTICIPANTS } from "../constants";
import { logger } from "../services/io/logger";
import { getEnv } from "../utils/env";

const { AccessToken } = jwt;
const accountSid = getEnv("TWILIO_ACCOUNT_SID");
const apiKeySID = getEnv("TWILIO_API_KEY_SID");
const apiKeySecret = getEnv("TWILIO_API_KEY_SECRET");
const TWILIO_AUTH_TOKEN = getEnv("TWILIO_AUTH_TOKEN");
export const WEBHOOK_URL = process.env.IS_OFFLINE
  ? `${getEnv("API_ENDPOINT")}/dev/webhook/twilio/status`
  : `${getEnv("API_ENDPOINT")}webhook/twilio/status`;

const client = new Twilio(apiKeySID, apiKeySecret, { accountSid });

interface CreateTwilioRoomParams {
  uniqueName: string;
}

function getTwilioUniqueName(spaceId: string, roomName: string) {
  return `${spaceId}-${roomName}`;
}

async function createTwilioRoom(
  params: CreateTwilioRoomParams,
): Promise<string> {
  const twilioRoom = await client.video.rooms.create({
    ...params,
    maxParticipants: MAX_PARTICIPANTS,
    type: "peer-to-peer",
    statusCallback: WEBHOOK_URL,
    statusCallbackMethod: "POST",
  });

  return twilioRoom.sid;
}

interface TwilioRoomState {
  live: boolean;
  participants: string[];
}

async function getTwilioRoomState(
  roomSid: string,
): Promise<TwilioRoomState | null> {
  try {
    const [room, participants] = await Promise.all([
      client.video.rooms.get(roomSid).fetch(),
      client.video.rooms
        .get(roomSid)
        .participants.list({ status: "connected" }),
    ]);
    return {
      live: room.status === "in-progress",
      participants: participants.map((p) => p.identity),
    };
  } catch (e) {
    if (e?.status === 404) {
      return {
        live: false,
        participants: [],
      };
    }

    logger.error(e, "twilioClient.getTwilioRoomState: fail");
    return null;
  }
}

interface DisconnectTwilioParticipant {
  roomSid: string;
  participantSid: string;
}

async function disconnectTwilioParticipant(
  params: DisconnectTwilioParticipant,
) {
  try {
    await client.video.rooms
      .get(params.roomSid)
      .participants.get(params.participantSid)
      .update({ status: "disconnected" });
  } catch (err) {
    if (err?.status !== 404) {
      logger.error(err, "twilio/client:disconnectTwilioParticipant: fail");
    }
  }
}

function getParticipantTwilioToken(participant: IParticipant, room: IRoom) {
  const token = new AccessToken(accountSid, apiKeySID, apiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
    identity: `${participant._id}`,
  });
  const { VideoGrant } = AccessToken;
  const videoGrant = new VideoGrant({
    room: getTwilioUniqueName(room.spaceId, room.name),
  });
  token.addGrant(videoGrant);

  return token.toJwt();
}

function verifyWebhook(twilioSignature: string, params: string) {
  return validateRequest(
    TWILIO_AUTH_TOKEN,
    twilioSignature,
    WEBHOOK_URL,
    querystring.parse(params),
  );
}

export {
  createTwilioRoom,
  disconnectTwilioParticipant,
  getParticipantTwilioToken,
  verifyWebhook,
  getTwilioRoomState,
  getTwilioUniqueName,
};
