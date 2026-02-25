"use client";

import { useState } from "react";
import { exploreKnowledge } from "../lib/api";

export default function ExplorationPage() {
  const [context, setContext] = useState("repo");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    const response = await exploreKnowledge(question, context);
    setAnswer(response);
  };

  return (
    <div className="container">
      <h1>Exploration</h1>
      <div className="grid-2">
        <div className="card">
          <h2>Context Selectors</h2>
          <label className="small">Knowledge Source</label>
          <select value={context} onChange={(event) => setContext(event.target.value)}>
            <option value="repo">Repo</option>
            <option value="jira">Jira</option>
            <option value="docs">Docs</option>
          </select>
          <label className="small" style={{ marginTop: 12 }}>
            Ask a question
          </label>
          <textarea
            rows={4}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="How does settlement batching work?"
          />
          <button className="button" style={{ marginTop: 12 }} onClick={handleAsk}>
            Ask KT.ai
          </button>
        </div>

        <div className="card">
          <h2>Chat Interface</h2>
          {answer ? (
            <div className="list">
              <p>{answer.answer}</p>
              <div className="small">Sources: {answer.sources.join(", ")}</div>
            </div>
          ) : (
            <p className="small">Ask a question to explore knowledge sources.</p>
          )}
        </div>
      </div>
    </div>
  );
}
