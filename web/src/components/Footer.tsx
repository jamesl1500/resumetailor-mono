import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>ResumeTailor</strong>
        <p>Designed for focused applications and faster interviews.</p>
      </div>
      <div>
        <span>privacy</span>
        <span>terms</span>
        <span>support</span>
      </div>
    </footer>
  );
}
