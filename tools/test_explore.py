"""Smoke test for KT.ai repository exploration endpoint."""

from __future__ import annotations

import os

import requests

API_BASE = os.getenv("KT_AI_API_BASE", "http://localhost:8000")


def main() -> None:
    index_payload = {"type": "repo", "owner": "openai", "repo": "openai-python"}
    requests.post(f"{API_BASE}/api/index/reindex", json=index_payload, timeout=300).raise_for_status()

    payload = {
        "session_id": 1,
        "context": {
            "type": "repo",
            "owner": "openai",
            "repo": "openai-python",
            "commit_id": "HEAD",
        },
        "question": "Show me where the client is initialized and how to verify it.",
    }
    response = requests.post(f"{API_BASE}/api/explore", json=payload, timeout=60)
    response.raise_for_status()
    data = response.json()
    print("Answer:\n", data.get("answer"))
    print("Confidence:", data.get("confidence"))
    print("Sources:")
    for source in data.get("sources", []):
        print(f"- {source.get('path')} ({source.get('url')})")


if __name__ == "__main__":
    main()
