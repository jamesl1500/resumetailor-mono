import Backdrop from "../../components/Backdrop";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "../legal.module.scss";

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Privacy</p>
          <h1>Privacy policy</h1>
          <p className={styles.subhead}>
            This policy explains what data we collect, how we use it, and the
            choices you have. Last updated: Feb 13, 2026.
          </p>
        </header>

        <section className={styles.section}>
          <h2>What we collect</h2>
          <p>
            We collect the information you provide when you upload a resume,
            paste a job description, and share your preferences for tailoring.
          </p>
          <ul className={styles.list}>
            <li>Resume files and extracted content (roles, skills, bullets).</li>
            <li>Job descriptions and role metadata (title, level, focus).</li>
            <li>Contact details you submit through support.</li>
            <li>Basic analytics for performance and reliability.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How we use data</h2>
          <p>
            Data is used to generate tailored resumes, improve quality, and keep
            the service reliable.
          </p>
          <ul className={styles.list}>
            <li>Generate tailored summaries, bullets, and files.</li>
            <li>Personalize experience based on your role and level.</li>
            <li>Monitor uptime, performance, and error rates.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Sharing</h2>
          <p>
            We do not sell your data. We only share data with vendors who help us
            run the service, such as storage or analytics providers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Retention</h2>
          <p>
            We retain data only as long as needed to deliver the service and meet
            legal obligations. You can request deletion at any time.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Your choices</h2>
          <ul className={styles.list}>
            <li>Request access, correction, or deletion of your data.</li>
            <li>Opt out of non-essential analytics where available.</li>
            <li>Contact support for privacy-related questions.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
