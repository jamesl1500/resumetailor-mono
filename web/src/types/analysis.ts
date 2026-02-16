export type StyleOption = "Slim" | "Modern" | "Fancy";

export type StyleCard = {
  name: StyleOption;
  description: string;
  emphasis: string[];
};

export type ExperienceEntry = {
  title?: string;
  company?: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  bullets?: string[];
};

export type EducationEntry = {
  institution?: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  bullets?: string[];
};

export type AnalysisData = {
  id: string;
  matchScore: number;
  summary: string;
  keywords: string[];
  signals: {
    levels: string[];
    tools: string[];
    focus: string[];
  };
  outputs: { name: string; url: string; previewUrl?: string }[];
  statement: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  targetRole?: string;
  candidateName?: string;
  style?: StyleOption;
};

export type AnalysisClientProps = {
  data: AnalysisData;
};

export type TailorResultResponse = {
  id: string;
  match_score: number;
  summary: string;
  keywords: string[];
  signals: {
    levels: string[];
    tools: string[];
    focus: string[];
  };
  outputs: string[];
  statement?: string | null;
  skills?: string[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  style?: StyleOption | null;
};

export type TabKey =
  | "Overview"
  | "Summary"
  | "Skills"
  | "Experience"
  | "Education"
  | "Review";

export type AnalysisPageProps = {
  params: { tailoredId: string };
};

export type AnalysisApiResponse = {
  id: string;
  match_score: number;
  summary: string;
  keywords: string[];
  signals: {
    levels: string[];
    tools: string[];
    focus: string[];
  };
  outputs: string[];
  statement?: string | null;
  skills?: string[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  target_role?: string | null;
  style?: string | null;
  candidate_name?: string | null;
};
