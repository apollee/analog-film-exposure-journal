import { useEffect, useState } from "react";
import { fetchRolls } from "../api/rolls.api";
import type { Roll } from "../types/roll";
import JournalRoll from "../components/JournalRoll";

export default function Rolls() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRolls() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRolls();
        setRolls(data);

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    loadRolls();
  }, []);

  if (loading) return <p>Loading rolls…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h1>My Rolls</h1>

      {rolls.length === 0 ? (
        <p>No rolls yet.</p>
      ) : (
        rolls.map((roll) => (
          <JournalRoll key={roll.id} roll={roll} />
        ))
      )}
    </div>
  );
}