"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import styles from "./AnimatedBackground.module.css";

interface AnimatedBackgroundProps {
  isPlaying: boolean;
}

export default function AnimatedBackground({ isPlaying }: AnimatedBackgroundProps) {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/animations/placeholder.json")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setAnimationData(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 639px)");

    const handleReduce = () => setReduceMotion(mediaQuery.matches);
    const handleMobile = () => setIsMobile(mobileQuery.matches);

    handleReduce();
    handleMobile();

    mediaQuery.addEventListener("change", handleReduce);
    mobileQuery.addEventListener("change", handleMobile);

    return () => {
      mediaQuery.removeEventListener("change", handleReduce);
      mobileQuery.removeEventListener("change", handleMobile);
    };
  }, []);

  const playback = useMemo(() => {
    if (reduceMotion) {
      return false;
    }
    return isPlaying;
  }, [isPlaying, reduceMotion]);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(isMobile ? 0.6 : 1);
    }
  }, [isMobile]);

  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.gradientOverlay} />
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop
          autoplay={playback}
          style={{ width: "100%", height: "100%" }}
          className={styles.lottie}
          rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
          lottieRef={lottieRef}
        />
      ) : null}
    </div>
  );
}
