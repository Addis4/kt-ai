"""Application configuration loaded from environment variables."""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

try:
    from apps.api import config_demo
except Exception:
    config_demo = None

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)


@dataclass(frozen=True)
class AppConfig:
    """Configuration for KT.ai services."""

    github_token: str | None
    openai_api_key: str | None
    llm_backend: str
    local_llm_path: str | None
    embedding_backend: str
    embedding_model: str
    openai_chat_model: str
    openai_embedding_model: str
    index_root: str
    jira_base_url: str | None
    confluence_base_url: str | None
    jira_token: str | None
    confluence_token: str | None


def _env_or_demo(key: str, default: str | None = None) -> str | None:
    value = os.getenv(key, default)
    if value:
        return value
    if config_demo and os.getenv("DEMO_MODE", "false").lower() == "true":
        return getattr(config_demo, key, default)
    return default


CONFIG = AppConfig(
    github_token=_env_or_demo("GITHUB_TOKEN"),
    openai_api_key=_env_or_demo("OPENAI_API_KEY"),
    llm_backend=_env_or_demo("LLM_BACKEND", "local"),
    local_llm_path=_env_or_demo("LOCAL_LLM_PATH"),
    embedding_backend=_env_or_demo("EMBEDDING_BACKEND", "local"),
    embedding_model=os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"),
    openai_chat_model=os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini"),
    openai_embedding_model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
    index_root=os.getenv("INDEX_ROOT", "indexes"),
    jira_base_url=_env_or_demo("JIRA_BASE_URL"),
    confluence_base_url=_env_or_demo("CONFLUENCE_BASE_URL"),
    jira_token=_env_or_demo("JIRA_TOKEN"),
    confluence_token=_env_or_demo("CONFLUENCE_TOKEN"),
)
