import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getRolls } from "../services/rolls.service";

export async function getRollsHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /rolls called");
  return {
    jsonBody: getRolls(),
  };
}

app.http("getRolls", {
  methods: ["GET"],
  route: "rolls",
  handler: getRollsHandler,
});