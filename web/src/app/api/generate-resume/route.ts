import { NextResponse } from "next/server";

type GenerateResumePayload = {
  baseName?: string;
  targetRole?: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GenerateResumePayload;
  const safeName = body.baseName?.trim() || "Resume";

  await delay(800);

  return NextResponse.json({
    outputFiles: [`${safeName}-tailored.pdf`, `${safeName}-tailored.docx`],
    role: body.targetRole ?? "Product Designer",
  });
}
