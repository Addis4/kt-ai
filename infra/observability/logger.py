"""Simple JSONL audit logger for KT.ai queries."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict

LOG_PATH = Path(__file__).resolve().parent / "query_logs.jsonl"


def log_event(event: Dict[str, Any]) -> None:
    """Append an event to the audit log."""
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    enriched = {"timestamp": datetime.utcnow().isoformat(), **event}
    with LOG_PATH.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(enriched) + "\n")
