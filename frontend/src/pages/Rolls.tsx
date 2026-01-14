import Roll from "../components/JournalRoll";

const mockRolls = [
  {
    id: "1",
    name: "Lisbon Street Walk",
    filmStock: "Kodak Portra 400",
    iso: 400,
    notes: "",
    status: "IN_PROGRESS",
  },
  {
    id: "2",
    name: "Beach Day",
    filmStock: "Kodak Gold 200",
    iso: 200,
    notes: "",
    status: "IN_PROGRESS",
  },
];

export default function Rolls() {
  return (
    <div>
      <h1>Film Rolls List</h1>
        {mockRolls.map((roll) => (
          <Roll
            key={roll.id}
            id={roll.id}
            name={roll.name}
            filmStock={roll.filmStock}
            iso={roll.iso}
            notes=""
          />
        ))}
    </div>
  );
}