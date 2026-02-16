import Backdrop from "../../components/Backdrop";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "../marketing.module.scss";

const templates = [
  {
    title: "Crisp Minimal",
    detail:
      "Single-column, ATS-first layout for high-volume applications and clarity.",
    emphasis: ["Single column", "Tight spacing", "ATS clarity"],
    style: "minimal",
  },
  {
    title: "Studio Narrative",
    detail:
      "A visual-forward layout with space for impact stories and leadership wins.",
    emphasis: ["Storytelling", "Balanced layout", "Portfolio friendly"],
    style: "studio",
  },
  {
    title: "Executive Brief",
    detail:
      "Summary-led framing for senior roles with a focus on outcomes and strategy.",
    emphasis: ["Summary-led", "Metrics focus", "Leadership tone"],
    style: "executive",
  },
];

export default function TemplatesPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
      <Header />
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Templates</p>
          <h1>Three resume templates built for different narratives.</h1>
          <p className={styles.subhead}>
            Swap templates without losing your tailored content. Each layout stays
            ATS-friendly while shifting the visual tone.
          </p>
        </header>

        <section className={styles.section}>
          <div className={styles.grid}>
            {templates.map((template) => (
              <div key={template.title} className={styles.templateCard}>
                <div
                  className={styles.templatePreview}
                  data-style={template.style}
                />
                <h2>{template.title}</h2>
                <p>{template.detail}</p>
                <div className={styles.badgeRow}>
                  {template.emphasis.map((item) => (
                    <span key={item} className={styles.badge}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
