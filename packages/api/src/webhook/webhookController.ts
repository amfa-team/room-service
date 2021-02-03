import querystring from "querystring";
import type { APIGatewayProxyEventHeaders } from "aws-lambda";
import { logger } from "../services/io/logger";
import type { HandlerResult } from "../services/io/types";
import {
  onParticipantConnected,
  onParticipantDisconnected,
  onRoomCreated,
  onRoomEnded,
} from "../services/lifecycleService";
import { getModels } from "../services/mongo/client";
import { verifyWebhook } from "../twilio/client";
import type { RoomStatusEvent } from "../twilio/webhook";
import { roomStatusEventDecoder } from "../twilio/webhook";

export async function handleTwilioWebhook(
  params: string | null,
  headers: APIGatewayProxyEventHeaders,
): Promise<HandlerResult<boolean>> {
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
  const { RoomStatusModel } = await getModels();

  if (!result.isOk()) {
    logger.error(
      new Error("webhookController.handleTwilioWebhook: unknown event"),
      null,
      { params, data },
    );
    await RoomStatusModel.create({
      event: null,
      rawEvent: params,
      success: false,
    });

    return { payload: false };
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
    logger.error(
      error,
      "webhookController.handleTwilioWebhook: failed to process event",
      { params, data },
    );
    await RoomStatusModel.create({
      event,
      rawEvent: params,
      success: false,
    });
    return { payload: false };
  }

  // Out from try/catch to return error status on fail (twilio will retry the request
  await RoomStatusModel.create({
    event,
    rawEvent: params,
    success: true,
  });

  return { payload: true };
}
