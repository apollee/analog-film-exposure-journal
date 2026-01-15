import "./FrameGrid.css";

//TODO: Lenght will be defined by the user and gridTemplateColumns needs to consider this

export default function FrameGrid() {
  return (
    <div>
      <h2>Frames (Review)</h2>
      <div className="frame-grid-container">
        {Array.from({ length: 36 }, (_, i) => (
          <div key={i} className="frame-grid-item">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}