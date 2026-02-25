"use client";

import { ReactNode, useState } from "react";
import AnimatedBackground from "./AnimatedBackground";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);

  return (
    <div className={styles.shell}>
      <AnimatedBackground isPlaying={isAnimationPlaying} />
      <TopNav />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          {children}
          <footer className={styles.footer}>
            <span className={styles.footerText}>KT.ai · Project Onboarding Portal</span>
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setIsAnimationPlaying((prev) => !prev)}
              aria-pressed={!isAnimationPlaying}
              aria-label={isAnimationPlaying ? "Pause background animation" : "Play background animation"}
            >
              {isAnimationPlaying ? "Pause Animation" : "Play Animation"}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
