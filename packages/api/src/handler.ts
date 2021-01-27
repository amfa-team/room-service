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

export const join: any = AWSLambda.wrapHandler(async function join(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"join">(event, context, handleJoin, joinDecoder);
});

export const webhookStatus: any = AWSLambda.wrapHandler(
  async function webhookStatus(
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
  },
);

export const adminRooms: any = AWSLambda.wrapHandler(async function adminRooms(
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

export const adminParticipants: any = AWSLambda.wrapHandler(
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
