//TODO: Lenght will be defined by the user

export default function FrameList() {
  return (
    <div>
      <h2>Frames (Shooting)</h2>
      <ul>
        {Array.from({ length: 36 }, (_, i) => (
          <li key={i}>Frame {i + 1}</li>
        ))}
      </ul>
    </div>
  );
}