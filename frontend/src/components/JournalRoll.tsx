import { Link } from "react-router-dom";
import type { Roll } from "../types/roll";

export default function JournalRoll({
  id,
  name,
  filmStock,
  iso,
  notes,
  status,
}: Roll) {
  return (
    <Link to={`/journal-rolls/${id}`}>
        <div>
        <h2>{name}</h2>
        <p>
            {filmStock} – ISO {iso}
        </p>
        <p>{notes}</p>
        <p>{status}</p>
        </div>
    </Link>
  );
}