"use client";

import { useState } from "react";
import styles from "./ScreenshotGallery.module.css";

interface ScreenshotItem {
  src: string;
  alt: string;
}

interface ScreenshotGalleryProps {
  items: ScreenshotItem[];
}

export default function ScreenshotGallery({ items }: ScreenshotGalleryProps) {
  const [active, setActive] = useState<ScreenshotItem | null>(null);

  return (
    <div>
      <div className={styles.grid}>
        {items.map((item) => (
          <button
            key={item.src}
            type="button"
            className={styles.thumb}
            onClick={() => setActive(item)}
          >
            <img src={item.src} alt={item.alt} />
          </button>
        ))}
      </div>

      {active ? (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <button className={styles.close} onClick={() => setActive(null)} aria-label="Close screenshot">
              Close
            </button>
            <img src={active.src} alt={active.alt} className={styles.full} />
            <p className={styles.caption}>{active.alt}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
