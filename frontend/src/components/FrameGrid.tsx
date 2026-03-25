import { useLayoutEffect, useRef, useState } from "react";
import "./FrameGrid.css";
import type { Frame } from "../types/frame";

type FrameGridProps = {
  frames: Frame[];
  onSelectFrame?: (frameId: string) => void;
  selectedFrameId?: string | null;
  rollIso?: number;
};

function exposureLabel(exposure: "underexposed" | "overexposed" | "well-exposed") {
  switch (exposure) {
    case "underexposed":
      return "Under";
    case "overexposed":
      return "Over";
    case "well-exposed":
      return "Good";
    default:
      return exposure;
  }
}

export default function FrameGrid({ frames, onSelectFrame, selectedFrameId, rollIso }: FrameGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [minTileHeight, setMinTileHeight] = useState<number | null>(null);
  const [minTileWidth, setMinTileWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!gridRef.current) return;
    const tiles = Array.from(gridRef.current.querySelectorAll<HTMLElement>(".frame-tile"));
    if (tiles.length === 0) {
      if (minTileHeight !== null) setMinTileHeight(null);
      if (minTileWidth !== null) setMinTileWidth(null);
      return;
    }
    const maxHeight = Math.max(...tiles.map((tile) => tile.getBoundingClientRect().height));
    let maxWidth = 0;
    tiles.forEach((tile) => {
      const prevWidth = tile.style.width;
      tile.style.width = "max-content";
      const width = tile.getBoundingClientRect().width;
      tile.style.width = prevWidth;
      if (width > maxWidth) maxWidth = width;
    });

    if (Number.isFinite(maxHeight) && maxHeight > 0) {
      if (!minTileHeight || Math.abs(maxHeight - minTileHeight) >= 1) {
        setMinTileHeight(maxHeight);
      }
    }

    if (Number.isFinite(maxWidth) && maxWidth > 0) {
      if (!minTileWidth || Math.abs(maxWidth - minTileWidth) >= 1) {
        setMinTileWidth(maxWidth);
      }
    }
  }, [frames, rollIso, selectedFrameId, minTileHeight, minTileWidth]);

  if (frames.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon" />
        <p className="empty-title">No frames logged yet</p>
        <p className="empty-sub">Add your first frame to begin</p>
      </div>
    );
  }

  return (
    <div className="frame-grid" ref={gridRef}>
      {frames.map((frame) => {
        const isSelected = selectedFrameId === frame.id;
        return (
          <div
            key={frame.id}
            className={`frame-tile ${frame.review?.exposure ? `review-${frame.review.exposure}` : ""} ${onSelectFrame ? "is-selectable" : ""} ${isSelected ? "is-selected" : ""}`}
            style={{
              ...(minTileHeight ? { minHeight: `${minTileHeight}px` } : {}),
              ...(minTileWidth ? { width: `${minTileWidth}px` } : {})
            }}
            role={onSelectFrame ? "button" : undefined}
            tabIndex={onSelectFrame ? 0 : undefined}
            onClick={onSelectFrame ? () => onSelectFrame(frame.id) : undefined}
            onKeyDown={
              onSelectFrame
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectFrame(frame.id);
                    }
                  }
                : undefined
            }
          >
          <div className="frame-tile-number">#{frame.frameNumber}</div>
          <div className="frame-tile-info">
            <div className="frame-row">
              <span className="frame-label frame-label-iso">ISO</span>
              <span>{rollIso ?? "-"}</span>
            </div>
            <div className="frame-row">
              <span className="frame-label">Aperture</span>
              <span>{frame.settings.aperture}</span>
            </div>
            <div className="frame-row">
              <span className="frame-label">Shutter speed</span>
              <span>{frame.settings.shutterSpeed}</span>
            </div>
            {frame.note && (
              <div className="frame-row frame-note-row">
                <span className="frame-label">Note</span>
                <span>{frame.note}</span>
              </div>
            )}
          </div>
          {frame.review?.exposure && (
            <div className={`frame-review ${frame.review.exposure}`}>
              [{exposureLabel(frame.review.exposure)}]
            </div>
          )}
          </div>
        );
      })}
    </div>
  );
}
