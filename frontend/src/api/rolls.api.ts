import type { Roll } from "../types/roll";

export async function fetchRolls(): Promise<Roll[]> {
  const response = await fetch("/api/rolls");

  if (!response.ok) {
    throw new Error("Failed to fetch rolls");
  }

  return response.json();
}