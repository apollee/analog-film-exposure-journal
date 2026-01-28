import { z } from "zod";

export const FilmStockEnum = z.enum([
  "KODAK_PORTRA_400",
  "KODAK_GOLD_200",
  "ILFORD_HP5",
  "FUJI_SUPERIA",
  "OTHER"
]);

export const RollStatusEnum = z.enum(["IN_PROGRESS", "DEVELOPED"]);

export const RollTypeEnum = z.enum(["COLOR", "BLACK_AND_WHITE"]);

export const RollSchema = z.object({
  id: z.string().optional(), //not sure if it should be optional (backend generates it though)

  name: z.string().min(1, "Roll name is required"),

  filmStock: FilmStockEnum,

  iso: z.number().int().min(0, "ISO must be higher than 0"),

  notes: z.string().nullable().optional(),

  status: RollStatusEnum,

  rollType: RollTypeEnum,
});
