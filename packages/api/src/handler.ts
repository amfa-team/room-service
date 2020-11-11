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
import {
  handleAdminPOST,
  handleHttpErrorResponse,
  handlePublicPOST,
  init,
} from "./io/io";
import { handleJoin, joinDecoder } from "./join/joinController";
import { handleTwilioWebhook } from "./webhook/webhookController";

export const join = AWSLambda.wrapHandler(async function join(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"join">(event, context, handleJoin, joinDecoder);
});

export const webhookStatus = AWSLambda.wrapHandler(async function webhookStatus(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"webhook/twilio/status">(
    event,
    context,
    handleTwilioWebhook,
    JsonDecoder.string,
    false,
  );
});

export const adminRooms = AWSLambda.wrapHandler(async function adminRooms(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handleAdminPOST<"admin/room">(
    event,
    context,
    handleAdminRooms,
    adminDecoder,
  );
});

export const adminParticipants = AWSLambda.wrapHandler(
  async function adminParticipants(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/participant">(
      event,
      context,
      handleAdminParticipants,
      adminDecoder,
    );
  },
);

export const cron = AWSLambda.wrapHandler(async function cron(
  e: APIGatewayProxyEvent,
  context: Context,
): Promise<void> {
  try {
    await init(context);
    await cronController();
  } catch (err) {
    await handleHttpErrorResponse(err, e);
  }
});
