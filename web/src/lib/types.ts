export type Status =
  | "idle"
  | "uploading"
  | "analyzing"
  | "tailoring"
  | "ready"
  | "error";

export type Results = {
  candidateName: string;
  currentTitle: string;
  matchScore: number;
  keywords: string[];
  gaps: string[];
  highlights: string[];
  suggestedBullets: string[];
  outputFiles: { name: string; url: string }[];
};
