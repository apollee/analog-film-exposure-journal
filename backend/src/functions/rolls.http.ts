import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "crypto";
import { getRolls } from "../services/rolls.service";
import { addRoll } from "../services/rolls.service";
import { getUserFromHeader } from "../utils/auth";
import { getRollsContainer } from "../library/cosmos";

export async function getRollsHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /rolls called");
  const rollsContainer = getRollsContainer(context);
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

  const rolls = getRolls();

  return {
    status: 200,
    jsonBody: {
      userId,
      rolls,
    },
  };
}

export async function createRollHandler(req, context) {
  context.log("CreateRollHandler is being hit");
  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      jsonBody: { message: "No user authenticated"},
    };
  }
  const userId = user.userId;
  context.log("User ID:", userId);

  const body = await req.json();

  const newRoll = {
    id: randomUUID(),
    userId: user.userId,
    name: body.name,
    filmStock: body.filmStock,
    iso: body.iso,
    notes: body.notes ?? "",
    status: body.status,
    rollType: body.rollType,
  };

  addRoll(newRoll);

  return {
    status: 201,
    jsonBody: newRoll,
  };
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