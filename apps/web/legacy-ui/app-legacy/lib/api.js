const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json();
}

export function fetchHome() {
  return request("/api/home");
}

export function fetchLearningPath() {
  return request("/api/learning-path");
}

export function explainChecklistItem(itemId) {
  return request("/api/learning-path/explain", {
    method: "POST",
    body: JSON.stringify({ item_id: itemId })
  });
}

export function exploreKnowledge(question, context) {
  return request("/api/explore", {
    method: "POST",
    body: JSON.stringify({ question, context })
  });
}

export function fetchTracker() {
  return request("/api/tracker");
}
