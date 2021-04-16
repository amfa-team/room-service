import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import {
  adminDecoder,
  handleAdminParticipants,
  handleAdminRooms,
} from "./admin/adminController";
import { cronController } from "./cron/cronHandler";
import { handleJoin, joinDecoder } from "./join/joinController";
import { NotFoundError } from "./services/io/exceptions";
import {
  handleAdminPOST,
  handleHttpErrorResponse,
  handlePublicPOST,
  handleSuccessResponse,
  init,
  setup,
  teardown,
} from "./services/io/io";
import { handleTwilioWebhook } from "./webhook/webhookController";

setup();

export const handler: any = AWSLambda.wrapHandler(async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  switch (event.resource) {
    case "/join":
      return handlePublicPOST<"join">(event, context, handleJoin, joinDecoder);
    case "/webhook/twilio/status":
      return handlePublicPOST<"webhook/twilio/status">(
        event,
        context,
        handleTwilioWebhook,
        JsonDecoder.string,
        false,
      );
    case "/admin/room":
      return handleAdminPOST<"admin/room">(
        event,
        context,
        handleAdminRooms,
        adminDecoder,
      );
    case "/admin/participant":
      return handleAdminPOST<"admin/participant">(
        event,
        context,
        handleAdminParticipants,
        adminDecoder,
      );
    default:
      return handleHttpErrorResponse(new NotFoundError(event.resource), event);
  }
});

export const cron: any = AWSLambda.wrapHandler(async function cron(
  e: APIGatewayProxyEvent,
  context: Context,
) {
  try {
    await init(context);
    await cronController();

    await teardown(context);
    return handleSuccessResponse({ payload: null });
  } catch (err) {
    await teardown(context);
    return handleHttpErrorResponse(err, e);
  }
});
