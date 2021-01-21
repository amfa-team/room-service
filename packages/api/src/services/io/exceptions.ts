/* eslint-disable max-classes-per-file */

import { logger } from "./logger";

export class InvalidRequestError extends Error {
  readonly code: 400 | 403;

  reason: string;

  constructor(
    message = "invalid request",
    code: 400 | 403 = 400,
    reason: string | null = null,
  ) {
    super(message);
    this.code = code;
    this.reason = reason ?? message;
  }
}

export class ForbiddenError extends InvalidRequestError {
  constructor(reason: string, extra: Record<string, unknown>) {
    super("Forbidden", 403, reason);

    logger.error(this, reason, extra);
  }
}
