import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FrameForm from "../components/FrameForm";
import FrameList from "../components/FrameList";
import FrameGrid from "../components/FrameGrid";
import type { Frame } from "../types/frame";
import type { Roll } from "../types/roll";
import { FILM_STOCKS } from "../constants/filmStocks";
import "../components/RollDetails.css";

export default function RollDetailsPage() {
  const { rollId } = useParams<{ rollId: string }>();

  const [roll, setRoll] = useState<Roll | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const userId = localStorage.getItem("userId") || "";

  const updateRollStatus = async (status: "IN_PROGRESS" | "DEVELOPED") => {
    if (!rollId) return;

    const res = await fetch(`/api/rolls/${rollId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      console.error("Failed to update roll status");
      return;
    }

    const updated = await res.json();
    setRoll(updated);
  };

  const handleReviewChange = async (
    frameId: string,
    exposure: "underexposed" | "overexposed" | "well-exposed"
  ) => {
    if (!rollId) return;

    const res = await fetch(`/api/rolls/${rollId}/frames/${frameId}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ review: { exposure } }),
    });

    if (!res.ok) {
      console.error("Failed to update frame review");
      return;
    }

    const updated = await res.json();
    setFrames((prev) =>
      prev.map((frame) => (frame.id === updated.id ? updated : frame))
    );
  };

  const filmStockLabel = useMemo(() => {
    if (!roll) return "";
    return FILM_STOCKS.find((stock) => stock.value === roll.filmStock)?.label ?? roll.filmStock;
  }, [roll]);

  useEffect(() => {
    if (!rollId) return;

    const fetchFrames = async () => {
      if (!rollId) return;

      const res = await fetch(`/api/rolls/${rollId}/frames`, {
        headers: {
          "x-user-id": userId,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch frames");
        return;
      }

      const data = await res.json();
      setFrames(data);
    };

    const fetchRoll = async () => {
      const res = await fetch(`/api/rolls/${rollId}`, {
        headers: {
          "x-user-id": userId,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch roll");
      }

      const data = await res.json();
      setRoll(data);
    };

    const loadData = async () => {
      try {
        setLoading(true);
        await fetchRoll();
        await fetchFrames();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [rollId, userId]);

  useEffect(() => {
    if (!reviewMode || frames.length === 0) return;
    if (!selectedFrameId) {
      setSelectedFrameId(frames[0].id);
    }
  }, [reviewMode, frames, selectedFrameId]);

  const selectedFrame = useMemo(
    () => frames.find((frame) => frame.id === selectedFrameId) ?? null,
    [frames, selectedFrameId]
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!roll) {
    return <p>Roll not found.</p>;
  }

  return (
    <section className="roll-detail">
      <header className="roll-detail-header">
        <Link to="/journal-rolls" className="back-button">
          &lt;
        </Link>
        <div className="roll-detail-title">
          <h1>{roll.name}</h1>
          <p className="roll-meta-line">
            {filmStockLabel} / ISO {roll.iso}
          </p>
        </div>
        <div className="roll-detail-actions">
          <span className={`status-pill ${roll.status.toLowerCase()}`}>
            {roll.status === "IN_PROGRESS" ? "SHOOTING" : "DEV"}
          </span>
          {roll.status === "DEVELOPED" && (
            <button
              type="button"
              className="ghost-btn"
              onClick={() => updateRollStatus("IN_PROGRESS")}
            >
              Mark as In Progress
            </button>
          )}
        </div>
      </header>

      {roll.status === "DEVELOPED" ? (
        <section className="roll-review">
          <div className="review-header">
            <button
              type="button"
              className="review-toggle"
              onClick={() => {
                setReviewMode((prev) => !prev);
                if (reviewMode) {
                  setSelectedFrameId(null);
                }
              }}
            >
              <span className="review-eye" aria-hidden />
              [ Review Exposures ]
            </button>
          </div>
          <FrameGrid
            frames={frames}
            rollIso={roll.iso}
            onSelectFrame={reviewMode ? setSelectedFrameId : undefined}
            selectedFrameId={reviewMode ? selectedFrameId : null}
          />
          {reviewMode && selectedFrame && (
            <div className="review-panel">
              <div className="review-panel-header">
                <div className="review-panel-title">Frame #{selectedFrame.frameNumber}</div>
                <button
                  type="button"
                  className="review-panel-close"
                  onClick={() => {
                    setReviewMode(false);
                    setSelectedFrameId(null);
                  }}
                >
                  [ Close ]
                </button>
              </div>
              <div className="review-panel-meta">
                <span className="frame-pill">ISO {roll.iso}</span>
                <span className="frame-pill">f/{selectedFrame.settings.aperture}</span>
                <span className="frame-pill">{selectedFrame.settings.shutterSpeed}</span>
                {selectedFrame.note && (
                  <span className="frame-note">{selectedFrame.note}</span>
                )}
              </div>
              <div className="review-panel-actions">
                <button
                  type="button"
                  className="review-action"
                  onClick={() => handleReviewChange(selectedFrame.id, "underexposed")}
                >
                  Under
                </button>
                <button
                  type="button"
                  className="review-action"
                  onClick={() => handleReviewChange(selectedFrame.id, "well-exposed")}
                >
                  Good
                </button>
                <button
                  type="button"
                  className="review-action"
                  onClick={() => handleReviewChange(selectedFrame.id, "overexposed")}
                >
                  Over
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="roll-shooting">
          <div className="shooting-actions">
            <FrameForm
              rollId={roll.id}
              userId={userId}
              onFrameCreated={() => {
                if (!rollId) return;
                const fetchFrames = async () => {
                  const res = await fetch(`/api/rolls/${rollId}/frames`, {
                    headers: {
                      "x-user-id": userId,
                    },
                  });
                  if (!res.ok) {
                    console.error("Failed to fetch frames");
                    return;
                  }
                  const data = await res.json();
                  setFrames(data);
                };
                fetchFrames();
              }}
            />
            <button
              type="button"
              className="ghost-btn"
              onClick={() => updateRollStatus("DEVELOPED")}
            >
              Mark as Developed
            </button>
          </div>

          <FrameList frames={frames} rollIso={roll.iso} />
        </section>
      )}
    </section>
  );
}
