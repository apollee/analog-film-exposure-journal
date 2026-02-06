import type { Roll } from "../types/roll";

export async function fetchRolls(): Promise<Roll[]> {
  console.log("Fetching rolls from API");
  const response = await fetch("/api/rolls", {
  });

  if (!response.ok) {
    throw new Error("Failed to fetch rolls");
  }

  const data = await response.json();

  return data.rolls;
}


export async function createRoll(payload: {
  name: string;
  filmStock: string;
  iso: number;
  notes?: string;
  rollType: "COLOR" | "BW" | "";
}) {

  console.log("Creating roll");
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

  const data = await response.json();

  return data;

}