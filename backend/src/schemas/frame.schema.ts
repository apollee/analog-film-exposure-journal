import { z } from "zod";

export const ApertureValues = [
  1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22
] as const;

export const ShutterSpeedValues = [
  "B",
  "1s",
  "1/2",
  "1/4",
  "1/8",
  "1/15",
  "1/30",
  "1/60",
  "1/125",
  "1/250",
  "1/500",
  "1/1000",
  "1/2000",
  "1/4000"
] as const;

const ApertureSchema = z
  .number()
  .refine((val) => ApertureValues.includes(val as (typeof ApertureValues)[number]), {
    message: "Invalid aperture value",
  });

const ShutterSpeedSchema = z.enum(ShutterSpeedValues, {
  message: "Invalid shutter speed value",
});

export const FrameCreateSchema = z.object({
  settings: z.object({
    aperture: ApertureSchema,
    shutterSpeed: ShutterSpeedSchema,
    flashUsed: z.boolean().optional().default(false),
  }),
  note: z.string().optional().nullable(),
});
