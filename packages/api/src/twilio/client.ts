import type { IParticipant, IRoom } from "@amfa-team/types";
import { Twilio, jwt } from "twilio";
import { MAX_ALLOWED_SESSION_DURATION, MAX_PARTICIPANTS } from "../constants";
import { getEnv } from "../utils/env";

const { AccessToken } = jwt;
const accountSid = getEnv("TWILIO_ACCOUNT_SID");
const apiKeySID = getEnv("TWILIO_API_KEY_SID");
const apiKeySecret = getEnv("TWILIO_API_KEY_SECRET");

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
    // TODO: to get back status
    // statusCallback: '',
    // statusCallbackMethod: 'POST',
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
  await client.video.rooms
    .get(params.roomSid)
    .participants.get(params.participantSid)
    .update({ status: "disconnected" });
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

export {
  createTwilioRoom,
  disconnectTwilioParticipant,
  getParticipantTwilioToken,
};
