import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getFrames } from "../services/frames.service";

export async function getFramesHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /frames called");
  return {
    jsonBody: getFrames(),
  };
}

app.http("getFrames", {
  methods: ["GET"],
  route: "frames",
  handler: getFramesHandler,
});