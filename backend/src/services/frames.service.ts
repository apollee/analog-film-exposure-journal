import { Frame } from "../models/frame.model";

const mockFrames: Frame[] = [
  {
    id: "1",
    rollId: "1",
    frameNumber: 1,
    aperture: "f/8",
    shutterSpeed: "1/250",
    notes: "Sunny day",
  },
];

export function getFrames(): Frame[] {
  return mockFrames;
}