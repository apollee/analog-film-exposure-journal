import { randomUUID } from "crypto";
import { getRollsContainer } from "../library/cosmos";

export async function createRoll(userId: string, data: any) {
  const container = getRollsContainer();

  const roll = {
    id: randomUUID(),
    userId,
    name: data.name,
    filmStock: data.filmStock,
    iso: data.iso,
    notes: data.notes ?? "",
    status: data.status ?? "active", // default
    rollType: data.rollType,
    createdAt: new Date().toISOString()
  };

  const { resource } = await container.items.create(roll);
  return resource;
}

export async function getRollsByUser(userId: string) {
  const container = getRollsContainer();

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

export async function deleteRoll(id: string, userId: string) {
  const container = getRollsContainer();

  await container.item(id, userId).delete();
}

export async function updateRoll(id: string, userId: string, updates: any) {
  const container = getRollsContainer();

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