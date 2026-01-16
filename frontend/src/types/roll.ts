type RollColor = "COLOR" | "BLACK_AND_WHITE";
type RollStatus = "IN_PROGRESS" | "DEVELOPED";

export type Roll = {
  id: string;
  name: string;
  filmStock: string;
  iso: number;
  notes: string;
  status: RollStatus;
  rollColor: RollColor;
};