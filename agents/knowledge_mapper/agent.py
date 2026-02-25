"""Knowledge mapping agent for building repository indexes."""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List

from agents.exploration.embeddings import get_embedding_provider
from agents.knowledge_mapper.ingest import chunk_text, filter_paths, is_binary, normalize_text
from apps.api.config import CONFIG
from domain.index_store import IndexStore
from mcp.gateway.gateway import MCPGateway


class KnowledgeMappingAgent:
    """Builds a repository knowledge index using MCP GitHub data."""

    def __init__(self, gateway: MCPGateway) -> None:
        self.gateway = gateway
        self.index_store = IndexStore(CONFIG.index_root)

    def ingest_repo(self, owner: str, repo: str, depth: int = 2) -> Dict[str, Any]:
        """Ingest and index a GitHub repository for retrieval."""
        index_key = self._index_key("repo", owner, repo)
        file_paths = self._discover_paths(owner, repo, depth=depth)
        documents = self._fetch_documents(owner, repo, file_paths)
        chunks, metadata = self._build_chunks(documents, source_type="repo")

        embedding_provider = get_embedding_provider()
        vectors = embedding_provider.embed(chunks)
        self.index_store.build_index(index_key, vectors, metadata, chunks)

        status = {
            "owner": owner,
            "repo": repo,
            "last_indexed": datetime.utcnow().isoformat(),
            "file_count": len({doc["path"] for doc in documents}),
            "chunk_count": len(chunks),
            "commit": metadata[0].get("commit") if metadata else None,
        }
        self._write_status(index_key, status)
        return status

    def ingest_jira(self, project_key: str) -> Dict[str, Any]:
        """Ingest and index Jira issues."""
        index_key = self._index_key("jira", project_key)
        issues = self.gateway.request("jira", "list_issues", {"project_key": project_key})
        documents: List[Dict[str, Any]] = []
        for issue in issues:
            text = normalize_text(f"{issue.get('summary', '')} {issue.get('description', '')}")
            if not text:
                continue
            documents.append(
                {
                    "path": issue.get("key"),
                    "text": text,
                    "url": issue.get("url"),
                    "owner": project_key,
                    "repo": "jira",
                }
            )
        chunks, metadata = self._build_chunks(documents, source_type="jira")
        if chunks:
            embedding_provider = get_embedding_provider()
            vectors = embedding_provider.embed(chunks)
            self.index_store.build_index(index_key, vectors, metadata, chunks)
        status = {
            "project_key": project_key,
            "last_indexed": datetime.utcnow().isoformat(),
            "issue_count": len(documents),
            "chunk_count": len(chunks),
        }
        self._write_status(index_key, status)
        return status

    def ingest_confluence(self, space_key: str) -> Dict[str, Any]:
        """Ingest and index Confluence pages."""
        index_key = self._index_key("confluence", space_key)
        pages = self.gateway.request("confluence", "list_pages", {"space_key": space_key})
        documents: List[Dict[str, Any]] = []
        for page in pages:
            raw_body = page.get("body") or ""
            text = normalize_text(self._strip_html(raw_body))
            if not text:
                continue
            documents.append(
                {
                    "path": page.get("id"),
                    "text": text,
                    "url": page.get("url"),
                    "owner": space_key,
                    "repo": "confluence",
                }
            )
        chunks, metadata = self._build_chunks(documents, source_type="confluence")
        if chunks:
            embedding_provider = get_embedding_provider()
            vectors = embedding_provider.embed(chunks)
            self.index_store.build_index(index_key, vectors, metadata, chunks)
        status = {
            "space_key": space_key,
            "last_indexed": datetime.utcnow().isoformat(),
            "page_count": len(documents),
            "chunk_count": len(chunks),
        }
        self._write_status(index_key, status)
        return status

    def get_status(self, index_key: str) -> Dict[str, Any]:
        """Return last indexing status for a repository."""
        status_path = self._status_path(index_key)
        if status_path.exists():
            return json.loads(status_path.read_text())
        return {"index_key": index_key, "status": "not_indexed"}

    def _discover_paths(self, owner: str, repo: str, depth: int) -> List[str]:
        structure = self.gateway.request("github", "get_repo_structure", {"owner": owner, "repo": repo})
        paths = [item["path"] for item in structure["items"] if item.get("type") == "file"]
        readme = structure.get("readme")
        if readme and readme.get("path"):
            paths.append(readme["path"])

        for item in structure["items"]:
            if item.get("type") == "dir" and item.get("name") in {"docs", "doc", "documentation", "src"}:
                paths.extend(self._walk_directory(owner, repo, item["path"], depth - 1))

        unique_paths = list(dict.fromkeys(paths))
        return filter_paths(unique_paths)

    def _walk_directory(self, owner: str, repo: str, path: str, depth: int) -> List[str]:
        if depth < 0:
            return []
        listing = self.gateway.request(
            "github", "get_repo_structure", {"owner": owner, "repo": repo, "path": path}
        )
        results: List[str] = []
        for item in listing["items"]:
            if item.get("type") == "file":
                results.append(item["path"])
            elif item.get("type") == "dir":
                results.extend(self._walk_directory(owner, repo, item["path"], depth - 1))
        return results

    def _fetch_documents(self, owner: str, repo: str, paths: List[str]) -> List[Dict[str, Any]]:
        documents = []
        for path in paths:
            payload = {"owner": owner, "repo": repo, "path": path}
            result = self.gateway.request("github", "get_file_content", payload)
            raw_text = result.get("text", "")
            if not raw_text or is_binary(raw_text):
                continue
            text = normalize_text(raw_text)
            if not text:
                continue
            metadata = result.get("metadata", {})
            documents.append({"path": path, "text": text, **metadata})
        return documents

    def _build_chunks(
        self, documents: List[Dict[str, Any]], source_type: str
    ) -> tuple[List[str], List[Dict[str, Any]]]:
        chunks: List[str] = []
        metadata: List[Dict[str, Any]] = []
        for doc in documents:
            for chunk in chunk_text(doc["text"]):
                chunks.append(chunk)
                meta = {
                    "type": source_type,
                    "owner": doc.get("owner"),
                    "repo": doc.get("repo"),
                    "path": doc.get("path"),
                    "commit": doc.get("commit"),
                    "url": doc.get("url"),
                }
                metadata.append(meta)
        return chunks, metadata

    def _status_path(self, index_key: str) -> Path:
        return Path(CONFIG.index_root) / index_key / "index_status.json"

    def _write_status(self, index_key: str, status: Dict[str, Any]) -> None:
        status_path = self._status_path(index_key)
        status_path.parent.mkdir(parents=True, exist_ok=True)
        status_path.write_text(json.dumps(status, indent=2))

    @staticmethod
    def _strip_html(value: str) -> str:
        return re.sub(r"<[^>]+>", " ", value)

    @staticmethod
    def _index_key(source_type: str, owner: str, repo: str | None = None) -> str:
        if repo:
            return f"{source_type}__{owner}__{repo}"
        return f"{source_type}__{owner}"
