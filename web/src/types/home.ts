import type { FormEvent } from "react";
import type { Results, Status } from "./tailor";

export type Stat = {
  label: string;
  value: string;
};

export type HeroSectionProps = {
  stats: Stat[];
  statusLabel: string;
  progress: number;
  resumeFile: File | null;
  jobText: string;
  targetRole: string;
  experienceLevel: string;
  canSubmit: boolean;
  errorMessage: string | null;
  activity: string[];
  onResumeChange: (file: File | null) => void;
  onJobTextChange: (value: string) => void;
  onTargetRoleChange: (value: string) => void;
  onExperienceChange: (value: string) => void;
  onUseSample: () => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTriggerUpload?: (trigger: () => void) => void;
};

export type Step = {
  title: string;
  description: string;
};

export type StepsSectionProps = {
  steps: Step[];
};

export type Template = {
  title: string;
  detail: string;
};

export type TemplatesSectionProps = {
  templates: Template[];
};

export type WorkspaceSectionProps = {
  results: Results | null;
  targetRole: string;
  experienceLevel: string;
  status: Status;
};
