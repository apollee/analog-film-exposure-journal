import { useState } from "react";
import { FILM_STOCKS } from "../constants/filmStocks";
import { createRoll } from "../api/rolls.api";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Roll name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        value={filmStock}
        onChange={(e) => handleFilmStockChange(e.target.value)}
        >
        <option value="">Select film stock</option>

        {FILM_STOCKS.map((stock) => (
          <option key={stock.value} value={stock.value}>
            {stock.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={iso}
        onChange={(e) => setIso(Number(e.target.value))}
        required
      />

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {filmStock === "OTHER" && (
      <select
        value={rollType}
        onChange={(e) => setRollType(e.target.value as "COLOR" | "BLACK_AND_WHITE")}
        >
        <option value="">Select film type</option>
        <option value="COLOR">Color</option>
        <option value="BLACK_AND_WHITE">Black & White</option>
      </select>
      )}

      {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

      <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Roll"}
        </button>

    </form>

    
  );
}

