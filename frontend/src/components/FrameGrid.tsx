import "./FrameGrid.css";
import type { Frame } from "../types/frame";

type FrameGridProps = {
  frames: Frame[];
  onReviewChange?: (frameId: string, exposure: "underexposed" | "overexposed" | "well-exposed") => void;
};

function exposureLabel(exposure: "underexposed" | "overexposed" | "well-exposed") {
  switch (exposure) {
    case "underexposed":
      return "Under exposed";
    case "overexposed":
      return "Over exposed";
    case "well-exposed":
      return "Well exposed";
    default:
      return exposure;
  }
}

export default function FrameGrid({ frames, onReviewChange }: FrameGridProps) {
  if (frames.length === 0) {
    return <p>No frames were shot on this roll.</p>;
  }

  return (
    <div>
      <h2>Developed Roll</h2>

      <div className="frame-grid">
        {frames.map((frame) => (
          <div key={frame.id} className="frame-tile">
            <div className="frame-number">#{frame.frameNumber}</div>

            <div className="frame-settings">
              f/{frame.settings.aperture} — {frame.settings.shutterSpeed}
            </div>

            {frame.review?.exposure && (
              <div className={`frame-review ${frame.review.exposure}`}>
                {exposureLabel(frame.review.exposure)}
              </div>
            )}

            {onReviewChange && (
              <div className="frame-review-actions">
                <button
                  type="button"
                  className={`review-btn ${frame.review?.exposure === "underexposed" ? "active" : ""}`}
                  onClick={() => onReviewChange(frame.id, "underexposed")}
                >
                  Under
                </button>
                <button
                  type="button"
                  className={`review-btn ${frame.review?.exposure === "well-exposed" ? "active" : ""}`}
                  onClick={() => onReviewChange(frame.id, "well-exposed")}
                >
                  Well
                </button>
                <button
                  type="button"
                  className={`review-btn ${frame.review?.exposure === "overexposed" ? "active" : ""}`}
                  onClick={() => onReviewChange(frame.id, "overexposed")}
                >
                  Over
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}