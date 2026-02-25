"""Simple JSON session store for buddy chat."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

STORE_PATH = Path("memory/sessions/chat_sessions.json")


def load_sessions() -> Dict[str, List[Dict[str, Any]]]:
    if STORE_PATH.exists():
        return json.loads(STORE_PATH.read_text())
    return {}


def save_sessions(sessions: Dict[str, List[Dict[str, Any]]]) -> None:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STORE_PATH.write_text(json.dumps(sessions, indent=2))


def append_message(session_id: str, role: str, content: str) -> List[Dict[str, Any]]:
    sessions = load_sessions()
    history = sessions.get(session_id, [])
    history.append({"role": role, "content": content})
    sessions[session_id] = history
    save_sessions(sessions)
    return history
