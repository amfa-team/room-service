import type { APIGatewayEventRequestContext } from "aws-lambda";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { ForbiddenError } from "../../io/exceptions";
import { getEnv } from "../../utils/env";

const USER_SERVICE_API_SECRET: string = getEnv("USER_SERVICE_API_SECRET");

const ISSUER = "user-service";

interface IPublicUser {
  id: string;
  registered: boolean;
}

export function parseUserServiceToken(token: string): IPublicUser {
  return jwt.verify(token, USER_SERVICE_API_SECRET, {
    issuer: ISSUER,
  }) as IPublicUser;
}

export async function checkBan(requestContext: APIGatewayEventRequestContext) {
  const res = await fetch(
    `${getEnv("USER_SERVICE_API_ENDPOINT")}admin/ban/check`,
    {
      method: "POST",
      body: JSON.stringify({
        plainIp: requestContext.identity.sourceIp,
        secret: getEnv("USER_SERVICE_API_SECRET"),
      }),
    },
  );

  const result = await res.json();

  const banned = result?.payload?.banned === true;

  if (banned) {
    throw new ForbiddenError();
  }
}
