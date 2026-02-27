import { getFramesContainer } from "../library/cosmos";
import { getRollsContainer } from "../library/cosmos";
import { randomUUID } from "crypto";

export async function createFrame(userId: string, rollId: string, data: any) {
  const rollsContainer = getRollsContainer();
  const framesContainer = getFramesContainer();

  const { resource: roll } = await rollsContainer
    .item(rollId, userId)
    .read();

  if (!roll) {
    throw new Error("Roll not found");
  }

  const countQuery = {
    query: "SELECT VALUE COUNT(1) FROM c"
  };

  const { resources: countResult } = await framesContainer.items.query(
    countQuery,
    { partitionKey: rollId }
  ).fetchAll();

  const frameNumber = (countResult[0] || 0) + 1;

  const frame = {
    id: randomUUID(),
    rollId,
    userId,
    frameNumber,
    settings: {
      aperture: data.settings.aperture,
      shutterSpeed: data.settings.shutterSpeed
    },
    note: data.note || "",
    review: null,
    createdAt: new Date().toISOString()
  };

  const { resource } = await framesContainer.items.create(frame);

  return resource;
}

export async function getFramesByRoll(userId: string, rollId: string) {
  const rollsContainer = getRollsContainer();
  const framesContainer = getFramesContainer();

  // Validate roll ownership
  const { resource: roll } = await rollsContainer
    .item(rollId, userId)
    .read();

  if (!roll) {
    throw new Error("Roll not found");
  }

  const { resources } = await framesContainer.items
    .query("SELECT * FROM c ORDER BY c.frameNumber ASC", {
      partitionKey: rollId
    })
    .fetchAll();

  return resources;
}

export async function updateFrameReview(
  userId: string,
  rollId: string,
  frameId: string,
  reviewData: any
) {
  const rollsContainer = getRollsContainer();
  const framesContainer = getFramesContainer();

  const { resource: roll } = await rollsContainer
    .item(rollId, userId)
    .read();

  if (!roll) {
    throw new Error("Roll not found");
  }

  if (roll.status !== "developed") {
    throw new Error("Roll is not developed yet");
  }

  const { resource: frame } = await framesContainer
    .item(frameId, rollId)
    .read();

  if (!frame) {
    throw new Error("Frame not found");
  }

  frame.review = {
    result: reviewData.result,
    note: reviewData.note || ""
  };

  const { resource: updated } = await framesContainer
    .item(frameId, rollId)
    .replace(frame);

  return updated;
}