"""Orchestrator agent for intent routing and session context."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass
class SessionContext:
    """State shared across a user's onboarding session."""

    session_id: int
    user_role: str
    project_key: str


class OrchestratorAgent:
    """Routes incoming intents to the appropriate domain agent."""

    def __init__(self, session_context: SessionContext) -> None:
        self.session_context = session_context
        self._intent_map: Dict[str, str] = {
            "learning_path": "learning_path",
            "explore": "exploration",
            "tracker": "tracker",
        }

    def route_intent(self, intent: str) -> str:
        """Return the target domain agent name for a given intent."""
        return self._intent_map.get(intent, "learning_path")
