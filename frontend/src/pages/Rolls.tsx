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
                <svg viewBox="0 0 82.235 82.235" aria-hidden="true">
                  <path d="M41.676,19.922v43.24h40.559v-43.24H41.676z M55.164,60.076h-8.568v-4.495h8.568V60.076z M55.164,27.498h-8.568v-4.491h8.568V27.498z M66.91,60.076h-8.571v-4.495h8.571V60.076z M66.91,27.498h-8.571v-4.491h8.571V27.498z M78.656,60.076h-8.571v-4.495h8.571V60.076z M78.656,27.498h-8.571v-4.491h8.571V27.498z M39.249,17.495h3.697V9.267H26.841V6.669H16.105v2.598H0v8.228h3.697v47.692H0v8.228h16.105v2.151h10.737v-2.151h16.105v-8.228h-3.697V17.495z M35.67,65.194H7.276V17.688H35.67V65.194z M14.573,28.472h-4.252v-8.378h4.252V28.472z M14.573,39.774h-4.252v-8.378h4.252V39.774z M14.573,51.072h-4.252V42.69h4.252V51.072z M14.573,62.37h-4.252v-8.378h4.252V62.37z" fill="currentColor" />
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
