import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FrameForm from "../components/FrameForm";
import FrameList from "../components/FrameList";
import FrameGrid from "../components/FrameGrid";
import type { Frame } from "../types/frame";
import type { Roll } from "../types/roll";

export default function RollDetailsPage() {
  const { rollId } = useParams<{ rollId: string }>();

  console.log("rollId from params:", rollId);

  const [roll, setRoll] = useState<Roll | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId") || "";

  const updateRollStatus = async (status: "IN_PROGRESS" | "DEVELOPED") => {
    if (!rollId) return;

    const res = await fetch(`/api/rolls/${rollId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      console.error("Failed to update roll status");
      return;
    }

    const updated = await res.json();
    setRoll(updated);
  };

  const handleReviewChange = async (
    frameId: string,
    exposure: "underexposed" | "overexposed" | "well-exposed"
  ) => {
    if (!rollId) return;

    const res = await fetch(`/api/rolls/${rollId}/frames/${frameId}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ review: { exposure } }),
    });

    if (!res.ok) {
      console.error("Failed to update frame review");
      return;
    }

    const updated = await res.json();
    setFrames((prev) =>
      prev.map((frame) => (frame.id === updated.id ? updated : frame))
    );
  };

  useEffect(() => {
    if (!rollId) return;

    const fetchFrames = async () => {
      if (!rollId) return;

      const res = await fetch(`/api/rolls/${rollId}/frames`, {
        headers: {
          "x-user-id": userId,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch frames");
        return;
      }

      const data = await res.json();
      setFrames(data);
    };

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
  }, [rollId, userId]);

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

      <div>
        {roll.status === "IN_PROGRESS" ? (
          <button type="button" onClick={() => updateRollStatus("DEVELOPED")}>
            Mark as Developed
          </button>
        ) : (
          <button type="button" onClick={() => updateRollStatus("IN_PROGRESS")}>
            Mark as In Progress
          </button>
        )}
      </div>

      {roll.status === "DEVELOPED" ? (
        <FrameGrid frames={frames} onReviewChange={handleReviewChange} />
      ) : (
        <>
          <FrameForm
            rollId={roll.id}
            userId={userId}
            onFrameCreated={() => {
              if (!rollId) return;
              const fetchFrames = async () => {
                const res = await fetch(`/api/rolls/${rollId}/frames`, {
                  headers: {
                    "x-user-id": userId,
                  },
                });
                if (!res.ok) {
                  console.error("Failed to fetch frames");
                  return;
                }
                const data = await res.json();
                setFrames(data);
              };
              fetchFrames();
            }}
          />

          <FrameList frames={frames} />
        </>
      )}
    </div>
  );
}