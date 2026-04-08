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
            {roll.cameraUsed ? ` • ${roll.cameraUsed}` : ""}
          </p>
        </div>
        <div className="roll-detail-actions">
          <span className={`status-pill ${roll.status.toLowerCase()}`}>
            {roll.status === "IN_PROGRESS" ? "SHOOTING" : "DEV"}
          </span>
          <button type="button" className="ghost-btn" onClick={handleDeleteRoll}>
            <span className="icon-inline" aria-hidden>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17" fill="none" stroke="#6b6157" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
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
              {reviewMode ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="review-eye-icon">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L14.032 8.55382C13.4365 8.20193 12.7418 8 12 8C9.79086 8 8 9.79086 8 12C8 12.7418 8.20193 13.4365 8.55382 14.032L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L9.96803 15.4462C10.5635 15.7981 11.2582 16 12 16C14.2091 16 16 14.2091 16 12C16 11.2582 15.7981 10.5635 15.4462 9.96803L19.7071 5.70711ZM12.518 10.0677C12.3528 10.0236 12.1792 10 12 10C10.8954 10 10 10.8954 10 12C10 12.1792 10.0236 12.3528 10.0677 12.518L12.518 10.0677ZM11.482 13.9323L13.9323 11.482C13.9764 11.6472 14 11.8208 14 12C14 13.1046 13.1046 14 12 14C11.8208 14 11.6472 13.9764 11.482 13.9323ZM15.7651 4.8207C14.6287 4.32049 13.3675 4 12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C1.92276 13.7326 2.86706 15.0637 4.21194 16.3739L5.62626 14.9596C4.4555 13.8229 3.61144 12.6531 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C12.7719 6 13.5135 6.13385 14.2193 6.36658L15.7651 4.8207ZM12 18C11.2282 18 10.4866 17.8661 9.78083 17.6334L8.23496 19.1793C9.37136 19.6795 10.6326 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C22.0773 10.2674 21.133 8.93627 19.7881 7.62611L18.3738 9.04043C19.5446 10.1771 20.3887 11.3469 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="review-eye-icon">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.30147 15.5771C4.77832 14.2684 3.6904 12.7726 3.18002 12C3.6904 11.2274 4.77832 9.73158 6.30147 8.42294C7.87402 7.07185 9.81574 6 12 6C14.1843 6 16.1261 7.07185 17.6986 8.42294C19.2218 9.73158 20.3097 11.2274 20.8201 12C20.3097 12.7726 19.2218 14.2684 17.6986 15.5771C16.1261 16.9282 14.1843 18 12 18C9.81574 18 7.87402 16.9282 6.30147 15.5771ZM12 4C9.14754 4 6.75717 5.39462 4.99812 6.90595C3.23268 8.42276 2.00757 10.1376 1.46387 10.9698C1.05306 11.5985 1.05306 12.4015 1.46387 13.0302C2.00757 13.8624 3.23268 15.5772 4.99812 17.0941C6.75717 18.6054 9.14754 20 12 20C14.8525 20 17.2429 18.6054 19.002 17.0941C20.7674 15.5772 21.9925 13.8624 22.5362 13.0302C22.947 12.4015 22.947 11.5985 22.5362 10.9698C21.9925 10.1376 20.7674 8.42276 19.002 6.90595C17.2429 5.39462 14.8525 4 12 4ZM10 12C10 10.8954 10.8955 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8955 14 10 13.1046 10 12ZM12 8C9.7909 8 8.00004 9.79086 8.00004 12C8.00004 14.2091 9.7909 16 12 16C14.2092 16 16 14.2091 16 12C16 9.79086 14.2092 8 12 8Z"
                    fill="currentColor"
                  />
                </svg>
              )}
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
                <span className="frame-pill">
                  {selectedFrame.settings.flashUsed ? "Flash" : "No Flash"}
                </span>
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
