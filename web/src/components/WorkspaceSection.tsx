import { memo } from "react";
import styles from "./WorkspaceSection.module.scss";
import Button from "./ui/Button";
import type { WorkspaceSectionProps } from "../types/home";

const WorkspaceSection = memo(function WorkspaceSection({
  results,
  targetRole,
  experienceLevel,
  status,
}: WorkspaceSectionProps) {
  return (
    <section className={styles.workspace} id="workspace">
      <div className={styles.workspaceHeader}>
        <h2>Workspace summary</h2>
        <p>
          Match signals, tailored bullets, and generated files update after each
          run.
        </p>
      </div>
      <div className={styles.workspaceGrid}>
        <div className={styles.workspaceCard}>
          <h3>Candidate snapshot</h3>
          <div className={styles.snapshot}>
            <div>
              <span>Name</span>
              <strong>{results?.candidateName ?? "Jordan Lee"}</strong>
            </div>
            <div>
              <span>Current title</span>
              <strong>{results?.currentTitle ?? "Product Designer"}</strong>
            </div>
            <div>
              <span>Target role</span>
              <strong>{targetRole}</strong>
            </div>
            <div>
              <span>Experience</span>
              <strong>{experienceLevel}</strong>
            </div>
          </div>
          <div
            className={styles.score}
            aria-label={`Match score ${results?.matchScore ?? 0}`}
          >
            <span>{results?.matchScore ?? 0}</span>
            <p>Match score</p>
          </div>
        </div>

        <div className={styles.workspaceCard} id="insights">
          <h3>Job alignment insights</h3>
          <div className={styles.tagGroup}>
            {(results?.keywords ?? [
              "Design systems",
              "Figma",
              "Experimentation",
            ]).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className={styles.miniList}>
            <strong>Opportunity areas</strong>
            <ul>
              {(results?.gaps ?? [
                "Workshop facilitation",
                "Cross-functional leadership",
              ]).map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.workspaceCard}>
          <h3>Tailored highlights</h3>
          <ul className={styles.bulletList}>
            {(results?.highlights ?? [
              "Led discovery sprints with product and engineering",
              "Improved onboarding conversion by 21%",
              "Built reusable component library across 5 squads",
            ]).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div className={styles.workspaceCard}>
          <h3>Suggested resume bullets</h3>
          <ul className={styles.bulletList}>
            {(results?.suggestedBullets ?? [
              "Drove UX research and rapid prototyping",
              "Partnered with PMs to translate insights",
              "Delivered accessible interfaces",
            ]).map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className={styles.workspaceCard}>
          <h3>Generated files</h3>
          <div className={styles.fileList}>
            {(results?.outputFiles ?? []).length > 0 ? (
              results?.outputFiles.map((file) => (
                <div key={file.url}>
                  <span>{file.name}</span>
                  <Button
                    variant="inline"
                    type="button"
                    disabled={status !== "ready"}
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    Download
                  </Button>
                </div>
              ))
            ) : (
              <div>
                <span>Resume-tailored.pdf</span>
                <Button variant="inline" type="button" disabled>
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default WorkspaceSection;
