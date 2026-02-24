import { CosmosClient } from "@azure/cosmos";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

let client: CosmosClient | null = null;

function getClient() {
  if (!client) {
    if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
      throw new Error("Cosmos environment variables not configured");
    }

    client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY,
    });
    throw new Error("COSMOS CLIENT WAS CREATED");
  }

  return client;
}

export function getRollsContainer(context: InvocationContext) {
  context.log("Getting values from Cosmos client");
  context.log("ENV ENDPOINT:", process.env.COSMOS_ENDPOINT);
  context.log("ENV DB:", process.env.COSMOS_DATABASE_NAME);
  context.log("ENV CONTAINER:", process.env.COSMOS_ROLLS_CONTAINER);
  const database = getClient().database(process.env.COSMOS_DATABASE_NAME!);

  
  return { fake: true } as any;
  //const database = getClient().database(process.env.COSMOS_DATABASE_NAME!);
  return database.container(process.env.COSMOS_ROLLS_CONTAINER!);
}

export function getFramesContainer() {
  const database = getClient().database(process.env.COSMOS_DATABASE_NAME!);
  return database.container(process.env.COSMOS_FRAMES_CONTAINER!);
}