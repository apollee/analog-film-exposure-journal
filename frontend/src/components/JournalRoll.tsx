import { Link } from "react-router-dom";
import type { Roll } from "../types/roll";
import "./JournalRoll.css";

export default function JournalRoll({
  roll
}: { roll: Roll }) {
  return (
    <Link to={`/journal-rolls/${roll.id}`} className="roll-card">
        <div>
        <h2>{roll.name}</h2>
        <p>
            {roll.filmStock} – ISO {roll.iso}
        </p>
        <p>{roll.notes}</p>
        <p>{roll.status}</p>
        <p>{roll.rollType}</p>
        </div>
    </Link>
  );
}