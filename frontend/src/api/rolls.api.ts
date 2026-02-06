import type { Roll } from "../types/roll";

export async function fetchRolls(): Promise<Roll[]> {
  console.log("Fetching rolls from API");
  const response = await fetch("/api/rolls", {
    credentials: "include",
  });

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
  rollType: "COLOR" | "BW" | "";
}) {

  console.log("Creating roll");
  const response = await fetch("/api/rolls-test", {
    method: "POST",
    credentials: "include",
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