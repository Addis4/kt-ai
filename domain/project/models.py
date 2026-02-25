"""Domain models for project knowledge mapping."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass
class ProjectKnowledgeMap:
    """High-level view of project knowledge sources."""

    repos: List[str]
    workflows: List[str]
    docs: List[str]
