import { Link } from "react-router-dom";
import type { Roll } from "../types/roll";
import { FILM_STOCKS } from "../constants/filmStocks";
import "./JournalRoll.css";

function StatusPill({ status }: { status: "IN_PROGRESS" | "DEVELOPED" }) {
  return (
    <span className={`status-pill ${status.toLowerCase()}`}>
      {status === "IN_PROGRESS" ? "SHOOTING" : "DEV"}
    </span>
  );
}

export default function JournalRoll({ roll }: { roll: Roll }) {
  const filmStockLabel =
    FILM_STOCKS.find((stock) => stock.value === roll.filmStock)?.label ?? roll.filmStock;

  return (
    <Link to={`/journal-rolls/${roll.id}`} className="roll-card">
      <div className="roll-card-content">
        <div className="roll-card-top">
          <div>
            <h3 className="roll-title">{roll.name}</h3>
            <p className="roll-sub">{filmStockLabel} • ISO {roll.iso}</p>
            {roll.notes && <p className="roll-notes">{roll.notes}</p>}
          </div>
          <StatusPill status={roll.status} />
        </div>
      </div>
    </Link>
  );
}
