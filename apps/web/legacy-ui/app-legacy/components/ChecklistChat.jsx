"use client";

import { useState } from "react";

export default function ChecklistChat({ title }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input.trim() }]);
    setInput("");
  };

  return (
    <div className="card">
      <h3>Checklist Chat</h3>
      <p className="small">Context: {title}</p>
      <div className="list">
        {messages.length === 0 ? (
          <p className="small">Ask questions tied to this checklist item.</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.role === "user" ? "You" : "KT.ai"}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          className="input"
          placeholder="Type your question"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
