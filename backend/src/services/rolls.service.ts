import { Roll } from "../models/roll.model";

const rolls: Roll[] = []; // In memory DB 

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

export function addRoll(roll: Roll): Roll {
  rolls.push(roll);
  return roll;
}