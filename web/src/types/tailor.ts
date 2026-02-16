export type Status =
  | "idle"
  | "uploading"
  | "analyzing"
  | "tailoring"
  | "ready"
  | "error";

export type OutputFile = {
  name: string;
  url: string;
};

export type Results = {
  candidateName: string;
  currentTitle: string;
  matchScore: number;
  keywords: string[];
  gaps: string[];
  highlights: string[];
  suggestedBullets: string[];
  outputFiles: OutputFile[];
};

export type ParseResumeResponse = {
  id: string;
  file_name?: string | null;
  parsed_data: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    skills?: string[];
  };
};

export type AnalyzeJobResponse = {
  id: string;
  keywords: string[];
  signals: {
    levels: string[];
    tools: string[];
    focus: string[];
  };
  summary: string;
};

export type GenerateResumeResponse = {
  id: string;
  tailored_summary: string;
  tailored_bullets: string[];
  output_files: string[];
};

export type ParseResumePayload = {
  fileName?: string;
};

export type AnalyzeJobPayload = {
  jobText?: string;
  targetRole?: string;
  experienceLevel?: string;
};

export type GenerateResumePayload = {
  baseName?: string;
  targetRole?: string;
};
