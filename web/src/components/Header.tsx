import styles from "./Header.module.scss";
import Button from "./ui/Button";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>ResumeTailor</div>
      <nav className={styles.nav}>
        <a href="#workspace">Workspace</a>
        <a href="#insights">Insights</a>
        <a href="#how">How it works</a>
        <a href="#templates">Templates</a>
      </nav>
      <div className={styles.headerActions}>
        <Button variant="ghost" type="button">
          Sign in
        </Button>
        <Button variant="primary" type="button">
          Start tailoring
        </Button>
      </div>
    </header>
  );
}
