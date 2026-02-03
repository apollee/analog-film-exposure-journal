import { useState } from "react";
import { FILM_STOCKS } from "../constants/filmStocks";
import { createRoll } from "../api/rolls.api";
import { useNavigate } from "react-router-dom";

export default function CreateRoll() {
  const [name, setName] = useState("");
  const [filmStock, setFilmStock] = useState("");
  const [rollType, setRollType] = useState<"COLOR" | "BW" | "">("");
  const [iso, setIso] = useState(400);
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createRoll({
      name,
      filmStock,
      iso,
      notes,
    });

    navigate("/journal-rolls");
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
      />

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {filmStock === "OTHER" && (
      <select
        value={rollType}
        onChange={(e) => setRollType(e.target.value as "COLOR" | "BW")}
        >
        <option value="">Select film type</option>
        <option value="COLOR">Color</option>
        <option value="BW">Black & White</option>
      </select>
      )}

      <button type="submit">Save roll</button>

    </form>

    
  );
}

