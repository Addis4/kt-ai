"""Domain models for user profile and context."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class UserProfile:
    """Basic user profile for onboarding context."""

    name: str
    role: str
    team: str
