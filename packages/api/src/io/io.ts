import type { GetRoutes, PostRoutes } from "@amfa-team/types";
import { captureException, flush, init } from "@sentry/node";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import type { JsonDecoder } from "ts.data.json";
import { connect } from "../mongo/client";
import { InvalidRequestError } from "./exceptions";
import type { GetHandler, PostHandler, PublicRequest } from "./types";

if (!process.env.IS_OFFLINE) {
  init({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.SENTRY_ENVIRONMENT,
  });
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
): PublicRequest<T> {
  const body = parse(event.body);
  return { data: decode(body, decoder) };
}

export async function handleHttpErrorResponse(
  e: unknown,
): Promise<APIGatewayProxyResult> {
  if (e instanceof InvalidRequestError) {
    return {
      statusCode: e.code,
      body: JSON.stringify({
        success: false,
        error: e.message,
      }),
    };
  }

  if (!process.env.IS_OFFLINE) {
    captureException(e);
    await flush(2000);
  } else {
    console.error(e);
  }

  return {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export function handleSuccessResponse(data: unknown): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success: true,
      payload: data,
    }),
  };
}

export async function handlePublicGET<P extends keyof GetRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: GetHandler<P>,
): Promise<APIGatewayProxyResult> {
  try {
    await connect(context);
    const payload = await handler();
    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}

export async function handlePublicPOST<P extends keyof PostRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<PostRoutes[P]["in"]>,
): Promise<APIGatewayProxyResult> {
  try {
    await connect(context);
    const { data } = await parseHttpPublicRequest(event, decoder);
    const payload = await handler(data);
    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e);
  }
}
