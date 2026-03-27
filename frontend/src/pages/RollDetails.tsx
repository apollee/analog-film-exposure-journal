import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FrameForm from "../components/FrameForm";
import FrameList from "../components/FrameList";
import FrameGrid from "../components/FrameGrid";
import type { Frame } from "../types/frame";
import type { Roll } from "../types/roll";
import { FILM_STOCKS } from "../constants/filmStocks";
import { deleteRoll as deleteRollApi } from "../api/rolls.api";
import "../components/RollDetails.css";

export default function RollDetailsPage() {
  const { rollId } = useParams<{ rollId: string }>();

  const [roll, setRoll] = useState<Roll | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [lastReviewAction, setLastReviewAction] = useState<{
    frameId: string;
    exposure: "underexposed" | "overexposed" | "well-exposed";
  } | null>(null);

  const navigate = useNavigate();

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
    setLastReviewAction({ frameId, exposure });
    setTimeout(() => {
      setLastReviewAction((prev) =>
        prev && prev.frameId === frameId && prev.exposure === exposure ? null : prev
      );
    }, 500);

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

  const handleDeleteRoll = async () => {
    if (!rollId) return;
    const confirmed = window.confirm("Delete this roll? This cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteRollApi(rollId);
      navigate("/journal-rolls");
    } catch (error) {
      console.error("Failed to delete roll", error);
    }
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
            {filmStockLabel} • ISO {roll.iso}
          </p>
        </div>
        <div className="roll-detail-actions">
          <span className={`status-pill ${roll.status.toLowerCase()}`}>
            {roll.status === "IN_PROGRESS" ? "SHOOTING" : "DEV"}
          </span>
          <button type="button" className="ghost-btn" onClick={handleDeleteRoll}>
            Delete Roll
          </button>
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
              <svg viewBox="0 0 24 24" aria-hidden="true" className="review-eye-icon">
                <path d="M12.0007 9C10.3439 9 9.00073 10.3431 9.00073 12C9.00073 13.6569 10.3439 15 12.0007 15C13.6576 15 15.0007 13.6569 15.0007 12C15.0007 10.3431 13.6576 9 12.0007 9Z" fill="currentColor"/>
                <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              [ Review Exposures ]
            </button>
            <button
              type="button"
              className="ghost-btn outline-btn"
              onClick={() => updateRollStatus("IN_PROGRESS")}
            >
              Mark as In Progress
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
                  className={`review-action is-under ${
                    lastReviewAction?.frameId === selectedFrame.id &&
                    lastReviewAction?.exposure === "underexposed"
                      ? "is-active"
                      : ""
                  } ${selectedFrame.review?.exposure === "underexposed" ? "is-active" : ""}`}
                  onClick={() => handleReviewChange(selectedFrame.id, "underexposed")}
                >
                  <span className="review-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  Under
                </button>
                <button
                  type="button"
                  className={`review-action is-good ${
                    lastReviewAction?.frameId === selectedFrame.id &&
                    lastReviewAction?.exposure === "well-exposed"
                      ? "is-active"
                      : ""
                  } ${selectedFrame.review?.exposure === "well-exposed" ? "is-active" : ""}`}
                  onClick={() => handleReviewChange(selectedFrame.id, "well-exposed")}
                >
                  <span className="review-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M8.5 12.5l2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  Good
                </button>
                <button
                  type="button"
                  className={`review-action is-over ${
                    lastReviewAction?.frameId === selectedFrame.id &&
                    lastReviewAction?.exposure === "overexposed"
                      ? "is-active"
                      : ""
                  } ${selectedFrame.review?.exposure === "overexposed" ? "is-active" : ""}`}
                  onClick={() => handleReviewChange(selectedFrame.id, "overexposed")}
                >
                  <span className="review-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
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
              className="ghost-btn outline-btn outline-btn-success"
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
