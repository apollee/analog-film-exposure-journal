import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { randomUUID } from "crypto";
import { getRolls } from "../services/rolls.service";
import { addRoll } from "../services/rolls.service";
import { getUserFromHeader } from "../utils/auth";

export async function getRollsHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /rolls called");
  
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

app.http("getRolls", {
  methods: ["GET"],
  authLevel: "anonymous", 
  route: "rolls",
  handler: getRollsHandler,
});

app.http("createRoll", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "rolls",
  handler: createRollHandler,
});