import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ExternalLink,
  FileText,
  GitBranch,
  MessageSquare,
  Sparkles,
  Target,
  Video
} from "lucide-react";
import styles from "./ChecklistPanel.module.css";
import ScreenshotGallery from "./ScreenshotGallery";

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface ChecklistPanelProps {
  sections: ChecklistSection[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAskAgent: () => void;
}

const screenshots = [
  { src: "/screenshots/architecture-map.svg", alt: "Architecture map preview" },
  { src: "/screenshots/service-diagram.svg", alt: "Service diagram preview" },
  { src: "/screenshots/flow-overview.svg", alt: "Flow overview preview" }
];

export default function ChecklistPanel({ sections, selectedId, onSelect, onAskAgent }: ChecklistPanelProps) {
  const total = sections.reduce((sum, section) => sum + section.items.length, 0) || 1;
  const completed = sections.reduce(
    (sum, section) => sum + section.items.filter((item) => item.status === "completed").length,
    0
  );
  const progress = Math.round((completed / total) * 100);

  return (
    <section className={styles.panel} aria-label="Project integration checklist">
      <div className={styles.header}>
        <h2>Project Integration Checklist</h2>
        <div className={styles.progressRow}>
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.progressBar}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.content}>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <h3>{section.title}</h3>
            <div className={styles.sectionItems}>
              {section.items.map((item) => {
                const expanded = selectedId === item.id;
                return (
                  <div key={item.id} className={styles.itemWrap}>
                    <button
                      type="button"
                      className={`${styles.item} ${expanded ? styles.itemActive : ""}`}
                      onClick={() => onSelect(expanded ? -1 : item.id)}
                    >
                      {item.status === "completed" ? (
                        <CheckCircle2 size={18} className={styles.completed} />
                      ) : item.status === "in_progress" ? (
                        <Circle size={18} className={styles.inProgress} />
                      ) : (
                        <Circle size={18} className={styles.pending} />
                      )}
                      <span>{item.title}</span>
                      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {expanded ? (
                      <div className={styles.expanded}>
                        <div className={styles.expandedSection}>
                          <div className={styles.expandedTitle}>
                            <Target size={16} />
                            <h4>Goal</h4>
                          </div>
                          <p>{item.description}</p>
                        </div>
                        <div className={styles.expandedSection}>
                          <div className={styles.expandedTitle}>
                            <Sparkles size={16} />
                            <h4>Why This Matters</h4>
                          </div>
                          <p>
                            Completing this step builds confidence in system ownership and helps you act
                            independently within the payments platform.
                          </p>
                        </div>
                        <div className={styles.expandedSection}>
                          <h4>Resources</h4>
                          <div className={styles.resourceList}>
                            <a href="#" className={styles.resourceItem}>
                              <GitBranch size={16} />
                              payments-api repo
                              <ExternalLink size={12} />
                            </a>
                            <a href="#" className={styles.resourceItem}>
                              <FileText size={16} />
                              Architecture documentation
                              <ExternalLink size={12} />
                            </a>
                            <a href="#" className={styles.resourceItem}>
                              <FileText size={16} />
                              Service diagram
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                        <div className={styles.expandedSection}>
                          <h4>Preview Screenshots</h4>
                          <ScreenshotGallery items={screenshots} />
                        </div>
                        <div className={styles.actions}>
                          <button type="button" className={styles.secondaryButton} onClick={onAskAgent}>
                            <MessageSquare size={16} />
                            Ask Agent
                          </button>
                          <button type="button" className={styles.secondaryButton}>
                            <GitBranch size={16} />
                            Open Repo
                          </button>
                          <button type="button" className={styles.secondaryButton}>
                            <Video size={16} />
                            Watch Video
                          </button>
                        </div>
                        <button type="button" className={styles.primaryButton}>
                          Mark as Understood
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
