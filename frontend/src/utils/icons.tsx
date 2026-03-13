//TODO: Replace later with SVG icons

export default function FilmColorIcon({ rollType }: { rollType: "COLOR" | "BLACK_AND_WHITE" }) {
  return (
    <span className="roll-color-icon">
      {rollType === "COLOR" ? "C" : "BW"}
    </span>
  );
}
