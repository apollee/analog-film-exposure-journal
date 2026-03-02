export type FrameSettings = {
  aperture: number;
  shutterSpeed: string;
}

export type FrameReview = {
  exposure: "overexposed" | "underexposed" | "well-exposed";
  notes?: string;
}

export type Frame = {
  id: string;
  rollId: string;
  frameNumber: number;
  settings: FrameSettings;
  note?: string;
  createdAt: string;
  review: FrameReview | null;
}