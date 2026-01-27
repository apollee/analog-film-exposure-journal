import { Roll } from "../models/roll.model";

const mockRolls: Roll[] = [
  {
    id: "1",
    name: "Lisbon Walk",
    filmStock: "Kodak Portra 400",
    iso: 400,
    notes: "",
    status: "IN_PROGRESS",
    rollType: "COLOR",
  },
];

export function getRolls(): Roll[] {
  return mockRolls;
}