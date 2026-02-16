import { memo } from "react";
import styles from "./TemplatesSection.module.scss";
import type { TemplatesSectionProps } from "../types/home";

const TemplatesSection = memo(function TemplatesSection({ templates }: TemplatesSectionProps) {
  return (
    <section className={styles.templates} id="templates">
      <div className={styles.sectionHeader}>
        <h2>Tailored templates</h2>
        <p>Swap layouts without losing your tailored content.</p>
      </div>
      <div className={styles.templateGrid}>
        {templates.map((template) => (
          <div key={template.title} className={styles.templateCard}>
            <div className={styles.templatePreview} />
            <h3>{template.title}</h3>
            <p>{template.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default TemplatesSection;
