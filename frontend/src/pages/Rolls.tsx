import { useEffect, useState } from "react";
import { fetchRolls } from "../api/rolls.api";
import { Link } from "react-router-dom";
import type { Roll } from "../types/roll";
import JournalRoll from "../components/JournalRoll";
import "./Rolls.css";

export default function Rolls() {
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"IN_PROGRESS" | "DEVELOPED">("IN_PROGRESS");

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

  if (loading) return <p>Loading rolls...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const shooting = rolls.filter((roll) => roll.status === "IN_PROGRESS");
  const developed = rolls.filter((roll) => roll.status === "DEVELOPED");
  const filtered = activeTab === "IN_PROGRESS" ? shooting : developed;

  return (
    <section className="rolls-page">
      <header className="rolls-header">
        <div className="rolls-title">
          <span className="rolls-accent" aria-hidden />
          <div>
            <h1>My Rolls</h1>
            <p className="rolls-sub">
              <span className="rolls-emoji" aria-hidden>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="7" y="8" width="10" height="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="6" cy="7" r="1" fill="currentColor" />
                  <circle cx="6" cy="12" r="1" fill="currentColor" />
                  <circle cx="6" cy="17" r="1" fill="currentColor" />
                  <circle cx="18" cy="7" r="1" fill="currentColor" />
                  <circle cx="18" cy="12" r="1" fill="currentColor" />
                  <circle cx="18" cy="17" r="1" fill="currentColor" />
                </svg>
              </span>
              {rolls.length} rolls in journal
            </p>
          </div>
        </div>
        <Link className="primary-btn" to="/journal-rolls/new">
          + New Roll
        </Link>
      </header>

      <div className="rolls-tabs">
        <button
          type="button"
          className={activeTab === "IN_PROGRESS" ? "tab active" : "tab"}
          onClick={() => setActiveTab("IN_PROGRESS")}
        >
          Shooting ({shooting.length})
        </button>
        <button
          type="button"
          className={activeTab === "DEVELOPED" ? "tab active" : "tab"}
          onClick={() => setActiveTab("DEVELOPED")}
        >
          Developed ({developed.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="rolls-empty">No rolls in this view yet.</p>
      ) : (
        <div className="rolls-list">
          {filtered.map((roll) => (
            <JournalRoll key={roll.id} roll={roll} />
          ))}
        </div>
      )}
    </section>
  );
}
