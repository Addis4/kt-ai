"""Mock GitLab MCP server (read-only)."""

from __future__ import annotations

from typing import Any, Dict, List


class GitlabMCPServer:
    """Provides declarative, read-only GitLab tools."""

    def __init__(self) -> None:
        self._repos = [
            "payments-platform/api",
            "payments-platform/ledger",
            "payments-platform/settlement",
        ]
        self._structures = {
            "payments-platform/api": ["/src", "/docs", "/deploy"],
            "payments-platform/ledger": ["/services", "/migrations", "/docs"],
            "payments-platform/settlement": ["/batch", "/infra", "/docs"],
        }

    def handle(self, tool_name: str, payload: Dict[str, Any]) -> Any:
        """Handle MCP tool requests."""
        if tool_name == "list_repos":
            return self.list_repos()
        if tool_name == "get_repo_structure":
            return self.get_repo_structure(payload.get("repo"))
        raise ValueError(f"Unknown GitLab tool: {tool_name}")

    def list_repos(self) -> List[str]:
        """Return available repositories."""
        return list(self._repos)

    def get_repo_structure(self, repo: str | None) -> List[str]:
        """Return the repository structure for a given repo."""
        if not repo:
            return []
        return self._structures.get(repo, [])
