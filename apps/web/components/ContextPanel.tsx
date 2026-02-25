import { FileText, GitBranch } from "lucide-react";
import styles from "./ContextPanel.module.css";

interface ContextPanelProps {
  role: string;
  project: string;
  team: string;
  confidence: string;
}

export default function ContextPanel({ role, project, team, confidence }: ContextPanelProps) {
  return (
    <aside className={styles.panel} aria-label="Context panel">
      <h2>Context</h2>
      <div className={styles.section}>
        <span>ROLE</span>
        <p>{role}</p>
      </div>
      <div className={styles.section}>
        <span>PROJECT</span>
        <p>{project}</p>
      </div>
      <div className={styles.section}>
        <span>TEAM</span>
        <p>{team}</p>
      </div>
      <div className={styles.sources}>
        <h3>Using Sources</h3>
        <div className={styles.sourceItem}>
          <GitBranch size={16} />
          <span>payments-api repo</span>
        </div>
        <div className={styles.sourceItem}>
          <FileText size={16} />
          <span>PAYMENTS Jira</span>
        </div>
        <div className={styles.sourceItem}>
          <FileText size={16} />
          <span>Architecture docs</span>
        </div>
      </div>
      <div className={styles.badge}>{confidence}</div>
    </aside>
  );
}
