import { useState } from "react";
import "./FrameForm.css";

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
  const [open, setOpen] = useState(false);

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
    setOpen(false);

    onFrameCreated();
  };

  return (
    <div className="frame-form">
      <button type="button" className="ghost-btn" onClick={() => setOpen(true)}>
        + Frame
      </button>

      {open && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button
              type="button"
              className="modal-close"
              onClick={() => setOpen(false)}
            >
              x
            </button>
            <h2>Frame</h2>
            <p className="modal-sub">Log your exposure settings</p>

            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Aperture
                <input
                  type="number"
                  placeholder="2.8"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  required
                />
              </label>

              <label>
                Shutter Speed
                <input
                  type="text"
                  placeholder="1/250"
                  value={shutterSpeed}
                  onChange={(e) => setShutterSpeed(e.target.value)}
                  required
                />
              </label>

              <label>
                Notes
                <textarea
                  placeholder="Scene description, subject..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>

              <button type="submit" disabled={loading} className="primary-btn">
                {loading ? "Saving..." : "Log Frame"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
