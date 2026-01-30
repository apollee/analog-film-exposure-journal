import { HttpRequest} from "@azure/functions";

export function getUserFromHeader(req: HttpRequest) {
  const principal = req.headers.get("x-ms-client-principal");
  if (!principal) return null;

  const decoded = Buffer.from(principal, "base64").toString("utf-8");
  return JSON.parse(decoded);
}