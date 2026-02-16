import Backdrop from "../../components/Backdrop";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "../marketing.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>About</p>
          <h1>Built for focused applications, not volume.</h1>
          <p className={styles.subhead}>
            ResumeTailor helps you adapt your professional story to fit each
            role—without starting from scratch every time.
          </p>
        </header>

        <section className={styles.section}>
          <h2>Why we built this</h2>
          <p>
            Job applications are time-intensive. Most job seekers either send a
            generic resume to every role or spend hours rewriting bullets for
            each posting. We wanted a faster path: a tool that listens to what
            a role needs, aligns your experience to it, and delivers polished
            files in minutes.
          </p>
        </section>

        <section className={styles.section}>
          <h2>What makes it different</h2>
          <ul className={styles.list}>
            <li>
              <strong>Role-specific tailoring:</strong> We match your experience
              to the job signals—keywords, seniority, focus areas.
            </li>
            <li>
              <strong>ATS-first design:</strong> All templates are built to pass
              automated systems while staying readable.
            </li>
            <li>
              <strong>Fully editable:</strong> You control every section. Adjust
              tone, add metrics, and regenerate instantly.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Who it's for</h2>
          <p>
            ResumeTailor is designed for professionals applying to multiple
            roles with different narratives. If you're targeting product roles
            in some companies and strategy roles in others, this tool helps you
            tell the right story for each audience.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Our approach</h2>
          <p>
            We don't believe in one-size-fits-all resumes. Every role has
            different priorities, and your resume should reflect that. We
            extract what matters from your background, analyze what the role
            needs, and connect the two with precision.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
