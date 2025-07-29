export interface IParamPrompt {
  prompt: string;
  aspect_ratio: string;
  duration: number;
  resolution: string;
  camera_fixed: string;
  image: File | null;
}

export type TAscpecRatio = "9:16" | "16:9" | "1:1";
