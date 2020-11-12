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
  handleSuccessResponse,
  init,
  teardown,
} from "./io/io";
import { logger } from "./io/logger";
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

export function cron(
  e: APIGatewayProxyEvent,
  ctx: Context,
  callback: (err: Error | null, e: APIGatewayProxyResult | null) => void,
  ...args: any[]
) {
  logger.info("cron: will", { e, ctx, callback, args });
  const fn = async () => {
    try {
      await init(null);
      await cronController();

      await teardown(null);
      return handleSuccessResponse(null);
    } catch (err) {
      logger.error(err);
      await teardown(null);
      return handleHttpErrorResponse(err, e);
    }
  };

  fn()
    .then((r) => callback(null, r))
    .catch((err) => callback(err, null));
}
