import type { Roll } from "../types/roll";
import JournalRoll from "../components/JournalRoll";

const mockRolls: Roll[] = [
  {
    id: "1",
    name: "Lisbon Street Walk",
    filmStock: "Kodak Portra 400",
    iso: 400,
    notes: "",
    status: "IN_PROGRESS",
    rollType: "COLOR"
  },
  {
    id: "2",
    name: "Beach Day",
    filmStock: "Kodak Gold 200",
    iso: 200,
    notes: "",
    status: "DEVELOPED",
    rollType: "COLOR"
  },
];

export default function Rolls() {
  return (
    <div>
      <h1>Film Rolls List</h1>
        {mockRolls.map((roll) => (
          <JournalRoll
            key={roll.id}
            roll={roll}
          />
        ))}
    </div>
  );
}