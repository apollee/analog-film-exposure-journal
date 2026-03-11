import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getUserFromHeader } from "../utils/auth";
import { getFramesByRoll, createFrame } from "../services/frames.service";
import { getCorrelationContext, logError, logInfo, logWarn, withCorrelationHeader } from "../utils/logging";

export async function framesHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "frames.request");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }

  const rollId = req.params.rollId;

  if (!rollId) {
    logWarn(context, req, logContext, "frames.missing_roll_id");
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "rollId is required" },
    };
  }

  try {
    if (req.method === "GET") {
      const frames = await getFramesByRoll(user.userId, rollId);

      return {
        status: 200,
        headers: withCorrelationHeader(undefined, logContext.correlationId),
        jsonBody: frames,
      };
    }

    if (req.method === "POST") {
      const body = await req.json();

      const frame = await createFrame(user.userId, rollId, body);

      return {
        status: 201,
        headers: withCorrelationHeader(undefined, logContext.correlationId),
        jsonBody: frame,
      };
    }

    return {
      status: 405,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
    };

  } catch (error: any) {
    logError(context, req, logContext, "frames.error", error, { rollId, userId: user.userId });

    return {
      status: 500,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: error.message || "Internal server error" },
    };
  }
}

app.http("framesHandler", {
  methods: ["GET", "POST"],
  route: "rolls/{rollId}/frames",
  handler: framesHandler,
});
