import "./FrameList.css";
import type { Frame } from "../types/frame";

interface FrameListProps {
  frames: Frame[];
}

export default function FrameList({ frames }: FrameListProps) {
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
          <div className="frame-card-top">
            <strong>Frame {frame.frameNumber}</strong>
          </div>
          <div className="frame-card-meta">
            <span>f/{frame.settings.aperture}</span>
            <span>{frame.settings.shutterSpeed}</span>
          </div>
          {frame.note && <p className="frame-card-notes">{frame.note}</p>}
        </div>
      ))}
    </div>
  );
}
