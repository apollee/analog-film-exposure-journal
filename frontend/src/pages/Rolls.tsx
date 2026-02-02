import { useEffect, useState } from "react";
import { fetchRolls } from "../api/rolls.api";

import type { Roll } from "../types/roll";
import JournalRoll from "../components/JournalRoll";

export default function Rolls() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRolls()
      .then(setRolls)
      .catch(() => setError("Could not load rolls"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading rolls…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {rolls.map((roll) => (
        <JournalRoll key={roll.id} roll={roll} />
      ))}
    </div>
  );
}