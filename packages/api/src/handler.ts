import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  adminDecoder,
  handleAdminParticipants,
  handleAdminRooms,
} from "./admin/adminController";
import { cronController } from "./cron/cronHandler";
import {
  handleAdminPOST,
  handleHttpErrorResponse,
  handlePublicGET,
  handlePublicPOST,
} from "./io/io";
import { handleJoin, joinDecoder } from "./join/joinController";
import { connect } from "./mongo/client";
import { handleTwilioWebhook } from "./webhook/webhookController";

export async function join(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"join">(event, context, handleJoin, joinDecoder);
}

export async function webhookStatus(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicGET(event, context, handleTwilioWebhook);
}

export async function adminRooms(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handleAdminPOST<"admin/room">(
    event,
    context,
    handleAdminRooms,
    adminDecoder,
  );
}

export async function adminParticipants(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handleAdminPOST<"admin/participant">(
    event,
    context,
    handleAdminParticipants,
    adminDecoder,
  );
}

export async function cron(
  e: APIGatewayProxyEvent,
  context: Context,
): Promise<void> {
  try {
    await connect(context);
    await cronController();
  } catch (err) {
    await handleHttpErrorResponse(err);
  }
}
