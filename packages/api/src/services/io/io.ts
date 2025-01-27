import type {
  AdminData,
  AdminPostRoutes,
  GetRoutes,
  PublicPostRoutes,
} from "@amfa-team/room-service-types";
import { flush, init as initSentry } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import type { JsonDecoder } from "ts.data.json";
import { getEnv } from "../../utils/env";
import { close, connect } from "../mongo/client";
import { ForbiddenError, InvalidRequestError } from "./exceptions";
import { logger } from "./logger";
import type {
  AdminRequest,
  GetHandler,
  HandlerResult,
  PostHandler,
  PublicRequest,
} from "./types";

function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH",
    "Access-Control-Allow-Headers":
      "Content-Type,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-User-Id",
    "Access-Control-Allow-Origin": "*",
  };
}

export function setup() {
  initSentry({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.SENTRY_ENVIRONMENT,
    enabled: !process.env.IS_OFFLINE,
  });
}

export async function init(context: Context | null) {
  logger.info("io.init: will");
  await connect(context);
  logger.info("io.init: did");
}

export async function teardown(context: Context | null) {
  logger.info("io.teardown: will");
  close(context);
  await flush(2000);
  logger.info("io.teardown: did");
}

export function parse(body: string | null): unknown {
  try {
    return body === null ? body : JSON.parse(body);
  } catch (e) {
    throw new InvalidRequestError(`Unable to parse body: ${e.message}`);
  }
}

function decode<T>(data: unknown, decoder: JsonDecoder.Decoder<T>): T {
  const result = decoder.decode(data);

  if (!result.isOk()) {
    throw new InvalidRequestError(result.error);
  }

  return result.value;
}

export function parseHttpPublicRequest<T>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>,
  jsonParse: boolean,
): PublicRequest<T> {
  const rawBody = event.body;
  logger.info("io.parseHttpPublicRequest: will", { rawBody, jsonParse });
  const body = jsonParse ? parse(rawBody) : rawBody;
  const data = decode(body, decoder);
  logger.info("io.parseHttpPublicRequest: did", {
    rawBody,
    data,
    body,
    jsonParse,
  });
  return { data };
}

export function parseHttpAdminRequest<T extends AdminData>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>,
): AdminRequest<T> {
  const body = parse(event.body);
  const req = { data: decode(body, decoder) };

  if (req.data.secret !== getEnv("API_SECRET")) {
    throw new ForbiddenError("parseHttpAdminRequest: invalid secret", {
      data: req.data,
    });
  }

  return req;
}

export async function handleHttpErrorResponse(
  e: unknown,
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (e instanceof InvalidRequestError) {
    return {
      statusCode: e.code,
      headers: { ...getCorsHeaders() },
      body: JSON.stringify({
        success: false,
        error: e.message,
        reason: e.reason,
      }),
    };
  }

  logger.error(e, "handleHttpErrorResponse", { event });

  return {
    statusCode: 500,
    headers: { ...getCorsHeaders() },
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export function handleSuccessResponse(
  data: HandlerResult<unknown>,
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      ...getCorsHeaders(),
      ...data.headers,
    },
    body: JSON.stringify({
      success: true,
      payload: data.payload,
    }),
  };
}

export async function handlePublicGET<P extends keyof GetRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: GetHandler<P>,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);
    const result = await handler(
      event.queryStringParameters,
      event.headers,
      event.requestContext,
    );
    return handleSuccessResponse(result);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}

export async function handlePublicPOST<P extends keyof PublicPostRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<PublicPostRoutes[P]["in"]>,
  jsonParse: boolean = true,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);
    const { data } = await parseHttpPublicRequest(event, decoder, jsonParse);
    const result = await handler(data, event.headers, event.requestContext);
    return handleSuccessResponse(result);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}

export async function handleAdminPOST<P extends keyof AdminPostRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<AdminPostRoutes[P]["in"]>,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);
    const { data } = await parseHttpAdminRequest(event, decoder);
    const result = await handler(data, event.headers, event.requestContext);
    return handleSuccessResponse(result);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}
