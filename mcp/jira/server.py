"""Jira MCP server (read-only)."""

from __future__ import annotations

from typing import Any, Dict, List

from apps.api.config import CONFIG
from mcp.jira.jira_client import JiraClient


class JiraMCPServer:
    """Provides declarative, read-only Jira tools."""

    def __init__(self) -> None:
        self._client = JiraClient(CONFIG.jira_base_url, CONFIG.jira_token)

    def handle(self, tool_name: str, payload: Dict[str, Any]) -> Any:
        """Handle MCP tool requests."""
        if tool_name == "list_issues":
            return self.list_issues(payload.get("project_key"))
        if tool_name == "get_issue":
            return self.get_issue(payload.get("issue_key"))
        if tool_name == "search_issues":
            return self.search_issues(payload.get("query"))
        raise ValueError(f"Unknown Jira tool: {tool_name}")

    def list_issues(self, project_key: str | None) -> List[Dict[str, Any]]:
        """Return issues for a Jira project."""
        if not project_key:
            return []
        return self._client.list_issues(project_key)

    def get_issue(self, issue_key: str | None) -> Dict[str, Any]:
        """Return a Jira issue."""
        if not issue_key:
            return {}
        return self._client.get_issue(issue_key)

    def search_issues(self, query: str | None) -> List[Dict[str, Any]]:
        """Search Jira issues by JQL."""
        if not query:
            return []
        return self._client.search_issues(query)
