import { useState } from "react";
import { FILM_STOCKS } from "../constants/filmStocks";
import { ISO_VALUES } from "../constants/exposureValues";
import { createRoll } from "../api/rolls.api";
import { useNavigate } from "react-router-dom";
import "./CreateRoll.css";

export default function CreateRoll() {
  const [name, setName] = useState("");
  const [filmStock, setFilmStock] = useState("");
  const [rollType, setRollType] = useState<"COLOR" | "BLACK_AND_WHITE" | "">("");
  const [iso, setIso] = useState(400);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await createRoll({
        name,
        filmStock,
        iso,
        notes,
        rollType,
        status: "IN_PROGRESS"
      });
      navigate("/journal-rolls");
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to create roll");
        }
    } finally {
      setLoading(false);
    }
  }

  function handleFilmStockChange(value: string) {
    setFilmStock(value);

    const selected = FILM_STOCKS.find((f) => f.value === value);

    if (selected?.type) {
      setRollType(selected.type);
    } else {
      setRollType("");
    }
  }

  return (
    <div className="create-roll-page">
      <form onSubmit={handleSubmit} className="create-roll-card">
        <button
          type="button"
          className="create-roll-close"
          onClick={() => navigate("/journal-rolls")}
          aria-label="Close"
        >
          x
        </button>
        <h1>New Film Roll</h1>
        <p className="create-roll-sub">Start a new roll entry in the journal</p>

        <div className="create-roll-fields">
          <label>
            Roll Name
            <input
              placeholder="e.g. Weekend in Porto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Film Stock
            <select
              value={filmStock}
              onChange={(e) => handleFilmStockChange(e.target.value)}
              required
            >
              <option value="">Select film stock</option>

              {FILM_STOCKS.map((stock) => (
                <option key={stock.value} value={stock.value}>
                  {stock.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            ISO
            <select
              value={iso}
              onChange={(e) => setIso(Number(e.target.value))}
              required
            >
              {ISO_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label>
            Notes
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {filmStock === "OTHER" && (
            <label>
              Film Type
              <select
                value={rollType}
                onChange={(e) => setRollType(e.target.value as "COLOR" | "BLACK_AND_WHITE")}
                required
              >
                <option value="">Select film type</option>
                <option value="COLOR">Color</option>
                <option value="BLACK_AND_WHITE">Black & White</option>
              </select>
            </label>
          )}
        </div>

        {error && <p className="create-roll-error">{error}</p>}

        <button type="submit" disabled={loading} className="create-roll-submit">
          {loading ? "Creating..." : "Create Roll"}
        </button>
      </form>
    </div>
  );
}
