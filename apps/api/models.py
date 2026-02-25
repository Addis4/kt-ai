"""SQLAlchemy models for KT.ai."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from apps.api.db import Base


class User(Base):
    """Platform user participating in onboarding."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(100))
    team: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    sessions: Mapped[List["OnboardingSession"]] = relationship(back_populates="user")


class Project(Base):
    """Project being onboarded."""

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(100), unique=True)
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(String(500))

    sessions: Mapped[List["OnboardingSession"]] = relationship(back_populates="project")


class OnboardingSession(Base):
    """Tracks onboarding progress for a user and project."""

    __tablename__ = "onboarding_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    status: Mapped[str] = mapped_column(String(50), default="active")
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="sessions")
    project: Mapped[Project] = relationship(back_populates="sessions")
    checklist_items: Mapped[List["ChecklistItem"]] = relationship(
        back_populates="session", cascade="all, delete"
    )
    confidence_state: Mapped[Optional["ConfidenceState"]] = relationship(
        back_populates="session", uselist=False, cascade="all, delete"
    )


class ChecklistItem(Base):
    """Checklist items for onboarding tasks."""

    __tablename__ = "checklist_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("onboarding_sessions.id"))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(50), default="pending")
    order_index: Mapped[int] = mapped_column()

    session: Mapped[OnboardingSession] = relationship(back_populates="checklist_items")


class ConfidenceState(Base):
    """Confidence inference for an onboarding session."""

    __tablename__ = "confidence_states"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("onboarding_sessions.id"))
    level: Mapped[str] = mapped_column(String(20))
    rationale: Mapped[str] = mapped_column(String(300))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    session: Mapped[OnboardingSession] = relationship(back_populates="confidence_state")
