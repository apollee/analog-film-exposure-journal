import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getFrames } from "../services/frames.service";
import { getUserFromHeader } from "../utils/auth";

export async function getFramesHandler(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("GET /frames called");

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      jsonBody: { message: "No user authenticated"},
    };
  }
  const userId = user.userId;
  context.log("User ID:", userId);

  const frames = getFrames();

  return {
    status: 200,
    jsonBody: {
      userId,
      frames,
    },
  };
}

app.http("getFrames", {
  methods: ["GET"],
  route: "frames",
  handler: getFramesHandler,
});
