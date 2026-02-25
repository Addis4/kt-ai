"""Repository ingestion utilities for KT.ai knowledge mapping."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable, List


@dataclass
class IngestedDocument:
    """Normalized document for indexing."""

    path: str
    text: str
    metadata: dict


def is_binary(text: str) -> bool:
    """Detect binary content based on null bytes."""
    return "\x00" in text


def normalize_text(text: str) -> str:
    """Normalize text by removing excessive whitespace and placeholders."""
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[redacted-email]", text, flags=re.IGNORECASE)
    text = re.sub(r"\b\d{3}[-.\s]?\d{2,3}[-.\s]?\d{4}\b", "[redacted-phone]", text)
    text = re.sub(r"\b(SECRET|TOKEN|PASSWORD)\b", "[redacted-secret]", text, flags=re.IGNORECASE)
    return text.strip()


def chunk_text(text: str, chunk_size: int = 700, overlap: int = 120) -> List[str]:
    """Chunk text into overlapping word-based windows."""
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    while start < len(words):
        end = min(len(words), start + chunk_size)
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end == len(words):
            break
        start = max(0, end - overlap)
    return chunks


def filter_paths(paths: Iterable[str]) -> List[str]:
    """Filter repo paths for documentation and key code sources."""
    allowed = []
    for path in paths:
        lower = path.lower()
        if "node_modules" in lower or "dist/" in lower or "build/" in lower:
            continue
        if lower.endswith(".md") or lower.endswith(".mdx"):
            allowed.append(path)
            continue
        if lower.startswith("docs/"):
            allowed.append(path)
            continue
        if lower.startswith("src/") and lower.endswith((".py", ".java", ".js", ".ts", ".tsx")):
            allowed.append(path)
            continue
    return allowed
