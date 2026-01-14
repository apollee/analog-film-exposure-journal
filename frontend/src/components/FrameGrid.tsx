//TODO: Lenght will be defined by the user and gridTemplateColumns needs to consider this

export default function FrameGrid() {
  return (
    <div>
      <h2>Frames (Review)</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
        {Array.from({ length: 36 }, (_, i) => (
          <div
            key={i}
            style={{ border: "1px solid #ccc", padding: "12px", textAlign: "center" }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}