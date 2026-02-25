"""Agent IO schemas for KT.ai orchestration."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass
class IntentRequest:
    """Intent routing request."""

    intent: str
    session_id: int


@dataclass
class AgentResponse:
    """Generic agent response."""

    content: str
    metadata: Dict[str, str]
