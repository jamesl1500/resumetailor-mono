import { memo, useEffect, useRef } from "react";
import Button from "./ui/Button";
import styles from "./HeroSection.module.scss";
import type { HeroSectionProps } from "../types/home";

const HeroSection = memo(function HeroSection({
  stats,
  statusLabel,
  progress,
  resumeFile,
  jobText,
  targetRole,
  experienceLevel,
  canSubmit,
  errorMessage,
  activity,
  onResumeChange,
  onJobTextChange,
  onTargetRoleChange,
  onExperienceChange,
  onUseSample,
  onReset,
  onSubmit,
  onTriggerUpload,
}: HeroSectionProps) {
  // Focus on "Upload resume" input when the user clicks "Try it now".
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTryItNow = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (onTriggerUpload) {
      onTriggerUpload(handleTryItNow);
    }
  }, [onTriggerUpload]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <p className={styles.kicker}>AI resume tailoring studio</p>
        <h1>Turn one resume into a role-specific story in minutes, not hours.</h1>
        <p className={styles.subhead}>
          Upload your resume, drop in the job description, and get a clean,
          tailored PDF and DOCX with the right keywords, impact, and tone.
        </p>
        <div className={styles.heroActions}>
          <Button variant="primary" type="button" onClick={handleTryItNow}>
            Try It Now
          </Button>
          <Button variant="secondary" type="button">
            Sign in
          </Button>
        </div>
        <div className={styles.statRow}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <span>{stat.value}</span>
              <small>{stat.label}</small>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.heroCard}>
        <div className={styles.heroCardHeader}>
          <div>
            <p className={styles.cardTitle}>Tailor a resume</p>
            <p className={styles.cardSubtitle}>Live API connected</p>
          </div>
          <span className={styles.badge}>{statusLabel}</span>
        </div>
        <div className={styles.progressBar} aria-hidden>
          <span style={{ width: `${progress}%` }} />
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.uploadBox}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) =>
                onResumeChange(event.target.files?.[0] ?? null)
              }
            />
            <div>
              <p>{resumeFile ? resumeFile.name : "Upload resume"}</p>
              <span>PDF or DOCX up to 10MB</span>
            </div>
          </label>

          <div className={styles.fieldGroup}>
            <label htmlFor="role">Target role</label>
            <input
              id="role"
              type="text"
              value={targetRole}
              onChange={(event) => onTargetRoleChange(event.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="level">Experience</label>
              <select
                id="level"
                value={experienceLevel}
                onChange={(event) => onExperienceChange(event.target.value)}
              >
                <option>Junior</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="format">Output</label>
              <select id="format">
                <option>PDF + DOCX</option>
                <option>PDF only</option>
                <option>DOCX only</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="job">Job description</label>
            <textarea
              id="job"
              rows={6}
              placeholder="Paste the full job description here"
              value={jobText}
              onChange={(event) => onJobTextChange(event.target.value)}
            />
            <Button
              variant="inline"
              type="button"
              onClick={onUseSample}
              className={styles.inlineButton}
            >
              Use sample description
            </Button>
          </div>

          {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}

          <div className={styles.formActions}>
            <Button variant="primary" type="submit" disabled={!canSubmit}>
              Generate tailored resume
            </Button>
            <Button variant="secondary" type="button" onClick={onReset}>
              Reset
            </Button>
          </div>
        </form>
        <div className={styles.activityFeed}>
          <p>Recent activity</p>
          <ul>
            {activity.length === 0 ? (
              <li>Waiting for your input</li>
            ) : (
              activity.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
