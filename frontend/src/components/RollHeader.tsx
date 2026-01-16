import type { Roll } from "../types/roll";
import "./RollDetails.css";
import FilmColorIcon from "../utils/icons";

type Props = {
  roll: Roll;
};

export default function RollHeader({ roll }: Props) {
  return ( 
    <div>
        <h1>{roll.id} - {roll.name}</h1>
        <p style={{ color: "var(--text-muted)" }}>
            {roll.filmStock} – ISO {roll.iso}
        </p>
        <p>{roll.notes}</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <span className={`status-badge ${roll.status.toLowerCase()}`}>
            {roll.status === "IN_PROGRESS" ? "In Progress" : "Developed"}
          </span>
          <FilmColorIcon rollType={roll.rollColor} />
          <span className={`roll-color-icon ${roll.rollColor.toLowerCase()}`}>
            {roll.rollColor === "COLOR" ? "Color film" : "Black & white"}
          </span>
        </div>
    </div>
  );
}
