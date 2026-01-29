import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getRolls } from "../services/rolls.service";

function getUserFromHeader(req: HttpRequest) {
  const principal = req.headers.get("x-ms-client-principal");
  if (!principal) return null;

  const decoded = Buffer.from(principal, "base64").toString("utf-8");
  return JSON.parse(decoded);
}

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

app.http("getRolls", {
  methods: ["GET"],
  route: "rolls",
  handler: getRollsHandler,
});