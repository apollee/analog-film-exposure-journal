import { useParams } from "react-router-dom";
import FrameList from "../components/FrameList";
import FrameGrid from "../components/FrameGrid";
import RollHeader from "../components/RollHeader";
import type { Roll } from "../types/roll";

export default function RollDetails() {
  const { id } = useParams();

  // TODO: Replace mock roll with API lookup

  const mockRoll: Roll= {
    id: id!,
    name: "Lisbon Street Walk",
    filmStock: "Kodak Portra 400",
    iso: 400,
    notes: "",
    status: "DEVELOPED",
    rollType: "COLOR",
  };

  return (
    <div>
        <RollHeader roll={mockRoll} />
        <section>
        {mockRoll.status === "IN_PROGRESS" ? (
          <FrameList />
        ) : (
          <FrameGrid />
        )}
        </section>
    </div>
  );
}
