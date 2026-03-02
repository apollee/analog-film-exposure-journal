import "./FrameList.css";
import type { Frame } from "../types/frame";

//TODO: Lenght will be defined by the user

interface FrameListProps {
  frames: Frame[];
}

export default function FrameList({ frames }: FrameListProps) {
  return (
    <div>
      <h2>Frames (Shooting)</h2>

      <ul className="frame-list">
        {frames.length === 0 ? (
          <li>No frames yet</li>
        ) : (
          frames.map((frame) => (
            <li key={frame.id}>
              <strong>Frame {frame.frameNumber}</strong>

              {frame.settings && (
                <>
                  <div>Aperture: f/{frame.settings.aperture}</div>
                  <div>Shutter: {frame.settings.shutterSpeed}</div>
                </>
              )}

              {frame.note && <div>Note: {frame.note}</div>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}