import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "crypto";
import { getRollsByUser, createRoll } from "../services/rolls.service";
import { getUserFromHeader } from "../utils/auth";
import { getRollsContainer } from "../library/cosmos";

export async function getRollsHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /rolls called");
  const rollsContainer = getRollsContainer();
  context.log("Rolls container:", rollsContainer);
  
  
  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      jsonBody: { message: "No user authenticated"},
    };
  }
  const userId = user.userId;
  context.log("User ID:", userId);

  const rolls = await getRollsByUser(userId);

  return {
    status: 200,
    jsonBody: {
      userId,
      rolls,
    },
  };
}

export async function createRollHandler(req, context) {
  context.log("CreateRollHandler hit");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      jsonBody: { message: "No user authenticated" },
    };
  }

  const body = await req.json();

  try {
    const savedRoll = await createRoll(user.userId, body);

    return {
      status: 201,
      jsonBody: savedRoll,
    };
  } catch (error) {
    context.log("Error creating roll:", error);
    return {
      status: 500,
      jsonBody: { message: "Failed to create roll" },
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