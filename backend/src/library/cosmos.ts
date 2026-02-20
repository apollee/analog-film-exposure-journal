import { CosmosClient } from "@azure/cosmos";

console.log("COSMOS MODULE LOADED");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
});

const database = client.database(process.env.COSMOS_DATABASE_NAME!);

export const rollsContainer = database.container(
  process.env.COSMOS_ROLLS_CONTAINER!
);

export const framesContainer = database.container(
  process.env.COSMOS_FRAMES_CONTAINER!
);

console.log(rollsContainer.id);
