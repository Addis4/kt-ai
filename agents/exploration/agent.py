"""Exploration agent for repository-aware Q/A."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from agents.exploration.embeddings import get_embedding_provider
from agents.exploration.llm_provider import get_llm_provider
from apps.api.config import CONFIG
from domain.index_store import IndexStore
from infra.observability.logger import log_event


class ExplorationAgent:
    """Answers exploratory questions using RAG over repository content."""

    def __init__(self, index_store: IndexStore) -> None:
        self.index_store = index_store

    def answer_question(
        self,
        session_id: int,
        owner: str,
        repo: str,
        question: str,
        source_type: str = "repo",
        commit_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Retrieve relevant chunks and generate an evidence-backed answer."""
        embedding_provider = get_embedding_provider()
        query_vector = embedding_provider.embed([question])[0]
        try:
            index_key = f"{source_type}__{owner}" if source_type != "repo" else f"{source_type}__{owner}__{repo}"
            results = self.index_store.search(index_key, query_vector, top_k=5)
        except FileNotFoundError:
            results = []

        llm_provider, backend = get_llm_provider()
        if commit_id:
            filtered = [result for result in results if result.metadata.get("commit") == commit_id]
            if filtered:
                results = filtered
        sources_payload = [
            {
                "type": result.metadata.get("type", source_type),
                "id": f"{owner}/{repo}" if source_type == "repo" else f"{source_type}/{owner}",
                "path": result.metadata.get("path", ""),
                "url": result.metadata.get("url", ""),
                "excerpt": result.text[:600],
                "score": result.score,
                "commit": result.metadata.get("commit"),
            }
            for result in results
        ]

        system_instructions = (
            "You are a KT.ai Exploration Agent. Answer using only the provided sources. "
            "If the answer is not present, say you could not find a definitive answer in the repository "
            "and list related references. If no sources are provided, respond exactly: "
            "\"No relevant content found in the indexed repo. Would you like me to search commit history or other repos?\" "
            "Cite sources inline like [owner/repo/path]. Provide a short 'how to verify' step with the file path. "
            "Provide 2-3 follow-up questions in a section titled 'Follow-ups:'."
        )

        if not sources_payload:
            prompt_sources = "No sources were retrieved."
        else:
            prompt_sources = "\n\n".join(
                [
                    f"SOURCE #{idx + 1} ({src['id']}/{src['path']} @ {src.get('commit') or 'unknown'}):\n"
                    f"{src['excerpt']}\nURL: {src['url']}"
                    for idx, src in enumerate(sources_payload)
                ]
            )

        user_prompt = (
            f"Question: {question}\n"
            f"Commit preference: {commit_id or 'none'}\n\nSources:\n{prompt_sources}\n\n"
            "Answer concisely with inline citations and a verification step."
        )

        messages = [
            {"role": "system", "content": system_instructions},
            {"role": "user", "content": user_prompt},
        ]

        answer = llm_provider.generate(messages)
        followups = self._extract_followups(answer)

        confidence, rationale = self._confidence(results, answer)
        response = {
            "answer": answer or "",
            "sources": [
                {
                    "type": src["type"],
                    "id": src["id"],
                    "path": src["path"],
                    "url": src["url"],
                    "excerpt": src["excerpt"],
                }
                for src in sources_payload
            ],
            "confidence": confidence,
            "confidence_rationale": rationale,
            "model_used": backend,
            "followups": followups,
        }

        log_event(
            {
                "event": "explore_question",
                "session_id": session_id,
                "owner": owner,
                "repo": repo,
                "question": question,
                "confidence": confidence,
                "confidence_rationale": rationale,
                "sources": response["sources"],
                "model_used": backend,
            }
        )
        return response

    @staticmethod
    def _extract_followups(answer: str) -> List[str]:
        if "Follow-ups:" not in answer:
            return []
        section = answer.split("Follow-ups:", 1)[1]
        lines = [line.strip("- ").strip() for line in section.splitlines() if line.strip()]
        return [line for line in lines if line][:3]

    @staticmethod
    def _confidence(results: List[Any], answer: str) -> tuple[str, str]:
        if not results:
            return "low", "No sources retrieved for the query."
        scores = [result.score for result in results]
        cited = "[" in answer and "]" in answer
        if scores[0] > 0.8 and cited:
            return "high", "Top result is highly similar and citations are present."
        if sum(scores[:3]) > 1.6 and cited:
            return "medium", "Multiple relevant sources found with citations."
        return "low", "Similarity or citations were insufficient."
