export type Frame = {
  id: string; //for cosmosDB instead of using composite key
  rollId: string;
  frameNumber: number;
  aperture: string;
  shutterSpeed: string;
  notes: string;
};

