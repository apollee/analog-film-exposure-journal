import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getUserFromHeader } from "../utils/auth";
import { getFramesByRoll, createFrame, updateFrameReview } from "../services/frames.service";
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

export async function updateFrameReviewHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "frames.review.update.request");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }

  const rollId = req.params.rollId;
  const frameId = req.params.frameId;

  if (!rollId || !frameId) {
    logWarn(context, req, logContext, "frames.review.missing_params");
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "rollId and frameId are required" },
    };
  }

  const raw = await req.json();
  const body =
    raw && typeof raw === "object"
      ? (raw as {
          review?: { exposure?: string; notes?: string };
        })
      : {};

  const review = body.review;
  const exposure = review?.exposure;
  const notes = review?.notes;

  const allowed = ["underexposed", "overexposed", "well-exposed"];
  if (!exposure || !allowed.includes(exposure)) {
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "Invalid exposure value." },
    };
  }

  try {
    const updated = await updateFrameReview(user.userId, rollId, frameId, {
      exposure,
      notes,
    });

    return {
      status: 200,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: updated,
    };
  } catch (error: any) {
    logError(context, req, logContext, "frames.review.update.error", error, {
      rollId,
      frameId,
      userId: user.userId,
    });

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

app.http("frameReviewHandler", {
  methods: ["PATCH"],
  route: "rolls/{rollId}/frames/{frameId}/review",
  handler: updateFrameReviewHandler,
});
