import type { Roll } from "../types/roll";

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
        <p>{roll.status}</p>
        <p>{roll.rollType}</p>
        </div>
  );
}