#!/usr/bin/env bash
set -euo pipefail

API_BASE=${KT_AI_API_BASE:-http://localhost:8000}
OWNER=${KT_AI_REPO_OWNER:-""}
REPO=${KT_AI_REPO_NAME:-""}

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for this test" >&2
  exit 1
fi

if [[ -z "$OWNER" || -z "$REPO" ]]; then
  echo "Set KT_AI_REPO_OWNER and KT_AI_REPO_NAME before running." >&2
  exit 1
fi

echo "Listing repos..."
REPOS=$(curl -s "${API_BASE}/api/github/repos" | jq 'length')
if [[ "$REPOS" -le 0 ]]; then
  echo "No repos returned." >&2
  exit 1
fi

echo "Triggering reindex..."
curl -s -X POST "${API_BASE}/api/index/reindex" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"repo\",\"owner\":\"${OWNER}\",\"repo\":\"${REPO}\"}" | jq .

echo "Exploring..."
curl -s "${API_BASE}/api/explore" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":1,\"context\":{\"type\":\"repo\",\"owner\":\"${OWNER}\",\"repo\":\"${REPO}\"},\"question\":\"Show README summary\"}" | jq '. | {answer, sources, confidence}'
