import crypto from "crypto";
import type { IParticipant, IRoom } from "@amfa-team/types";
// @ts-ignore
import scmp from "scmp";
import { Twilio, jwt } from "twilio";
import { validateRequest } from "twilio/lib/webhooks/webhooks";
import { MAX_ALLOWED_SESSION_DURATION, MAX_PARTICIPANTS } from "../constants";
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
    statusCallbackMethod: "GET",
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
    console.error("twilio/client:disconnectTwilioParticipant: fail", err);
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

function verifyWebhook(
  twilioSignature: string,
  params: Record<string, string>,
) {
  if (
    validateRequest(TWILIO_AUTH_TOKEN, twilioSignature, WEBHOOK_URL, params)
  ) {
    console.log("twilioClient.verifyWebhook: twilio methods worked");
    return true;
  }

  console.warn("twilioClient.verifyWebhook: twilio methods failed");

  const data = Object.keys(params).reduce((acc, key, i) => {
    const param = `${key}=${params[key]}`;
    return i === 0 ? `${acc}?${param}` : `${acc}&${param}`;
  }, WEBHOOK_URL);

  // TODO: PR twilio as validateRequest is not working in local
  const expected = crypto
    .createHmac("sha1", TWILIO_AUTH_TOKEN)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  return scmp(Buffer.from(expected), Buffer.from(twilioSignature));
}

export {
  createTwilioRoom,
  disconnectTwilioParticipant,
  getParticipantTwilioToken,
  verifyWebhook,
};
