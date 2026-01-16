import { Link } from "react-router-dom";
import type { Roll } from "../types/roll";
import "./JournalRoll.css";
import FilmColorIcon from "../utils/icons";

function StatusBadge({ status }: { status: "IN_PROGRESS" | "DEVELOPED" }) {
  return (
    /*convert to lowercase for class naming*/
    <span className={`status-badge ${status.toLowerCase()}`}> 
      {status === "IN_PROGRESS" ? "In progress" : "Developed"}
    </span>
  );
}


export default function JournalRoll({
  roll
}: { roll: Roll }) {
  return (
    <Link to={`/journal-rolls/${roll.id}`} className="roll-card">
        <div className="roll-header">
          <div className="roll-header-left" />
          <h2 className="roll-title">{roll.name}</h2>
          <StatusBadge status={roll.status} />
        </div>
        <p>{roll.filmStock} – ISO {roll.iso}</p>

        <div className="roll-meta">
          <FilmColorIcon rollType={roll.rollColor} />
          <p>
            {roll.rollColor === "COLOR" ? "Color film" : "Black & white"}
          </p>
          <p>{roll.notes}</p>
        </div>
    </Link>
  );
}