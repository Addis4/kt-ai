"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, FileText, GitBranch, Send, Sparkles } from "lucide-react";
import styles from "./page.module.css";
import { explore, generateDoc, listGithubRepos, GitHubRepo } from "../lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  sources?: string[];
  followups?: string[];
  downloadUrl?: string;
}

export default function ExplorationPage() {
  const [context, setContext] = useState("repo");
  const [question, setQuestion] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [commitId, setCommitId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [reposError, setReposError] = useState<string | null>(null);
  const [reposLoading, setReposLoading] = useState(false);
  const sessionId = 1;

  useEffect(() => {
    let isMounted = true;
    setReposLoading(true);
    listGithubRepos()
      .then((data) => {
        if (isMounted) {
          setRepos(data);
          setReposError(null);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setReposError(error.message || "Failed to load repositories.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setReposLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAsk = async () => {
    if (!question.trim() || !owner.trim() || !repo.trim()) return;
    const content = question.trim();
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    const response = await explore(content, { type: context, owner, repo, commit_id: commitId || undefined }, sessionId);
    const agentMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "agent",
      content: response.answer,
      sources: response.sources.map((source) => source.url || `${source.id}/${source.path}`),
      followups: response.followups
    };
    setMessages((prev) => [...prev, agentMessage]);
  };

  const handleGenerate = async (message: ChatMessage, format: "docx" | "pptx") => {
    const title = format === "pptx" ? "KTai_Slides" : "KTai_Notes";
    const result = await generateDoc({
      session_id: String(sessionId),
      title,
      prompt: message.content,
      format
    });
    setMessages((prev) =>
      prev.map((item) => (item.id === message.id ? { ...item, downloadUrl: result.url } : item))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Exploration</h1>
      </div>

      <div className={styles.selectors}>
        <button
          className={styles.selectorButton}
          onClick={() => {
            setContext("repo");
            setRepo("");
          }}
          aria-pressed={context === "repo"}
        >
          <GitBranch size={16} />
          Repository
          <ChevronDown size={14} />
        </button>
        <button
          className={styles.selectorButton}
          onClick={() => {
            setContext("jira");
            setRepo("jira");
          }}
          aria-pressed={context === "jira"}
        >
          <FileText size={16} />
          Jira Project
          <ChevronDown size={14} />
        </button>
        <button
          className={styles.selectorButton}
          onClick={() => {
            setContext("confluence");
            setRepo("confluence");
          }}
          aria-pressed={context === "confluence"}
        >
          <FileText size={16} />
          Documentation
          <ChevronDown size={14} />
        </button>
      </div>

      <div className={styles.repoList}>
        <div className={styles.repoListHeader}>
          <h2>GitHub Repositories</h2>
          {reposLoading ? <span>Loading...</span> : null}
        </div>
        {reposError ? <p className={styles.repoError}>{reposError}</p> : null}
        {!reposLoading && !reposError && repos.length === 0 ? (
          <p className={styles.repoError}>No repositories found. Check your token or permissions.</p>
        ) : null}
        <div className={styles.repoItems}>
          {repos.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.repoItem}
              onClick={() => {
                const [repoOwner, repoName] = item.full_name.split("/");
                setOwner(repoOwner);
                setRepo(repoName);
                setContext("repo");
              }}
            >
              <div>
                <strong>{item.full_name}</strong>
                <p>{item.description || "No description provided."}</p>
              </div>
              <ExternalLink size={14} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.repoInputs}>
        <div className={styles.inputGroup}>
          <label htmlFor="repo-owner">{context === "repo" ? "Owner" : "Project/Space Key"}</label>
          <input
            id="repo-owner"
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder={context === "repo" ? "github-org" : "PROJECT_KEY"}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="repo-name">{context === "repo" ? "Repo" : "Source"}</label>
          <input
            id="repo-name"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
            placeholder={context === "repo" ? "repo-name" : context}
          />
        </div>
        {context === "repo" ? (
          <div className={styles.inputGroup}>
            <label htmlFor="repo-commit">Commit (optional)</label>
            <input
              id="repo-commit"
              value={commitId}
              onChange={(event) => setCommitId(event.target.value)}
              placeholder="commit sha"
            />
          </div>
        ) : null}
      </div>

      <div className={styles.chatCard}>
        <div className={styles.chatContent}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Sparkles size={28} />
              </div>
              <h3>Ask anything about the selected context</h3>
              <p>
                I can help you understand code patterns, explain architecture decisions, or find specific implementations.
              </p>
            </div>
          ) : (
            <div className={styles.messageList}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? styles.userMessage : styles.agentMessage}
                >
                  <p>{message.content}</p>
                  {message.sources && message.sources.length > 0 ? (
                    <div className={styles.sources}>
                      <span>SOURCES</span>
                      {message.sources.map((source) => (
                        <a key={source} href={source} className={styles.sourceLink} target="_blank" rel="noreferrer">
                          <ExternalLink size={12} />
                          {source}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {message.followups && message.followups.length > 0 ? (
                    <div className={styles.followups}>
                      {message.followups.map((followup) => (
                        <button key={followup} type="button" onClick={() => setQuestion(followup)}>
                          {followup}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {message.role === "agent" ? (
                    <div className={styles.actions}>
                      <button type="button" onClick={() => handleGenerate(message, "docx")}>
                        Generate Doc
                      </button>
                      <button type="button" onClick={() => handleGenerate(message, "pptx")}>
                        Generate PPTX
                      </button>
                      {message.downloadUrl ? (
                        <a className={styles.downloadLink} href={message.downloadUrl}>
                          Download
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.inputRow}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything about payments-api, PAYMENTS Jira, or architecture docs..."
            aria-label="Ask a question"
          />
          <button className={styles.send} onClick={handleAsk} aria-label="Send question">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
