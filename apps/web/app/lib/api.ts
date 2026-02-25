export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export interface HomeResponse {
  product_name: string;
  user: { id: number; name: string; role: string; team?: string | null };
  project: { id: number; key: string; name: string; description: string };
  session_status: string;
}

export interface LearningPathResponse {
  product_name: string;
  role: string;
  items: Array<{
    id: number;
    title: string;
    description: string;
    status: "completed" | "in_progress" | "pending";
    order_index: number;
  }>;
  next_step?: string | null;
  confidence_level: string;
  confidence_rationale: string;
}

export interface TrackerResponse {
  product_name: string;
  updated_at: string;
  requests: Array<{ id: string; system: string; status: string; updated_at: string }>;
}

export interface ExploreResponse {
  answer: string;
  sources: Array<{ type: string; id: string; path: string; url: string; excerpt: string }>;
  confidence: string;
  confidence_rationale: string;
  model_used: string;
  followups: string[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string | null;
  url: string;
  default_branch?: string | null;
}

export function fetchHome() {
  return request<HomeResponse>("/api/home");
}

export function fetchLearningPath() {
  return request<LearningPathResponse>("/api/learning-path");
}

export function fetchTracker() {
  return request<TrackerResponse>("/api/tracker");
}

export function explore(
  question: string,
  context: { type: string; owner: string; repo: string; commit_id?: string },
  sessionId: number
) {
  return request<ExploreResponse>("/api/explore", {
    method: "POST",
    body: JSON.stringify({ question, context, session_id: sessionId })
  });
}

export function generateDoc(payload: { session_id: string; title: string; prompt: string; format: "docx" | "pptx" }) {
  return request<{ file_name: string; url: string }>("/api/generate-doc", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function listGithubRepos(owner?: string) {
  const query = owner ? `?owner=${encodeURIComponent(owner)}` : "";
  return request<GitHubRepo[]>(`/api/github/repos${query}`);
}
