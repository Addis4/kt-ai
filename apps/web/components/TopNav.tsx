import { User } from "lucide-react";
import styles from "./TopNav.module.css";

export default function TopNav() {
  return (
    <header className={styles.nav}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
            <path
              d="M2 17L12 22L22 17M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <div className={styles.title}>KT.ai</div>
          <div className={styles.subtitle}>Project Onboarding</div>
        </div>
      </div>
      <div className={styles.avatar} aria-label="User profile">
        <User size={18} />
      </div>
    </header>
  );
}
