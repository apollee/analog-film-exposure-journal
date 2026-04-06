import { z } from "zod";

export const FilmStockEnum = z.enum([
  "KODAK_PORTRA_160",
  "KODAK_PORTRA_400",
  "KODAK_PORTRA_800",
  "KODAK_GOLD_200",
  "KODAK_ULTRAMAX_400",
  "KODAK_COLORPLUS_200",
  "KODAK_EKTACHROME_100",
  "KODACOLOR_100",
  "KODACOLOR_200",
  "KODAK_PRO_IMAGE_100",
  "FUJIFILM_FUJICOLOR_200",
  "CINESTILL_800T",
  "ILFORD_DELTA_100",
  "ILFORD_DELTA_400",
  "ILFORD_DELTA_3200",
  "ILFORD_FP4_125",
  "ILFORD_HP5_400",
  "ILFORD_XP2_400",
  "KODAK_TRI-X_400",
  "KODAK_T-MAX_400",
  "OTHER"
]);

export const RollStatusEnum = z.enum(["IN_PROGRESS", "DEVELOPED"]);

export const RollTypeEnum = z.enum(["COLOR", "BLACK_AND_WHITE"]);

export const IsoValues = [
  50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 2000, 3200
] as const;

const IsoSchema = z
  .number()
  .int()
  .refine((val) => IsoValues.includes(val as (typeof IsoValues)[number]), {
    message: "Invalid ISO value",
  });

export const RollSchema = z.object({
  id: z.string().optional(), //not sure if it should be optional (backend generates it though)

  name: z.string().min(1, "Roll name is required"),

  filmStock: FilmStockEnum,

  iso: IsoSchema,

  cameraUsed: z.string().trim().min(1).max(120).optional(),

  notes: z.string().nullable().optional(),

  status: RollStatusEnum,

  rollType: RollTypeEnum,
});
