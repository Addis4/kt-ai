"""Learning path agent for checklist guidance and confidence inference."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Optional


@dataclass
class ChecklistView:
    """Checklist projection used by the learning path agent."""

    id: int
    title: str
    description: str
    status: str
    order_index: int


class LearningPathAgent:
    """Handles checklist recommendations and explanations."""

    def recommend_next_step(self, items: Iterable[ChecklistView]) -> Optional[str]:
        """Return the next checklist item title needing attention."""
        for item in sorted(items, key=lambda x: x.order_index):
            if item.status in {"pending", "in_progress"}:
                return item.title
        return None

    def infer_confidence(self, items: Iterable[ChecklistView]) -> tuple[str, str]:
        """Infer confidence level based on checklist completion rate."""
        items_list = list(items)
        total = len(items_list) or 1
        completed = len([item for item in items_list if item.status == "completed"])
        ratio = completed / total

        if ratio < 0.34:
            return "low", "Early in onboarding; several foundations remain."
        if ratio < 0.67:
            return "medium", "Core access and context are partially established."
        return "high", "Most onboarding milestones are complete."

    def explain_item(self, item: ChecklistView) -> str:
        """Generate a human-friendly explanation for a checklist item."""
        return (
            f"{item.title}: {item.description} "
            "Complete this to build practical confidence before moving on."
        )

    def generate_checklist(self, role: str) -> List[ChecklistView]:
        """Return a default checklist for a given role."""
        base_items = [
            ChecklistView(
                id=0,
                title="Review service topology",
                description="Map core services and ownership boundaries.",
                status="pending",
                order_index=1,
            ),
            ChecklistView(
                id=0,
                title="Trace a payments flow",
                description="Follow a payment from API to ledger entry.",
                status="pending",
                order_index=2,
            ),
        ]
        if role.lower().startswith("backend"):
            base_items.append(
                ChecklistView(
                    id=0,
                    title="Read database migration strategy",
                    description="Understand how schema changes are deployed safely.",
                    status="pending",
                    order_index=3,
                )
            )
        return base_items
