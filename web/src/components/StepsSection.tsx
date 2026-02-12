import styles from "./StepsSection.module.scss";

type Step = {
  title: string;
  description: string;
};

type StepsSectionProps = {
  steps: Step[];
};

export default function StepsSection({ steps }: StepsSectionProps) {
  return (
    <section className={styles.steps} id="how">
      <div className={styles.sectionHeader}>
        <h2>How it works</h2>
        <p>Every run follows a clear flow so you can tweak and retry fast.</p>
      </div>
      <div className={styles.stepGrid}>
        {steps.map((step, index) => (
          <div key={step.title} className={styles.stepCard}>
            <span>{`0${index + 1}`}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
