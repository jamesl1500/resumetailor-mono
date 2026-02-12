import { notFound } from "next/navigation";
import AnalysisClient from "../AnalysisClient";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type PageProps = {
  params: { tailoredId: string };
};

type ApiResponse = {
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
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    bullets?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string | null;
    field_of_study?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    bullets?: string[];
  }>;
  target_role?: string | null;
  style?: string | null;
  candidate_name?: string | null;
};

export default async function AnalysisPage({ params }: PageProps) {
  const { tailoredId } = await params;

  if (!tailoredId || !UUID_REGEX.test(tailoredId)) {
    notFound();
  }

  const response = await fetch(`${API_BASE}/tailor/result/${tailoredId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const data = (await response.json()) as ApiResponse;
  const outputs = (data.outputs ?? []).map((path) => {
    const name = path.split("/").slice(-1)[0];
    const url = `${API_BASE}/tailor/download/${data.id}/${encodeURIComponent(name)}`;
    const previewUrl = `${API_BASE}/tailor/preview/${data.id}/${encodeURIComponent(
      name
    )}`;
    return { name, url, previewUrl };
  });

  return (
    <AnalysisClient
      data={{
        id: data.id,
        matchScore: data.match_score,
        summary: data.summary,
        keywords: data.keywords,
        signals: data.signals,
        outputs,
        statement: data.statement ?? "",
        skills: data.skills ?? [],
        experience: data.experience ?? [],
        education: data.education ?? [],
        targetRole: data.target_role ?? undefined,
        style: (data.style as "Slim" | "Modern" | "Fancy") ?? "Modern",
        candidateName: data.candidate_name ?? undefined,
      }}
    />
  );
}
