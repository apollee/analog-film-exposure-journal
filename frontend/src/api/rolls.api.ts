import type { Roll } from "../types/roll";

export async function fetchRolls(): Promise<Roll[]> {
  const response = await fetch("/api/rolls");

  if (!response.ok) {
    throw new Error("Failed to fetch rolls");
  }

  return response.json();
}


export async function createRoll(payload: {
  name: string;
  filmStock: string;
  iso: number;
  notes?: string;
}) {
  const response = await fetch("/api/rolls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create roll");
  }

  return response.json();
}