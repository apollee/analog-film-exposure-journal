import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getRollsByUser, getRollById, createRoll, updateRoll, deleteRoll } from "../services/rolls.service";
import { RollSchema } from "../schemas/roll.schema";
import { getUserFromHeader } from "../utils/auth";
import { getCorrelationContext, logError, logInfo, logWarn, withCorrelationHeader } from "../utils/logging";

export async function getRollsHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "rolls.list.request");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }
  const userId = user.userId;

  const rolls = await getRollsByUser(userId);

  return {
    status: 200,
    headers: withCorrelationHeader(undefined, logContext.correlationId),
    jsonBody: {
      userId,
      rolls,
    },
  };
}

export async function createRollHandler(req, context) {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "rolls.create.request");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }

  const body = await req.json();
  const parsed = RollSchema.safeParse(body);
  if (!parsed.success) {
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: parsed.error.issues.map((issue) => issue.message).join(", ") },
    };
  }

  try {
    const savedRoll = await createRoll(user.userId, parsed.data);

    return {
      status: 201,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: savedRoll,
    };
  } catch (error) {
    logError(context, req, logContext, "rolls.create.error", error);
    return {
      status: 500,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "Failed to create roll" },
    };
  }
}

export async function getRollByIdHandler(req, context) {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "rolls.get.request");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }

  const rollId = req.params.id;

  const roll = await getRollById(rollId, user.userId);

  if (!roll) {
    logWarn(context, req, logContext, "rolls.get.not_found", { rollId, userId: user.userId });
    return {
      status: 404,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "Roll not found" },
    };
  }

  return {
    status: 200,
    headers: withCorrelationHeader(undefined, logContext.correlationId),
    jsonBody: roll,
  };
}

export async function updateRollStatusHandler(req, context) {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "rolls.update_status.request");

  const user = getUserFromHeader(req);
  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }

  const rollId = req.params.id;
  if (!rollId) {
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "rollId is required" },
    };
  }

  const body = await req.json();
  const status = body?.status;

  if (status !== "IN_PROGRESS" && status !== "DEVELOPED") {
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "Invalid status. Use IN_PROGRESS or DEVELOPED." },
    };
  }

  try {
    const updated = await updateRoll(rollId, user.userId, { status });
    return {
      status: 200,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: updated,
    };
  } catch (error) {
    logError(context, req, logContext, "rolls.update_status.error", error, {
      rollId,
      userId: user.userId,
    });
    return {
      status: 500,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "Failed to update roll status" },
    };
  }
}

export async function deleteRollHandler(req, context) {
  const logContext = getCorrelationContext(req);
  logInfo(context, req, logContext, "rolls.delete.request");

  const user = getUserFromHeader(req);
  if (!user) {
    return {
      status: 401,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "No user authenticated" },
    };
  }

  const rollId = req.params.id;
  if (!rollId) {
    return {
      status: 400,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "rollId is required" },
    };
  }

  try {
    await deleteRoll(rollId, user.userId);
    return {
      status: 204,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
    };
  } catch (error) {
    logError(context, req, logContext, "rolls.delete.error", error, {
      rollId,
      userId: user.userId,
    });
    return {
      status: 500,
      headers: withCorrelationHeader(undefined, logContext.correlationId),
      jsonBody: { message: "Failed to delete roll" },
    };
  }
}

app.http("rollsHandler", {
  methods: ["GET", "POST"],
  route: "rolls",
  handler: async (req, context) => {
    if (req.method === "GET") {
      return getRollsHandler(req, context);
    } else if (req.method === "POST") {
      return createRollHandler(req, context);
    } else {
      return { status: 405 };
    }
  },
});

app.http("rollByIdHandler", {
  methods: ["GET", "PATCH", "DELETE"],
  route: "rolls/{id}",
  handler: async (req, context) => {
    if (req.method === "GET") {
      return getRollByIdHandler(req, context);
    } else if (req.method === "PATCH") {
      return updateRollStatusHandler(req, context);
    } else if (req.method === "DELETE") {
      return deleteRollHandler(req, context);
    } else {
      return { status: 405 };
    }
  },
});
