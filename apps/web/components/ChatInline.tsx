"use client";

import { Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import styles from "./ChatInline.module.css";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
}

interface ChatInlineProps {
  title: string;
  initialMessages?: ChatMessage[];
  onSend?: (message: string) => Promise<string | null>;
}

export default function ChatInline({ title, initialMessages = [], onSend }: ChatInlineProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;

    const content = draft.trim();
    const newMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, newMessage]);
    setDraft("");

    if (onSend) {
      const reply = await onSend(content);
      if (reply) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "agent", content: reply }]);
      }
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        <span className={styles.title}>Ask about: {title}</span>
      </div>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.sparkle}>
              <Sparkles size={18} />
            </div>
            <p>Ask a question and KT.ai will respond with guided context.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={message.role === "user" ? styles.userBubble : styles.agentBubble}
            >
              {message.content}
            </div>
          ))
        )}
      </div>
      <form className={styles.inputRow} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask a follow-up question..."
          aria-label="Ask KT.ai"
        />
        <button className={styles.send} type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
