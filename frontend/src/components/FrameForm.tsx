import { useState } from "react";

interface FrameFormProps {
  rollId: string;
  userId: string;
  onFrameCreated: () => void;
}

export default function FrameForm({ rollId, userId, onFrameCreated }: FrameFormProps) {
  const [aperture, setAperture] = useState("");
  const [shutterSpeed, setShutterSpeed] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/rolls/${rollId}/frames`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({
        settings: {
          aperture: Number(aperture),
          shutterSpeed
        },
        note
      })
    });

    setAperture("");
    setShutterSpeed("");
    setNote("");
    setLoading(false);

    onFrameCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Aperture (e.g. 2.8)"
        value={aperture}
        onChange={(e) => setAperture(e.target.value)}
      />

      <input
        type="text"
        placeholder="Shutter Speed (e.g. 1/250)"
        value={shutterSpeed}
        onChange={(e) => setShutterSpeed(e.target.value)}
      />

      <textarea
        placeholder="Notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Frame"}
      </button>
    </form>
  );
}