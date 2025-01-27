import type {
  AdminData,
  GetRoutes,
  PostRoutes,
} from "@amfa-team/room-service-types";
import type {
  APIGatewayEventRequestContext,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";

export interface PublicRequest<T> {
  data: T;
}

export type AdminRequest<T extends AdminData> = PublicRequest<T>;

export interface RequestContext {
  domainName?: string;
  stage: string;
}

export interface HandlerResult<T> {
  payload: T;
  headers?: Record<string, string>;
}

export type GetHandler<P extends keyof GetRoutes> = (
  params: APIGatewayProxyEventQueryStringParameters | null,
  headers: APIGatewayProxyEventHeaders,
  requestContext: APIGatewayEventRequestContext,
) => Promise<HandlerResult<GetRoutes[P]["out"]>>;

export type PostHandler<P extends keyof PostRoutes> = (
  data: PostRoutes[P]["in"],
  headers: APIGatewayProxyEventHeaders,
  requestContext: APIGatewayEventRequestContext,
) => Promise<HandlerResult<PostRoutes[P]["out"]>>;
