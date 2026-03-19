import "./FrameList.css";
import type { Frame } from "../types/frame";

interface FrameListProps {
  frames: Frame[];
  rollIso?: number;
}

export default function FrameList({ frames, rollIso }: FrameListProps) {
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
    <div className="frame-list">
      {frames.map((frame) => (
        <div key={frame.id} className="frame-card">
          <div className="frame-card-row">
            <div className="frame-card-number">{frame.frameNumber}</div>
            <div className="frame-card-divider" />
            <div className="frame-card-info">
              <span className="frame-pill">ISO {rollIso ?? "-"}</span>
              <span className="frame-pill">f/{frame.settings.aperture}</span>
              <span className="frame-pill">{frame.settings.shutterSpeed}</span>
            </div>
          </div>
          {frame.note && <div className="frame-card-note">"{frame.note}"</div>}
        </div>
      ))}
    </div>
  );
}
