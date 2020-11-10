import querystring from "querystring";
import { RoomStatusModel } from "../mongo/model/roomStatus";
import {
  onParticipantConnected,
  onParticipantDisconnected,
  onRoomCreated,
  onRoomEnded,
} from "../service/lifecycleService";
import { verifyWebhook } from "../twilio/client";
import type { RoomStatusEvent } from "../twilio/webhook";
import { roomStatusEventDecoder } from "../twilio/webhook";

export async function handleTwilioWebhook(
  params: string | null,
  headers: Record<string, string | null>,
): Promise<boolean> {
  if (params === null) {
    throw new Error("webhookController.handleTwilioWebhook: missing params");
  }

  if (!verifyWebhook(headers["X-Twilio-Signature"] ?? "", params)) {
    throw new Error(
      "webhookController.handleTwilioWebhook: unable to validate twilio query",
    );
  }

  const data = querystring.parse(params);
  const result = roomStatusEventDecoder.decode(data);

  if (!result.isOk()) {
    console.error(
      "webhookController.handleTwilioWebhook: unknown event",
      params,
      data,
    );
    await RoomStatusModel.create({
      event: null,
      rawEvent: params,
      success: false,
    });

    return false;
  }

  const event: RoomStatusEvent = result.value;

  try {
    switch (event.StatusCallbackEvent) {
      case "room-created":
        await onRoomCreated(event);
        break;
      case "room-ended":
        await onRoomEnded(event);
        break;
      case "participant-connected":
        await onParticipantConnected(event);
        break;
      case "participant-disconnected":
        await onParticipantDisconnected(event);
        break;
      default:
    }
  } catch (error) {
    // Do not throw to prevent Twilio from sending back the request, we saved the query in database
    // we need to fix something
    console.error(
      "webhookController.handleTwilioWebhook: failed to process event",
      error,
    );
    await RoomStatusModel.create({
      event,
      rawEvent: params,
      success: false,
    });
    return false;
  }

  // Out from try/catch to return error status on fail (twilio will retry the request
  await RoomStatusModel.create({
    event,
    rawEvent: params,
    success: true,
  });

  return true;
}
