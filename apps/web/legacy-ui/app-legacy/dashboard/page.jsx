"use client";

import { useEffect, useState } from "react";
import { fetchLearningPath } from "../lib/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchLearningPath().then(setData).catch(() => {});
  }, []);

  const total = data?.items?.length || 0;
  const completed = data?.items?.filter((item) => item.status === "completed").length || 0;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="grid-2">
        <div className="card">
          <h2>Progress Summary</h2>
          {data ? (
            <div className="list">
              <div>
                <strong>Checklist:</strong> {completed} / {total} completed
              </div>
              <div>
                <strong>Confidence:</strong> {data.confidence_level}
              </div>
              <p className="small">Next step: {data.next_step || "All steps complete"}</p>
            </div>
          ) : (
            <p className="small">Loading progress...</p>
          )}
        </div>
        <div className="card">
          <h2>Recent Activity</h2>
          <div className="list">
            <div>Reviewed payments platform access status</div>
            <div>Started ledger event flow walkthrough</div>
            <div>Queued settlement runbook review</div>
          </div>
        </div>
      </div>
    </div>
  );
}
