"use client";

import { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Button from "./ui/Button";

type HeaderProps = {
  onStartTailoring?: () => void;
};

const Header = memo(function Header({ onStartTailoring }: HeaderProps) {
  const router = useRouter();

  const handleStartTailoring = () => {
    if (onStartTailoring) {
      onStartTailoring();
    } else {
      router.push("/");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoMark}>
        <Link href="/" className={styles.logo}>
          ResumeTailor
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/about">About</Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/templates">Templates</Link>
      </nav>
      <div className={styles.headerActions}>
        <Button variant="primary" type="button" onClick={handleStartTailoring}>
          Start tailoring
        </Button>
      </div>
    </header>
  );
});

export default Header;
