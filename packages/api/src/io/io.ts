import type {
  AdminData,
  AdminPostRoutes,
  GetRoutes,
  PublicPostRoutes,
} from "@amfa-team/types";
import { captureException, flush, init } from "@sentry/node";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import type { JsonDecoder } from "ts.data.json";
import { connect } from "../mongo/client";
import { ForbiddenError, InvalidRequestError } from "./exceptions";
import type {
  AdminRequest,
  GetHandler,
  PostHandler,
  PublicRequest,
} from "./types";

if (!process.env.IS_OFFLINE) {
  init({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.SENTRY_ENVIRONMENT,
  });
}

const SECRET = process.env.SECRET ?? "";

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

export function parseHttpAdminRequest<T extends AdminData>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>,
): AdminRequest<T> {
  const body = parse(event.body);
  const req = { data: decode(body, decoder) };

  if (req.data.secret !== SECRET) {
    throw new ForbiddenError();
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
      body: JSON.stringify({
        success: false,
        error: e.message,
      }),
    };
  }

  console.log("handleHttpErrorResponse: event", event);
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
    const payload = await handler(event.queryStringParameters, event.headers);
    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}

export async function handlePublicPOST<P extends keyof PublicPostRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<PublicPostRoutes[P]["in"]>,
): Promise<APIGatewayProxyResult> {
  try {
    await connect(context);
    const { data } = await parseHttpPublicRequest(event, decoder);
    const payload = await handler(data);
    return handleSuccessResponse(payload);
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
    await connect(context);
    const { data } = await parseHttpAdminRequest(event, decoder);
    const payload = await handler(data);
    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}
