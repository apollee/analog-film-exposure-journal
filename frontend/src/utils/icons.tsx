//TODO: Replace later with SVG icons

export default function FilmColorIcon({ rollType }: { rollType: "COLOR" | "BLACK_AND_WHITE" }) {
  return (
    //TODO: Move class to a different css file
    <span className="roll-color-icon"> 
      {rollType === "COLOR" ? "🎨" : "⚫"}
    </span>
  );
}