import { HttpRequest, InvocationContext } from "@azure/functions";
import { randomUUID } from "crypto";

type LogLevel = "info" | "warn" | "error";

type LogContext = {
  correlationId: string;
};

function getHeader(req: HttpRequest, name: string): string | undefined {
  const value = req.headers.get(name);
  return value === null ? undefined : value;
}

export function getCorrelationContext(req: HttpRequest): LogContext {
  const explicit =
    getHeader(req, "x-correlation-id") ||
    getHeader(req, "x-request-id") ||
    getHeader(req, "x-ms-client-request-id");

  return {
    correlationId: explicit || randomUUID(),
  };
}

function baseLogPayload(
  context: InvocationContext,
  req: HttpRequest,
  level: LogLevel,
  message: string,
  logContext: LogContext,
  extra?: Record<string, unknown>
) {
  return {
    level,
    message,
    correlationId: logContext.correlationId,
    functionName: context.functionName,
    method: req.method,
    url: req.url,
    ...extra,
  };
}

export function logInfo(
  context: InvocationContext,
  req: HttpRequest,
  logContext: LogContext,
  message: string,
  extra?: Record<string, unknown>
) {
  context.log(JSON.stringify(baseLogPayload(context, req, "info", message, logContext, extra)));
}

export function logWarn(
  context: InvocationContext,
  req: HttpRequest,
  logContext: LogContext,
  message: string,
  extra?: Record<string, unknown>
) {
  context.log(JSON.stringify(baseLogPayload(context, req, "warn", message, logContext, extra)));
}

export function logError(
  context: InvocationContext,
  req: HttpRequest,
  logContext: LogContext,
  message: string,
  error?: unknown,
  extra?: Record<string, unknown>
) {
  const err =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

  context.log(
    JSON.stringify(
      baseLogPayload(context, req, "error", message, logContext, {
        error: err,
        ...extra,
      })
    )
  );
}

export function withCorrelationHeader(
  headers: Record<string, string> | undefined,
  correlationId: string
): Record<string, string> {
  return {
    ...(headers || {}),
    "x-correlation-id": correlationId,
  };
}
