"""GitHub MCP server (read-only)."""

from __future__ import annotations

from typing import Any, Dict

from apps.api.config import CONFIG
from mcp.github.github_client import GitHubClient


class GitHubMCPServer:
    """Declarative GitHub MCP tools."""

    def __init__(self) -> None:
        self.client = GitHubClient(CONFIG.github_token)

    def handle(self, tool_name: str, payload: Dict[str, Any]) -> Any:
        if tool_name == "list_repos":
            return self.list_repos(payload.get("owner"), payload.get("type", "all"))
        if tool_name == "get_repo_structure":
            return self.get_repo_structure(
                payload["owner"],
                payload["repo"],
                payload.get("ref"),
                payload.get("path", ""),
            )
        if tool_name == "get_file_content":
            return self.get_file_content(
                payload["owner"],
                payload["repo"],
                payload["path"],
                payload.get("ref"),
            )
        if tool_name == "get_file_at_commit":
            return self.get_file_at_commit(
                payload["owner"],
                payload["repo"],
                payload["path"],
                payload["commit_id"],
            )
        raise ValueError(f"Unknown GitHub tool: {tool_name}")

    def list_repos(self, owner: str | None = None, repo_type: str = "all") -> Any:
        return self.client.list_repos(owner=owner, repo_type=repo_type)

    def get_repo_structure(self, owner: str, repo: str, ref: str | None, path: str) -> Any:
        return self.client.get_repo_structure(owner=owner, repo=repo, ref=ref, path=path)

    def get_file_content(self, owner: str, repo: str, path: str, ref: str | None) -> Any:
        return self.client.get_file_content(owner=owner, repo=repo, path=path, ref=ref)

    def get_file_at_commit(self, owner: str, repo: str, path: str, commit_id: str) -> Any:
        return self.client.get_file_at_commit(owner=owner, repo=repo, path=path, commit_id=commit_id)
