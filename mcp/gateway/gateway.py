"""MCP gateway abstraction to route tool calls to MCP servers."""

from __future__ import annotations

from typing import Any, Dict


class MCPGateway:
    """Routes declarative, read-only tool calls to MCP servers."""

    def __init__(self) -> None:
        self._servers: Dict[str, Any] = {}

    def register_server(self, name: str, server: Any) -> None:
        """Register an MCP server by name."""
        self._servers[name] = server

    def request(self, server_name: str, tool_name: str, payload: Dict[str, Any]) -> Any:
        """Invoke a tool on a named server via the gateway."""
        if server_name not in self._servers:
            raise ValueError(f"Unknown MCP server: {server_name}")
        return self._servers[server_name].handle(tool_name, payload)
