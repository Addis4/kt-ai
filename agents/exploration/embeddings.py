"""Embedding providers for KT.ai."""

from __future__ import annotations

from typing import List

from openai import OpenAI

from apps.api.config import CONFIG


class EmbeddingProvider:
    """Abstract embedding provider."""

    def embed(self, texts: List[str]) -> List[List[float]]:
        raise NotImplementedError


class OpenAIEmbeddingProvider(EmbeddingProvider):
    """OpenAI embeddings provider."""

    def __init__(self, api_key: str, model: str) -> None:
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def embed(self, texts: List[str]) -> List[List[float]]:
        response = self.client.embeddings.create(model=self.model, input=texts)
        return [item.embedding for item in response.data]


class LocalEmbeddingProvider(EmbeddingProvider):
    """Local embeddings provider using sentence-transformers."""

    def __init__(self, model_name: str) -> None:
        try:
            from sentence_transformers import SentenceTransformer
        except ImportError as exc:
            raise RuntimeError("sentence-transformers is required for local embeddings") from exc
        self.model = SentenceTransformer(model_name)

    def embed(self, texts: List[str]) -> List[List[float]]:
        vectors = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
        return vectors.tolist()


def get_embedding_provider() -> EmbeddingProvider:
    """Return configured embedding provider."""
    backend = CONFIG.embedding_backend.lower()
    if backend == "openai":
        if not CONFIG.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required for OpenAI embeddings")
        return OpenAIEmbeddingProvider(CONFIG.openai_api_key, CONFIG.openai_embedding_model)
    return LocalEmbeddingProvider(CONFIG.embedding_model)
