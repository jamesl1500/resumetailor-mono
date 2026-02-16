"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Backdrop from "../../components/Backdrop";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/ui/Button";
import styles from "./analysis.module.scss";
import { API_BASE, buildPreviewOutputFiles } from "../../lib/api";
import type {
  AnalysisClientProps,
  EducationEntry,
  ExperienceEntry,
  StyleCard,
  StyleOption,
  TabKey,
  TailorResultResponse,
} from "../../types/analysis";

const styleOptions: StyleCard[] = [
  {
    name: "Slim",
    description: "Compact single-column resume with tight spacing and ATS clarity.",
    emphasis: ["Single column", "Condensed spacing", "Keyword-first"],
  },
  {
    name: "Modern",
    description: "Balanced layout with clear hierarchy and ATS-friendly styling.",
    emphasis: ["Balanced hierarchy", "Readable sections", "Clean typography"],
  },
  {
    name: "Fancy",
    description: "Subtle visual accents while staying ATS optimized.",
    emphasis: ["Accent rules", "Soft highlights", "ATS optimized"],
  },
];

const tabs: TabKey[] = [
  "Overview",
  "Summary",
  "Skills",
  "Experience",
  "Education",
  "Review",
];

const normalizeBullets = (bullets?: string[]) =>
  (bullets ?? []).map((bullet) => bullet.trim()).filter(Boolean);

const getStorageKey = (id: string, section: "experience" | "education") =>
  `resumetailor:${id}:${section}`;


export default function AnalysisClient({ data }: AnalysisClientProps) {
  const router = useRouter();
  const [currentId, setCurrentId] = useState(data.id);
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(
    data.style ?? "Modern"
  );
  const [matchScore, setMatchScore] = useState(data.matchScore);
  const [summary, setSummary] = useState(data.summary);
  const [keywords, setKeywords] = useState<string[]>(data.keywords ?? []);
  const [signals, setSignals] = useState(data.signals);
  const [outputs, setOutputs] = useState(data.outputs ?? []);
  const [statement, setStatement] = useState(data.statement ?? "");
  const [skills, setSkills] = useState(data.skills.join(", "));
  const [experience, setExperience] = useState<ExperienceEntry[]>(
    data.experience ?? []
  );
  const [education, setEducation] = useState<EducationEntry[]>(
    data.education ?? []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedExperience = localStorage.getItem(
        getStorageKey(data.id, "experience")
      );
      const storedEducation = localStorage.getItem(
        getStorageKey(data.id, "education")
      );

      if (storedExperience) {
        setExperience(JSON.parse(storedExperience) as ExperienceEntry[]);
      }

      if (storedEducation) {
        setEducation(JSON.parse(storedEducation) as EducationEntry[]);
      }
    } catch (error) {
      console.warn("Unable to read local resume edits.", error);
    }
  }, [data.id]);

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey(currentId, "experience"),
        JSON.stringify(experience)
      );
    } catch (error) {
      console.warn("Unable to save experience edits.", error);
    }
  }, [experience, currentId]);

  useEffect(() => {
    try {
      localStorage.setItem(
        getStorageKey(currentId, "education"),
        JSON.stringify(education)
      );
    } catch (error) {
      console.warn("Unable to save education edits.", error);
    }
  }, [education, currentId]);

  const downloadReady = useMemo(() => outputs.length > 0, [outputs]);

  const primaryFile = useMemo(() => outputs[0] ?? null, [outputs]);
  const pdfFile = useMemo(
    () =>
      outputs.find((file) => file.name.toLowerCase().endsWith(".pdf")) ??
      null,
    [outputs]
  );
  const viewerUrl = pdfFile?.previewUrl ?? null;
  const openFile = pdfFile ?? primaryFile;

  const updateExperienceEntry = (
    index: number,
    patch: Partial<ExperienceEntry>
  ) => {
    setExperience((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  };

  const updateExperienceBullet = (
    index: number,
    bulletIndex: number,
    value: string
  ) => {
    setExperience((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const bullets = [...(item.bullets ?? [])];
        bullets[bulletIndex] = value;
        return { ...item, bullets };
      })
    );
  };

  const addExperienceBullet = (index: number) => {
    setExperience((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        return { ...item, bullets: [...(item.bullets ?? []), ""] };
      })
    );
  };

  const removeExperienceBullet = (index: number, bulletIndex: number) => {
    setExperience((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const bullets = (item.bullets ?? []).filter(
          (_, currentIndex) => currentIndex !== bulletIndex
        );
        return { ...item, bullets };
      })
    );
  };

  const addExperienceEntry = () => {
    setExperience((prev) => [
      ...prev,
      {
        title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        bullets: [""],
      },
    ]);
  };

  const removeExperienceEntry = (index: number) => {
    setExperience((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateEducationEntry = (
    index: number,
    patch: Partial<EducationEntry>
  ) => {
    setEducation((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    );
  };

  const updateEducationBullet = (
    index: number,
    bulletIndex: number,
    value: string
  ) => {
    setEducation((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const bullets = [...(item.bullets ?? [])];
        bullets[bulletIndex] = value;
        return { ...item, bullets };
      })
    );
  };

  const addEducationBullet = (index: number) => {
    setEducation((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        return { ...item, bullets: [...(item.bullets ?? []), ""] };
      })
    );
  };

  const removeEducationBullet = (index: number, bulletIndex: number) => {
    setEducation((prev) =>
      prev.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const bullets = (item.bullets ?? []).filter(
          (_, currentIndex) => currentIndex !== bulletIndex
        );
        return { ...item, bullets };
      })
    );
  };

  const addEducationEntry = () => {
    setEducation((prev) => [
      ...prev,
      {
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        bullets: [""],
      },
    ]);
  };

  const removeEducationEntry = (index: number) => {
    setEducation((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleSavePreview = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      statement: statement.trim() || null,
      skills: skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      experience: experience.map((item) => ({
        title: item.title?.trim() || null,
        company: item.company?.trim() || null,
        location: item.location?.trim() || null,
        start_date: item.start_date?.trim() || null,
        end_date: item.end_date?.trim() || null,
        bullets: normalizeBullets(item.bullets),
      })),
      education: education.map((item) => ({
        institution: item.institution?.trim() || null,
        degree: item.degree?.trim() || null,
        field_of_study: item.field_of_study?.trim() || null,
        start_date: item.start_date?.trim() || null,
        end_date: item.end_date?.trim() || null,
        bullets: normalizeBullets(item.bullets),
      })),
      style: selectedStyle,
    };

    try {
      const response = await fetch(`${API_BASE}/tailor/regenerate/${currentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate resume");
      }

      const result = (await response.json()) as { id: string };
      const previewResponse = await fetch(
        `${API_BASE}/tailor/result/${result.id}`,
        {
          cache: "no-store",
        }
      );

      if (!previewResponse.ok) {
        throw new Error("Failed to fetch updated resume");
      }

      const previewData = (await previewResponse.json()) as TailorResultResponse;
      setCurrentId(previewData.id);
      setMatchScore(previewData.match_score);
      setSummary(previewData.summary);
      setKeywords(previewData.keywords ?? []);
      setSignals(previewData.signals);
      setOutputs(buildPreviewOutputFiles(previewData.outputs ?? [], previewData.id));
      setSelectedStyle((previewData.style as StyleOption) ?? selectedStyle);
      setStatement(previewData.statement ?? "");
      setSkills((previewData.skills ?? []).join(", "));
      setExperience(previewData.experience ?? []);
      setEducation(previewData.education ?? []);

      if (window.history?.replaceState) {
        window.history.replaceState({}, "", `/analysis/${previewData.id}`);
      } else {
        router.replace(`/analysis/${previewData.id}`);
      }
    } catch (error) {
      setErrorMessage("Unable to update the resume. Try again.");
      console.error("Error updating the resume:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <section className={styles.viewerSection}>
          <div className={styles.viewerHeader}>
            <div>
              <p className={styles.kicker}>Tailored resume</p>
              <h1>Review alignment, then refine every section.</h1>
              <p className={styles.subhead}>
                Preview the tailored resume, then step through each section to make
                precise edits before generating the final version.
              </p>
            </div>
            <div className={styles.viewerActions}>
              <Button
                variant="primary"
                type="button"
                onClick={handleSavePreview}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating..." : "Generate resume"}
              </Button>
              {openFile ? (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => window.open(openFile.url, "_blank")}
                >
                  Open file
                </Button>
              ) : null}
            </div>
          </div>
          <div className={styles.viewerFrame}>
            {viewerUrl ? (
              <iframe
                className={styles.viewerIframe}
                src={viewerUrl}
                title={pdfFile?.name ?? "Resume preview"}
              />
            ) : (
              <div className={styles.viewerPlaceholder}>
                <strong>Resume preview</strong>
                <span>PDF preview will appear here after generation.</span>
              </div>
            )}
          </div>
          <div className={styles.viewerMeta}>
            <div>
              <strong>{openFile?.name ?? "Preview file"}</strong>
              <span>
                {viewerUrl
                  ? `PDF preview is ready. Style: ${selectedStyle}`
                  : "PDF preview is available after generation."}
              </span>
            </div>
            <div className={styles.viewerMetaActions}>
              {openFile ? (
                <Button
                  variant="inline"
                  type="button"
                  onClick={() => window.open(openFile.url, "_blank")}
                >
                  Download
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.tabs}>
          <div className={styles.tabList} role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={`${styles.tabButton} ${
                  activeTab === tab ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "Overview" ? (
          <section className={styles.overviewGrid}>
            <div className={styles.scoreCard}>
              <p>Match score</p>
              <span>{matchScore}</span>
              <small>ATS alignment score</small>
            </div>

            <div className={styles.card}>
              <h2>Job analysis</h2>
              <p>{summary}</p>
              <div className={styles.tagRow}>
                {keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2>Signals detected</h2>
              <div className={styles.signalGroup}>
                <div>
                  <strong>Seniority</strong>
                  <ul>
                    {signals.levels.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Tools</strong>
                  <ul>
                    {signals.tools.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Focus</strong>
                  <ul>
                    {signals.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === "Summary" ? (
          <section className={styles.editorSection}>
            <div className={styles.editCard}>
              <h2>Professional statement</h2>
              <textarea
                className={styles.textarea}
                rows={6}
                value={statement}
                onChange={(event) => setStatement(event.target.value)}
              />
              <small>Keep it crisp and role-aligned.</small>
            </div>
          </section>
        ) : null}

        {activeTab === "Skills" ? (
          <section className={styles.editorSection}>
            <div className={styles.editCard}>
              <h2>Core skills</h2>
              <input
                className={styles.textInput}
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
              />
              <small>Comma-separated skills. Keep it ATS friendly.</small>
            </div>
          </section>
        ) : null}

        {activeTab === "Experience" ? (
          <section className={styles.editorSection}>
            {experience.map((entry, index) => (
              <div key={`experience-${index}`} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <h3>Experience {index + 1}</h3>
                  <Button
                    variant="inline"
                    type="button"
                    onClick={() => removeExperienceEntry(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label>Title</label>
                    <input
                      className={styles.textInput}
                      value={entry.title ?? ""}
                      onChange={(event) =>
                        updateExperienceEntry(index, { title: event.target.value })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Company</label>
                    <input
                      className={styles.textInput}
                      value={entry.company ?? ""}
                      onChange={(event) =>
                        updateExperienceEntry(index, { company: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label>Location</label>
                    <input
                      className={styles.textInput}
                      value={entry.location ?? ""}
                      onChange={(event) =>
                        updateExperienceEntry(index, { location: event.target.value })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Start date</label>
                    <input
                      className={styles.textInput}
                      value={entry.start_date ?? ""}
                      onChange={(event) =>
                        updateExperienceEntry(index, { start_date: event.target.value })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>End date</label>
                    <input
                      className={styles.textInput}
                      value={entry.end_date ?? ""}
                      onChange={(event) =>
                        updateExperienceEntry(index, { end_date: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={styles.bullets}>
                  <label>Bullets</label>
                  {(entry.bullets ?? []).map((bullet, bulletIndex) => (
                    <div
                      key={`experience-${index}-bullet-${bulletIndex}`}
                      className={styles.bulletRow}
                    >
                      <input
                        className={styles.textInput}
                        value={bullet}
                        onChange={(event) =>
                          updateExperienceBullet(
                            index,
                            bulletIndex,
                            event.target.value
                          )
                        }
                      />
                      <Button
                        variant="inline"
                        type="button"
                        onClick={() =>
                          removeExperienceBullet(index, bulletIndex)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => addExperienceBullet(index)}
                  >
                    Add bullet
                  </Button>
                </div>
              </div>
            ))}
            <div className={styles.addRow}>
              <Button variant="primary" type="button" onClick={addExperienceEntry}>
                Add experience
              </Button>
            </div>
          </section>
        ) : null}

        {activeTab === "Education" ? (
          <section className={styles.editorSection}>
            {education.map((entry, index) => (
              <div key={`education-${index}`} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <h3>Education {index + 1}</h3>
                  <Button
                    variant="inline"
                    type="button"
                    onClick={() => removeEducationEntry(index)}
                  >
                    Remove
                  </Button>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label>Institution</label>
                    <input
                      className={styles.textInput}
                      value={entry.institution ?? ""}
                      onChange={(event) =>
                        updateEducationEntry(index, {
                          institution: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Degree</label>
                    <input
                      className={styles.textInput}
                      value={entry.degree ?? ""}
                      onChange={(event) =>
                        updateEducationEntry(index, { degree: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label>Field of study</label>
                    <input
                      className={styles.textInput}
                      value={entry.field_of_study ?? ""}
                      onChange={(event) =>
                        updateEducationEntry(index, {
                          field_of_study: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>Start date</label>
                    <input
                      className={styles.textInput}
                      value={entry.start_date ?? ""}
                      onChange={(event) =>
                        updateEducationEntry(index, {
                          start_date: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>End date</label>
                    <input
                      className={styles.textInput}
                      value={entry.end_date ?? ""}
                      onChange={(event) =>
                        updateEducationEntry(index, { end_date: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={styles.bullets}>
                  <label>Highlights</label>
                  {(entry.bullets ?? []).map((bullet, bulletIndex) => (
                    <div
                      key={`education-${index}-bullet-${bulletIndex}`}
                      className={styles.bulletRow}
                    >
                      <input
                        className={styles.textInput}
                        value={bullet}
                        onChange={(event) =>
                          updateEducationBullet(
                            index,
                            bulletIndex,
                            event.target.value
                          )
                        }
                      />
                      <Button
                        variant="inline"
                        type="button"
                        onClick={() =>
                          removeEducationBullet(index, bulletIndex)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => addEducationBullet(index)}
                  >
                    Add highlight
                  </Button>
                </div>
              </div>
            ))}
            <div className={styles.addRow}>
              <Button variant="primary" type="button" onClick={addEducationEntry}>
                Add education
              </Button>
            </div>
          </section>
        ) : null}

        {activeTab === "Review" ? (
          <section className={styles.reviewGrid}>
            <div className={styles.card}>
              <h2>Generated files</h2>
              <div className={styles.fileList}>
                {downloadReady ? (
                  outputs.map((file) => (
                    <div key={file.url}>
                      <div>
                        <strong>{file.name}</strong>
                        <span>Ready</span>
                      </div>
                      <Button
                        variant="inline"
                        type="button"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        Download
                      </Button>
                    </div>
                  ))
                ) : (
                  <div>
                    <div>
                      <strong>Resume-tailored.pdf</strong>
                      <span>Ready</span>
                    </div>
                    <Button variant="inline" type="button" disabled>
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.styles}>
              <div className={styles.sectionHeader}>
                <h2>Choose a resume style</h2>
                <p>
                  All three options are ATS optimized while shifting the visual
                  tone.
                </p>
              </div>
              <div className={styles.styleGrid}>
                {styleOptions.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    className={`${styles.styleCard} ${
                      selectedStyle === option.name ? styles.active : ""
                    }`}
                    onClick={() => setSelectedStyle(option.name)}
                    data-style={option.name.toLowerCase()}
                  >
                    <div className={styles.styleHeader}>
                      <span>{option.name}</span>
                      <small>ATS optimized</small>
                    </div>
                    <div className={styles.stylePreview}>
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <p>{option.description}</p>
                    <ul>
                      {option.emphasis.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <div className={styles.styleActions}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleSavePreview}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Generating..."
                    : `Apply ${selectedStyle} style`}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleSavePreview}
                >
                  Generate final resume
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {errorMessage ? (
          <div className={styles.notice}>{errorMessage}</div>
        ) : null}
      </main>
      <button
        type="button"
        className={styles.floatingAction}
        onClick={handleSavePreview}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save & Preview"}
      </button>
      <Footer />
    </div>
  );
}
