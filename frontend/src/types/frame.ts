export type FrameSettings = {
  aperture: number;
  shutterSpeed: "B" | "1s" | "1/2" | "1/4" | "1/8" | "1/15" | "1/30" | "1/60" | "1/125" | "1/250" | "1/500" | "1/1000" | "1/2000" | "1/4000";
  flashUsed?: boolean;
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
