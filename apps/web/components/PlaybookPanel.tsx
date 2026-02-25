import { ChevronDown, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import styles from "./PlaybookPanel.module.css";

export interface PlaybookSection {
  id: string;
  title: string;
  expanded: boolean;
  items: Array<{
    id: string;
    title: string;
    status: "completed" | "in-progress" | "pending";
  }>;
}

interface PlaybookPanelProps {
  role: string;
  sections: PlaybookSection[];
  expandedSection: string;
  onToggle: (sectionId: string) => void;
}

export default function PlaybookPanel({ role, sections, expandedSection, onToggle }: PlaybookPanelProps) {
  return (
    <section className={styles.panel} aria-label="Role playbook">
      <div className={styles.header}>
        <h2>{role} Playbook</h2>
      </div>
      <div className={styles.content}>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <button
              type="button"
              className={styles.sectionToggle}
              onClick={() => onToggle(section.id)}
            >
              <span>{section.title}</span>
              {expandedSection === section.id ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {expandedSection === section.id && (
              <div className={styles.sectionItems}>
                {section.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    {item.status === "completed" ? (
                      <CheckCircle2 size={16} className={styles.completed} />
                    ) : item.status === "in-progress" ? (
                      <Circle size={16} className={styles.inProgress} />
                    ) : (
                      <Circle size={16} className={styles.pending} />
                    )}
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
