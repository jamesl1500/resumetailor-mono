import styles from "./Backdrop.module.scss";

export default function Backdrop() {
  return (
    <div className={styles.backdrop} aria-hidden>
      <span className={styles.orbOne} />
      <span className={styles.orbTwo} />
      <span className={styles.grid} />
    </div>
  );
}
