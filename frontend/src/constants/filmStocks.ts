export type RollType = "COLOR" | "BW";

export const FILM_STOCKS = [
  { value: "KODAK_PORTRA_400", label: "Kodak Portra 400", type: "COLOR" },
  { value: "KODAK_GOLD_200", label: "Kodak Gold 200", type: "COLOR" },
  { value: "ILFORD_HP5", label: "Ilford HP5", type: "BLACK_AND_WHITE" },
  { value: "FUJI_SUPERIA", label: "Fuji Superia", type: "COLOR" },
  { value: "OTHER", label: "Other", type: null },
] as const;