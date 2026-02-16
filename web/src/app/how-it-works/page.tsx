import Backdrop from "../../components/Backdrop";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "../marketing.module.scss";

const steps = [
  {
    title: "Upload your resume",
    description:
      "We extract roles, skills, and impact bullets to build a profile.",
  },
  {
    title: "Analyze the job description",
    description:
      "We detect keywords, seniority signals, and role focus areas.",
  },
  {
    title: "Generate tailored files",
    description:
      "We draft a targeted summary, bullet points, and exportable files.",
  },
];

const checks = [
  "ATS-friendly formatting to keep your resume scannable.",
  "Keyword alignment across summary, skills, and bullets.",
  "Editable sections so you can refine tone and impact.",
];

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>How it works</p>
          <h1>From resume upload to tailored files in minutes.</h1>
          <p className={styles.subhead}>
            ResumeTailor connects the signals from your resume to the requirements
            in a job post. The result is a role-specific narrative with clean,
            ATS-friendly formatting.
          </p>
        </header>

        <section className={styles.section}>
          <h2>The three-step flow</h2>
          <div className={styles.grid}>
            {steps.map((step, index) => (
              <div key={step.title} className={styles.stepCard}>
                <span>{`0${index + 1}`}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Quality checks baked in</h2>
          <ul className={styles.list}>
            {checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2>What you can edit</h2>
          <p>
            The analysis workspace lets you refine the summary, skills, experience,
            and education. Adjust the tone, add metrics, and regenerate instantly.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
