"use client";

import { useEffect, useState } from "react";
import ChecklistChat from "../components/ChecklistChat";
import { explainChecklistItem, fetchLearningPath } from "../lib/api";

export default function LearningPathPage() {
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [explanation, setExplanation] = useState(null);

  useEffect(() => {
    fetchLearningPath().then(setData).catch(() => {});
  }, []);

  const handleExplain = async (item) => {
    setSelectedItem(item);
    setExplanation(null);
    const response = await explainChecklistItem(item.id);
    setExplanation(response.explanation);
  };

  return (
    <div className="container">
      <h1>Learning Path</h1>
      <div className="grid-3">
        <div className="card">
          <h2>Role-Based Playbook</h2>
          {data ? (
            <div className="list">
              <div>
                <strong>Role:</strong> {data.role}
              </div>
              <div>
                <strong>Confidence:</strong> {data.confidence_level}
              </div>
              <p>{data.confidence_rationale}</p>
              <p className="small">
                Next recommended step: {data.next_step || "All steps complete"}
              </p>
            </div>
          ) : (
            <p className="small">Loading learning path...</p>
          )}
        </div>

        <div className="card">
          <h2>Integration Checklist</h2>
          {data ? (
            <div className="list">
              {data.items.map((item) => (
                <div key={item.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{item.title}</strong>
                    <span className="badge">{item.status}</span>
                  </div>
                  <p className="small">{item.description}</p>
                  <button className="button secondary" onClick={() => handleExplain(item)}>
                    Explain
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="small">Loading checklist items...</p>
          )}
        </div>

        <div className="container">
          <div className="card">
            <h2>Context Panel</h2>
            {selectedItem ? (
              <div className="list">
                <div>
                  <strong>Selected:</strong> {selectedItem.title}
                </div>
                <p className="small">{explanation || "Fetching explanation..."}</p>
              </div>
            ) : (
              <p className="small">Select a checklist item to see details.</p>
            )}
          </div>
          {selectedItem ? <ChecklistChat title={selectedItem.title} /> : null}
        </div>
      </div>
    </div>
  );
}
