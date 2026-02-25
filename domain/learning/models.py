"""Domain models for learning blueprints and checklists."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class LearningChecklistItem:
    """Represents a learning checklist step."""

    title: str
    description: str
    status: str


@dataclass
class LearningBlueprint:
    """Role-based onboarding blueprint."""

    role: str
    items: List[LearningChecklistItem]
