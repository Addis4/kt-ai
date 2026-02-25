"""Seed data for KT.ai local development."""

from __future__ import annotations

from sqlalchemy.orm import Session

from apps.api.models import ChecklistItem, ConfidenceState, OnboardingSession, Project, User


def seed_db(db: Session) -> None:
    """Seed the database with a single user, project, and onboarding session."""
    if db.query(User).first():
        return

    user = User(name="Alex Rivera", role="Backend Developer", team="Payments")
    project = Project(
        key="payments-platform",
        name="Payments Platform",
        description="Core payments services, ledgering, and settlement workflows.",
    )
    session = OnboardingSession(user=user, project=project, status="active")

    checklist = [
        ChecklistItem(
            session=session,
            title="Get access to payments repos",
            description="Request read-only access to GitLab repos for the payments platform.",
            status="completed",
            order_index=1,
        ),
        ChecklistItem(
            session=session,
            title="Understand ledger event flow",
            description="Review the ledger event pipeline and idempotency strategy.",
            status="in_progress",
            order_index=2,
        ),
        ChecklistItem(
            session=session,
            title="Review incident runbooks",
            description="Read the incident response docs for payments outages.",
            status="pending",
            order_index=3,
        ),
        ChecklistItem(
            session=session,
            title="Shadow settlement workflow",
            description="Pair with a teammate to observe settlement batch execution.",
            status="pending",
            order_index=4,
        ),
    ]

    confidence = ConfidenceState(
        session=session,
        level="medium",
        rationale="Core access is complete; platform flow knowledge is in progress.",
    )

    db.add_all([user, project, session, *checklist, confidence])
    db.commit()
