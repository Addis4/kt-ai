"""Jira REST client for read-only issue access."""

from __future__ import annotations

import time
from typing import Any, Dict, List, Optional

import requests


class JiraClient:
    """Minimal Jira REST client with retry/backoff."""

    def __init__(self, base_url: str | None, token: str | None) -> None:
        self.base_url = base_url.rstrip("/") if base_url else None
        self.session = requests.Session()
        if token:
            self.session.headers.update({"Authorization": f"Bearer {token}"})
        self.session.headers.update({"Accept": "application/json"})

    def _request(self, method: str, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        if not self.base_url:
            return []
        url = f"{self.base_url}{path}"
        for attempt in range(3):
            response = self.session.request(method, url, params=params, timeout=20)
            if response.status_code in {429, 500, 502, 503, 504} and attempt < 2:
                time.sleep(1.5 * (attempt + 1))
                continue
            response.raise_for_status()
            return response.json()
        response.raise_for_status()

    def list_issues(self, project_key: str) -> List[Dict[str, Any]]:
        data = self._request(
            "GET",
            "/rest/api/3/search",
            params={"jql": f"project={project_key}", "maxResults": 50},
        )
        issues = data.get("issues", []) if isinstance(data, dict) else []
        return [self._issue_to_meta(issue) for issue in issues]

    def get_issue(self, issue_key: str) -> Dict[str, Any]:
        issue = self._request("GET", f"/rest/api/3/issue/{issue_key}")
        return self._issue_to_meta(issue)

    def search_issues(self, jql: str) -> List[Dict[str, Any]]:
        data = self._request("GET", "/rest/api/3/search", params={"jql": jql, "maxResults": 50})
        issues = data.get("issues", []) if isinstance(data, dict) else []
        return [self._issue_to_meta(issue) for issue in issues]

    def _issue_to_meta(self, issue: Dict[str, Any]) -> Dict[str, Any]:
        fields = issue.get("fields", {}) if isinstance(issue, dict) else {}
        return {
            "key": issue.get("key"),
            "summary": fields.get("summary"),
            "description": fields.get("description"),
            "url": f"{self.base_url}/browse/{issue.get('key')}" if self.base_url else None,
        }
