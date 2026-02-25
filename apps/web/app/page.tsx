"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, GraduationCap, Search, AlertCircle } from "lucide-react";
import styles from "./page.module.css";
import { fetchHome, fetchTracker, HomeResponse, TrackerResponse } from "./lib/api";

export default function HomePage() {
  const [home, setHome] = useState<HomeResponse | null>(null);
  const [tracker, setTracker] = useState<TrackerResponse | null>(null);

  useEffect(() => {
    fetchHome().then(setHome).catch(() => {});
    fetchTracker().then(setTracker).catch(() => {});
  }, []);

  const pendingRequests = tracker?.requests.filter((req) => req.status !== "Approved") ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Welcome back, {home?.user.name ?? "Developer"}</h1>
        <p>
          {home?.user.role ?? "Backend Developer"} · {home?.project.name ?? "Payments Platform"}
        </p>
      </div>

      <div className={styles.actions}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <GraduationCap size={24} />
          </div>
          <div className={styles.cardBody}>
            <h3>Continue Learning Path</h3>
            <p>Step 3 of 7 – Architecture & APIs</p>
            <a className={styles.primaryButton} href="/learning-path">
              Continue Learning
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <div className={`${styles.cardIcon} ${styles.infoIcon}`}>
            <Search size={24} />
          </div>
          <div className={styles.cardBody}>
            <h3>Explore Project Knowledge</h3>
            <p>Repos · Jira · Docs</p>
            <a className={styles.secondaryButton} href="/exploration">
              Start Exploring
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Access & Setup Status</h3>
          <a href="/tracker">View Tracker →</a>
        </div>
        <div className={styles.statusList}>
          <div className={styles.statusRow}>
            <AlertCircle size={18} className={styles.warning} />
            <div>
              <strong>{pendingRequests.length || 0} Access Pending</strong>
              <p>{pendingRequests[0]?.system ?? "IAM Role awaiting approval"}</p>
            </div>
          </div>
          <div className={styles.statusRow}>
            <CheckCircle2 size={18} className={styles.success} />
            <div>
              <strong>All repos accessible</strong>
              <p>Code access configured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
