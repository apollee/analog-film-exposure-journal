import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FrameForm from "../components/FrameForm";
import FrameList from "../components/FrameList";
import FrameGrid from "../components/FrameGrid";
import type { Frame } from "../types/frame";
import type { Roll } from "../types/roll";

export default function RollDetailsPage() {
  const { rollId } = useParams<{ rollId: string }>();

  const [roll, setRoll] = useState<Roll | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);

  //unsure if this is the best way to get userId, but it works for now
  const userId = localStorage.getItem("userId") || "";

  //fetch roll details
  const fetchRoll = async () => {
    const res = await fetch(`/api/rolls/${rollId}`, {
      headers: {
        "x-user-id": userId,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch roll");
    }

    const data = await res.json();
    setRoll(data);
  };

  //fetch frames for the roll
  const fetchFrames = async () => {
    const res = await fetch(`/api/rolls/${rollId}/frames`, {
      headers: {
        "x-user-id": userId,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch frames");
    }

    const data = await res.json();
    setFrames(data);
  };

  //loading
  useEffect(() => {
    if (!rollId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        await fetchRoll();
        await fetchFrames();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [rollId]);

  //rendering
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!roll) {
    return <p>Roll not found.</p>;
  }

  return (
    <div>
      <h1>{roll.name}</h1>

      <p>
        Film: {roll.filmStock} | ISO: {roll.iso}
      </p>

      <p>Status: {roll.status}</p>

      {roll.status === "DEVELOPED" ? (
        <FrameGrid frames={frames} />
      ) : (
        //in progress rolls show list
        <>
          <FrameForm
            rollId={roll.id}
            userId={userId}
            onFrameCreated={fetchFrames}
          />

          <FrameList frames={frames} />
        </>
      )}
    </div>
  );
}