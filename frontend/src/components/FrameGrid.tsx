import "./FrameGrid.css";
import type { Frame } from "../types/frame";

//TODO: Lenght will be defined by the user and gridTemplateColumns needs to consider this

type FrameGridProps = {
  frames: Frame[];
};

export default function FrameGrid({ frames }: FrameGridProps) {
  if (frames.length === 0) {
    return <p>No frames were shot on this roll.</p>;
  }

  return (
    <div>
      <h2>Developed Roll</h2>

      <div className="frame-grid">
        {frames.map((frame) => (
          <div key={frame.id} className="frame-tile">
            <div className="frame-number">
              #{frame.frameNumber}
            </div>

            <div className="frame-settings">
              f/{frame.settings.aperture} — {frame.settings.shutterSpeed}
            </div>

            {frame.review && (
              <div className="frame-review">
                {frame.review.exposure}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}