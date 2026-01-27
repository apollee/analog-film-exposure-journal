import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function Health(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return {
        status: 200,
        jsonBody: { status: "ok" }
    };
}

app.http('Health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "health",
    handler: Health
});
