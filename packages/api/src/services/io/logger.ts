/* eslint-disable no-console */

import {
  Severity,
  addBreadcrumb,
  captureException,
  withScope,
} from "@sentry/serverless";

export const logger = {
  error(
    error: unknown,
    message: string | null = null,
    extra: Record<string, unknown> = {},
  ): void {
    console.error(message, error, extra);

    if (!process.env.IS_OFFLINE) {
      withScope((scope) => {
        scope.setExtras(extra);
        if (message) {
          scope.setExtra("msg", message);
        }
        captureException(error);
      });
    }
  },
  warn(message: string, extra: Record<string, unknown> = {}) {
    console.warn(message, extra);

    if (!process.env.IS_OFFLINE) {
      addBreadcrumb({
        category: "warn",
        message,
        level: Severity.Warning,
        data: extra,
      });
    }
  },
  info(message: string, extra: Record<string, unknown> = {}) {
    console.info(message, extra);

    if (!process.env.IS_OFFLINE) {
      addBreadcrumb({
        category: "info",
        message,
        level: Severity.Info,
        data: extra,
      });
    }
  },
  log(message: string, extra: Record<string, unknown> = {}) {
    console.log(message, extra);

    if (!process.env.IS_OFFLINE) {
      addBreadcrumb({
        category: "log",
        message,
        level: Severity.Log,
        data: extra,
      });
    }
  },
};
