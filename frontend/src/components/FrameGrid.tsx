import "./FrameGrid.css";
import type { Frame } from "../types/frame";

type FrameGridProps = {
  frames: Frame[];
  onReviewChange?: (frameId: string, exposure: "underexposed" | "overexposed" | "well-exposed") => void;
};

function exposureLabel(exposure: "underexposed" | "overexposed" | "well-exposed") {
  switch (exposure) {
    case "underexposed":
      return "Under";
    case "overexposed":
      return "Over";
    case "well-exposed":
      return "Good";
    default:
      return exposure;
  }
}

export default function FrameGrid({ frames, onReviewChange }: FrameGridProps) {
  if (frames.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" />
        <p className="empty-title">No frames logged yet</p>
        <p className="empty-sub">Add your first frame to begin</p>
      </div>
    );
  }

  return (
    <div className="frame-grid">
      {frames.map((frame) => (
        <div
          key={frame.id}
          className={`frame-tile ${frame.review?.exposure ? `review-${frame.review.exposure}` : ""}`}
        >
          <div className="frame-tile-number">#{frame.frameNumber}</div>
          <div className="frame-tile-meta">
            <div>f/{frame.settings.aperture}</div>
            <div>{frame.settings.shutterSpeed}</div>
          </div>
          {frame.review?.exposure && (
            <div className={`frame-review ${frame.review.exposure}`}>
              [{exposureLabel(frame.review.exposure)}]
            </div>
          )}
          {onReviewChange && (
            <div className="frame-review-actions">
              <button type="button" className="review-btn" onClick={() => onReviewChange(frame.id, "underexposed")}>Under</button>
              <button type="button" className="review-btn" onClick={() => onReviewChange(frame.id, "well-exposed")}>Good</button>
              <button type="button" className="review-btn" onClick={() => onReviewChange(frame.id, "overexposed")}>Over</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
