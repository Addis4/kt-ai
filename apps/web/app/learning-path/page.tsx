"use client";

import { useEffect, useMemo, useState } from "react";
import ChatInline from "../../components/ChatInline";
import ChecklistPanel, { ChecklistSection } from "../../components/ChecklistPanel";
import ContextPanel from "../../components/ContextPanel";
import PlaybookPanel, { PlaybookSection } from "../../components/PlaybookPanel";
import styles from "./page.module.css";
import { fetchLearningPath, LearningPathResponse } from "../lib/api";

export default function LearningPathPage() {
  const [data, setData] = useState<LearningPathResponse | null>(null);
  const [expandedSection, setExpandedSection] = useState("core");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchLearningPath().then(setData).catch(() => {});
  }, []);

  const playbookSections: PlaybookSection[] = useMemo(() => {
    return [
      {
        id: "core",
        title: "CORE",
        expanded: true,
        items: [
          { id: "project-purpose", title: "Project Purpose", status: "completed" },
          { id: "system-architecture", title: "System Architecture", status: "completed" },
          { id: "service-responsibilities", title: "Service Responsibilities", status: "in-progress" },
          { id: "data-flow", title: "Data Flow & Patterns", status: "pending" }
        ]
      },
      {
        id: "advanced",
        title: "ADVANCED",
        expanded: false,
        items: [
          { id: "performance", title: "Performance Optimization", status: "pending" },
          { id: "monitoring", title: "Monitoring & Alerts", status: "pending" }
        ]
      },
      {
        id: "optional",
        title: "OPTIONAL",
        expanded: false,
        items: [
          { id: "testing", title: "Testing Strategies", status: "pending" },
          { id: "deployment", title: "Deployment Process", status: "pending" }
        ]
      }
    ];
  }, []);

  const checklistSections: ChecklistSection[] = useMemo(() => {
    if (!data) {
      return [];
    }
    const buckets = ["FOUNDATION", "CODE", "BUSINESS", "OPERATIONS"];
    const perBucket = Math.max(1, Math.ceil(data.items.length / buckets.length));
    return buckets.map((title, index) => {
      const start = index * perBucket;
      const items = data.items.slice(start, start + perBucket);
      return {
        id: title.toLowerCase(),
        title,
        items
      };
    });
  }, [data]);

  return (
    <div className={styles.layout}>
      <PlaybookPanel
        role={data?.role ?? "Backend Developer"}
        sections={playbookSections}
        expandedSection={expandedSection}
        onToggle={(sectionId) => setExpandedSection(expandedSection === sectionId ? "" : sectionId)}
      />
      <ChecklistPanel
        sections={checklistSections}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id > 0 ? id : null)}
        onAskAgent={() => setChatOpen(true)}
      />
      <ContextPanel
        role={data?.role ?? "Backend Developer"}
        project={"Payments Platform"}
        team={"Platform Services"}
        confidence={`${data?.confidence_level ?? "Medium"} Confidence`}
      />

      {chatOpen ? (
        <div className={styles.chatOverlay} role="dialog" aria-modal="true">
          <div className={styles.chatPanel}>
            <button className={styles.chatClose} onClick={() => setChatOpen(false)}>
              Close
            </button>
            <ChatInline
              title={data?.next_step ?? "Understand Repo Structure"}
              onSend={async () =>
                "The payments API uses a domain-driven layout with services and integrations grouped by capability."
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
