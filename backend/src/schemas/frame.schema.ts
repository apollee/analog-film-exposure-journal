import { z } from "zod";

// Shutter speed can be a number or a fraction string
const ShutterSpeedSchema = z.union([
  z.number().positive(), // ex 1s, 0.5s, etc
  z.string().regex(/^1\/\d+$/, "Shutter speed must be in the following format, ex: 1/250")
]);

export const FrameSchema = z.object({
  id: z.string().uuid().optional(), 

  rollId: z.string().uuid(), 

  frameNumber: z.number().int().min(1), 

  aperture: z.number().positive().refine(
    (val) => val >= 0.7 && val <= 64,
    "Aperture must be between f/0.7 and f/64"
  ),

  shutterSpeed: ShutterSpeedSchema,

  notes: z.string().nullable().optional(),
});