"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Backdrop from "../components/Backdrop";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import WorkspaceSection from "../components/WorkspaceSection";
import StepsSection from "../components/StepsSection";
import TemplatesSection from "../components/TemplatesSection";
import Footer from "../components/Footer";
import { apiPost, apiUpload, buildOutputFiles, trackVisit } from "../lib/api";
import type {
  AnalyzeJobResponse,
  GenerateResumeResponse,
  ParseResumeResponse,
  Results,
  Status,
} from "../types/tailor";

const sampleJobDescription = `We are looking for a product designer to partner with product and engineering on discovery,
prototype new experiences, and deliver polished UI. Experience running workshops, creating design systems, and shipping
web products is preferred. Please include examples of experimentation, accessibility work, and data-informed decisions.`;

const stats = [
  { label: "Average lift", value: "+37%" },
  { label: "Time to tailor", value: "3 min" },
  { label: "Supported formats", value: "PDF + DOCX" },
];

const steps = [
  {
    title: "Upload your resume",
    description: "Drag in a PDF or DOCX. We extract roles, impact, and core skills.",
  },
  {
    title: "Paste the job description",
    description: "We identify required keywords, tooling, and seniority signals.",
  },
  {
    title: "Generate tailored files",
    description: "Download a polished resume aligned to the role and company tone.",
  },
];

const templates = [
  {
    title: "Crisp Minimal",
    detail: "Single-column, ATS-first layout for high volume applications.",
  },
  {
    title: "Studio Narrative",
    detail: "A visual-forward layout with space for impact stories.",
  },
  {
    title: "Executive Brief",
    detail: "Summary-heavy framing for leadership and strategy roles.",
  },
];

const buildMatchScore = (jobLength: number) =>
  Math.min(96, 60 + Math.floor(jobLength / 55));

const buildGapList = (focusSignals: string[]) => {
  const defaults = [
    "Metrics definition",
    "Workshop facilitation",
    "Cross-functional leadership",
  ];
  if (focusSignals.length === 0) {
    return defaults;
  }

  const gaps = [
    focusSignals.includes("metrics") ? null : "Metrics definition",
    focusSignals.includes("stakeholder") ? null : "Stakeholder alignment",
    focusSignals.includes("accessibility") ? null : "Accessibility coverage",
  ].filter(Boolean) as string[];

  return gaps.length > 0 ? gaps : defaults;
};

export default function Home() {
  const router = useRouter();
  const uploadTriggerRef = useRef<(() => void) | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Mid");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [activity, setActivity] = useState<string[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    trackVisit().catch(() => undefined);
  }, []);

  const handleSetUploadTrigger = useCallback((trigger: () => void) => {
    uploadTriggerRef.current = trigger;
  }, []);

  const handleStartTailoring = useCallback(() => {
    uploadTriggerRef.current?.();
  }, []);

  const canSubmit = useMemo(
    () =>
      Boolean(resumeFile) &&
      jobText.trim().length > 30 &&
      (status === "idle" || status === "ready" || status === "error"),
    [jobText, resumeFile, status]
  );

  const statusLabel = useMemo(() => {
    switch (status) {
      case "uploading":
        return "Extracting your resume";
      case "analyzing":
        return "Mapping job requirements";
      case "tailoring":
        return "Tailoring content";
      case "ready":
        return "Tailored resume ready";
      case "error":
        return "We could not finish this request";
      default:
        return "Ready when you are";
    }
  }, [status]);

  const handleSample = () => {
    setJobText(sampleJobDescription);
  };

  const logActivity = (message: string) => {
    setActivity((prev) => [message, ...prev].slice(0, 6));
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobText("");
    setTargetRole("Software Engineer");
    setExperienceLevel("Mid");
    setStatus("idle");
    setProgress(0);
    setActivity([]);
    setResults(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!resumeFile || jobText.trim().length < 30) {
      setErrorMessage("Add a resume and a detailed job description to continue.");
      return;
    }

    try {
      setStatus("uploading");
      setProgress(18);
      logActivity("Uploading resume and extracting sections");

      const formData = new FormData();
      formData.append("file", resumeFile);
      const parseResponse = await apiUpload<ParseResumeResponse>(
        "/tailor/parse-resume-file",
        formData
      );

      setStatus("analyzing");
      setProgress(52);
      logActivity("Analyzing job description and role signals");

      const analyzeResponse = await apiPost<AnalyzeJobResponse>(
        "/tailor/analyze-job",
        { job_text: jobText, target_role: targetRole, experience_level: experienceLevel }
      );

      setStatus("tailoring");
      setProgress(82);
      logActivity("Drafting tailored bullet points and summaries");

      const generateResponse = await apiPost<GenerateResumeResponse>(
        "/tailor/generate",
        {
          job_analysis_id: analyzeResponse.id,
          resume_profile_id: parseResponse.id,
          target_role: targetRole,
          style: "Modern",
        }
      );

      const matchScore = buildMatchScore(jobText.length);
      const gaps = buildGapList(analyzeResponse.signals.focus);
      const outputFiles = buildOutputFiles(
        generateResponse.output_files,
        generateResponse.id
      );

      setResults({
        candidateName: parseResponse.parsed_data?.name ?? "Candidate",
        currentTitle: targetRole,
        matchScore,
        keywords: analyzeResponse.keywords,
        gaps,
        highlights: generateResponse.tailored_bullets,
        suggestedBullets: generateResponse.tailored_bullets,
        outputFiles,
      });

      setStatus("ready");
      setProgress(100);
      logActivity("Tailored files are ready for download");

      router.push(`/analysis/${generateResponse.id}`);
    } catch (error) {
      setStatus("error");
      setProgress(0);
      setErrorMessage("Something went wrong. Try again with another file.");
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className={styles.page}>
      <Backdrop />
      <Header onStartTailoring={handleStartTailoring} />
      <main className={styles.main}>
        <HeroSection
          stats={stats}
          statusLabel={statusLabel}
          progress={progress}
          resumeFile={resumeFile}
          jobText={jobText}
          targetRole={targetRole}
          experienceLevel={experienceLevel}
          canSubmit={canSubmit}
          errorMessage={errorMessage}
          activity={activity}
          onResumeChange={setResumeFile}
          onJobTextChange={setJobText}
          onTargetRoleChange={setTargetRole}
          onExperienceChange={setExperienceLevel}
          onUseSample={handleSample}
          onReset={handleReset}
          onSubmit={handleSubmit}
          onTriggerUpload={handleSetUploadTrigger}
        />
        {status === "ready" && results ? (
          <WorkspaceSection
            results={results}
            targetRole={targetRole}
            experienceLevel={experienceLevel}
            status={status}
          />
        ) : null}
        <StepsSection steps={steps} />
        <TemplatesSection templates={templates} />
      </main>
      <Footer />
    </div>
  );
}
