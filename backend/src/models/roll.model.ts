export type Roll = {
  id: string;
  name: string;
  filmStock: string;
  iso: number;
  notes: string;
  status: "IN_PROGRESS" | "DEVELOPED";
  rollType: "COLOR" | "BLACK_AND_WHITE";
};