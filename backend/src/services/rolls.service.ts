import { randomUUID } from "crypto";
import { getFramesContainer, getRollsContainer } from "../library/cosmos";

export async function createRoll(userId: string, data: any) {
  const container = await getRollsContainer();

  const roll = {
    id: randomUUID(),
    userId,
    name: data.name,
    filmStock: data.filmStock,
    iso: data.iso,
    cameraUsed: data.cameraUsed ?? "",
    notes: data.notes ?? "",
    status: data.status ?? "active", // change to in progress?
    rollType: data.rollType,
    createdAt: new Date().toISOString()
  };

  const { resource } = await container.items.create(roll);
  return resource;
}

export async function getRollsByUser(userId: string) {
  const container = await getRollsContainer();

  const querySpec = {
    query: "SELECT * FROM c WHERE c.userId = @userId",
    parameters: [
      { name: "@userId", value: userId }
    ]
  };

  const { resources } = await container.items
    .query(querySpec)
    .fetchAll();

  return resources;
}

export async function getRollById(id: string, userId: string) {
  const container = await getRollsContainer();

  try {
    const { resource } = await container.item(id, userId).read();
    return resource;
  } catch (error) {
    return null;
  }
}

export async function deleteRoll(id: string, userId: string) {
  const rollsContainer = await getRollsContainer();
  const framesContainer = await getFramesContainer();

  // Delete all frames for this roll first (partition key is rollId).
  const { resources: frames } = await framesContainer.items
    .query("SELECT c.id FROM c", { partitionKey: id })
    .fetchAll();

  for (const frame of frames) {
    await framesContainer.item(frame.id, id).delete();
  }

  await rollsContainer.item(id, userId).delete();
}

export async function updateRoll(id: string, userId: string, updates: any) {
  const container = await getRollsContainer();

  const { resource } = await container.item(id, userId).read();

  const updated = {
    ...resource,
    ...updates
  };

  const { resource: replaced } = await container
    .item(id, userId)
    .replace(updated);

  return replaced;
}
