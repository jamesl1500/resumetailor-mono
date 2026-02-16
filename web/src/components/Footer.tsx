import { memo } from "react";
import Link from "next/link";
import styles from "./Footer.module.scss";

const Footer = memo(function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>ResumeTailor</strong>
        <p>Designed for focused applications and faster interviews.</p>
      </div>
      <div className={styles.footerLinks}>
        <Link href="/privacy">privacy</Link>
        <Link href="/terms">terms</Link>
        <Link href="/support">support</Link>
      </div>
    </footer>
  );
});

export default Footer;
