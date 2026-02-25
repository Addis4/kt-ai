"""Confluence MCP server (read-only)."""

from __future__ import annotations

from typing import Any, Dict, List

from apps.api.config import CONFIG
from mcp.confluence.confluence_client import ConfluenceClient


class ConfluenceMCPServer:
    """Provides declarative, read-only Confluence tools."""

    def __init__(self) -> None:
        self._client = ConfluenceClient(CONFIG.confluence_base_url, CONFIG.confluence_token)

    def handle(self, tool_name: str, payload: Dict[str, Any]) -> Any:
        """Handle MCP tool requests."""
        if tool_name == "list_pages":
            return self.list_pages(payload.get("space_key"))
        if tool_name == "get_page_content":
            return self.get_page_content(payload.get("page_id"))
        raise ValueError(f"Unknown Confluence tool: {tool_name}")

    def list_pages(self, space_key: str | None) -> List[Dict[str, Any]]:
        """Return pages in a Confluence space."""
        if not space_key:
            return []
        return self._client.list_pages(space_key)

    def get_page_content(self, page_id: str | None) -> Dict[str, Any]:
        """Return a Confluence page."""
        if not page_id:
            return {}
        return self._client.get_page_content(page_id)
