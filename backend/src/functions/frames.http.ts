import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getUserFromHeader } from "../utils/auth";
import { getFramesByRoll, createFrame } from "../services/frames.service";

export async function framesHandler(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  const user = getUserFromHeader(req);

  if (!user) {
    return {
      status: 401,
      jsonBody: { message: "No user authenticated" },
    };
  }

  const rollId = req.params.rollId;

  if (!rollId) {
    return {
      status: 400,
      jsonBody: { message: "rollId is required" },
    };
  }

  try {
    if (req.method === "GET") {
      const frames = await getFramesByRoll(user.userId, rollId);

      return {
        status: 200,
        jsonBody: frames,
      };
    }

    if (req.method === "POST") {
      const body = await req.json();

      const frame = await createFrame(user.userId, rollId, body);

      return {
        status: 201,
        jsonBody: frame,
      };
    }

    return { status: 405 };

  } catch (error: any) {
    context.log("Frames error:", error);

    return {
      status: 500,
      jsonBody: { message: error.message || "Internal server error" },
    };
  }
}

app.http("framesHandler", {
  methods: ["GET", "POST"],
  route: "rolls/{rollId}/frames",
  handler: framesHandler,
});