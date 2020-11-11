import crypto from "crypto";
import querystring from "querystring";
import type { IParticipant, IRoom } from "@amfa-team/types";
// @ts-ignore
import scmp from "scmp";
import { Twilio, jwt, validateRequest, validateRequestWithBody } from "twilio";
import { MAX_ALLOWED_SESSION_DURATION, MAX_PARTICIPANTS } from "../constants";
import { logger } from "../io/logger";
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
    logger.error(err, "twilio/client:disconnectTwilioParticipant: fail");
  }
}

function getParticipantTwilioToken(participant: IParticipant, room: IRoom) {
  const token = new AccessToken(accountSid, apiKeySID, apiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
    identity: `${participant._id}`,
  });
  const { VideoGrant } = AccessToken;
  const videoGrant = new VideoGrant({ room: room.name });
  token.addGrant(videoGrant);

  return token.toJwt();
}

function verifyWebhook(twilioSignature: string, params: string) {
  if (
    validateRequestWithBody(
      TWILIO_AUTH_TOKEN,
      twilioSignature,
      WEBHOOK_URL,
      params,
    )
  ) {
    logger.log("twilioClient.verifyWebhook: twilio body methods worked");
    return true;
  }

  if (
    validateRequest(
      TWILIO_AUTH_TOKEN,
      twilioSignature,
      WEBHOOK_URL,
      querystring.parse(params),
    )
  ) {
    logger.log("twilioClient.verifyWebhook: twilio get methods worked");
    return true;
  }

  logger.warn("twilioClient.verifyWebhook: twilio methods failed");

  // TODO: PR twilio as validateRequest is not working in local
  const expected = crypto
    .createHmac("sha1", TWILIO_AUTH_TOKEN)
    .update(Buffer.from(params, "utf-8"))
    .digest("base64");

  return scmp(Buffer.from(expected), Buffer.from(twilioSignature));
}

export {
  createTwilioRoom,
  disconnectTwilioParticipant,
  getParticipantTwilioToken,
  verifyWebhook,
};
