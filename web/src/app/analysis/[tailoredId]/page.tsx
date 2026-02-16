import { notFound } from "next/navigation";
import AnalysisClient from "../AnalysisClient";
import { API_BASE, buildPreviewOutputFiles } from "../../../lib/api";
import type {
  AnalysisApiResponse,
  AnalysisPageProps,
  StyleOption,
} from "../../../types/analysis";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { tailoredId } = params;

  if (!tailoredId || !UUID_REGEX.test(tailoredId)) {
    notFound();
  }

  const response = await fetch(`${API_BASE}/tailor/result/${tailoredId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const data = (await response.json()) as AnalysisApiResponse;
  const outputs = buildPreviewOutputFiles(data.outputs ?? [], data.id);

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
        style: (data.style as StyleOption) ?? "Modern",
        candidateName: data.candidate_name ?? undefined,
      }}
    />
  );
}
