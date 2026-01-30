import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getRolls } from "../services/rolls.service";
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

app.http("getRolls", {
  methods: ["GET"],
  route: "rolls",
  handler: getRollsHandler,
});