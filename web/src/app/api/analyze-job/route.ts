import { NextResponse } from "next/server";
import type { AnalyzeJobPayload } from "../../../types/tailor";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AnalyzeJobPayload;
  const length = body.jobText?.length ?? 0;
  const matchScore = Math.min(96, 62 + Math.floor(length / 45));

  await delay(700);

  return NextResponse.json({
    matchScore,
    role: body.targetRole ?? "Product Designer",
    level: body.experienceLevel ?? "Mid",
    keywords: [
      "Product strategy",
      "Design systems",
      "Accessibility",
      "Experimentation",
      "Figma",
      "Stakeholder alignment",
    ],
    gaps: [
      "Metrics definition",
      "Workshop facilitation",
      "Cross-functional leadership",
    ],
  });
}
