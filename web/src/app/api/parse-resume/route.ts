import { NextResponse } from "next/server";
import type { ParseResumePayload } from "../../../types/tailor";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ParseResumePayload;
  const baseName = body.fileName
    ? body.fileName.replace(/\.[^/.]+$/, "")
    : "Resume";

  await delay(650);

  return NextResponse.json({
    baseName,
    candidateName: "Jordan Lee",
    currentTitle: "Product Designer",
    highlights: [
      "Led discovery sprints with product and engineering",
      "Improved onboarding conversion by 21%",
      "Built reusable component library across 5 squads",
    ],
    suggestedBullets: [
      "Drove UX research and rapid prototyping to validate product direction",
      "Partnered with PMs to translate insights into measurable experiments",
      "Delivered accessible interfaces aligned to WCAG 2.2 guidance",
    ],
  });
}
