"""Vector index store abstraction using FAISS with metadata persistence."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

import numpy as np

try:
    import hnswlib
except ImportError:
    hnswlib = None

try:
    import faiss
except ImportError:
    faiss = None


@dataclass
class SearchResult:
    """Search result with text and metadata."""

    score: float
    text: str
    metadata: Dict[str, Any]


class IndexStore:
    """Manage a vector index with associated metadata (HNSW preferred)."""

    def __init__(self, base_path: str) -> None:
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

    def _index_dir(self, index_key: str) -> Path:
        return self.base_path / index_key

    def load(self, index_key: str) -> tuple[Any, List[Dict[str, Any]], List[str], str, int]:
        index_dir = self._index_dir(index_key)
        index_path = index_dir / "index.bin"
        metadata_path = index_dir / "metadata.json"
        texts_path = index_dir / "chunks.json"

        if not index_path.exists():
            raise FileNotFoundError("Index not found")

        backend_info = (index_dir / "backend.txt").read_text().strip()
        backend, dim_text = backend_info.split(":", 1)
        dim = int(dim_text)
        if backend == "hnsw":
            index = hnswlib.Index(space="cosine", dim=dim)
            index.load_index(str(index_path))
        else:
            if faiss is None:
                raise RuntimeError("faiss-cpu is not installed")
            index = faiss.read_index(str(index_path))
        metadata = json.loads(metadata_path.read_text())
        texts = json.loads(texts_path.read_text())
        return index, metadata, texts, backend, dim

    def save(
        self,
        index_key: str,
        index: Any,
        metadata: List[Dict[str, Any]],
        texts: List[str],
        backend: str,
        dim: int,
    ) -> None:
        index_dir = self._index_dir(index_key)
        index_dir.mkdir(parents=True, exist_ok=True)
        if backend == "hnsw":
            index.save_index(str(index_dir / "index.bin"))
        else:
            if faiss is None:
                raise RuntimeError("faiss-cpu is not installed")
            faiss.write_index(index, str(index_dir / "index.bin"))
        (index_dir / "backend.txt").write_text(f"{backend}:{dim}")
        (index_dir / "metadata.json").write_text(json.dumps(metadata, indent=2))
        (index_dir / "chunks.json").write_text(json.dumps(texts, indent=2))

    def build_index(
        self,
        index_key: str,
        vectors: List[List[float]],
        metadata: List[Dict[str, Any]],
        texts: List[str],
    ) -> None:
        if not vectors:
            raise ValueError("No vectors to index")
        dim = len(vectors[0])
        vector_array = self._normalize(np.array(vectors, dtype="float32"))
        if hnswlib is not None:
            index = hnswlib.Index(space="cosine", dim=dim)
            index.init_index(max_elements=len(vector_array), ef_construction=200, M=16)
            index.add_items(vector_array, list(range(len(vector_array))))
            index.set_ef(50)
            backend = "hnsw"
        else:
            if faiss is None:
                raise RuntimeError("faiss-cpu is not installed")
            index = faiss.IndexFlatIP(dim)
            index.add(vector_array)
            backend = "faiss"
        self.save(index_key, index, metadata, texts, backend, dim)

    def search(self, index_key: str, query_vector: List[float], top_k: int = 5) -> List[SearchResult]:
        index, metadata, texts, backend, dim = self.load(index_key)
        query = self._normalize(np.array([query_vector], dtype="float32"))
        if backend == "hnsw":
            indices, distances = index.knn_query(query, k=top_k)
            scores = 1 - distances
        else:
            scores, indices = index.search(query, top_k)
        results: List[SearchResult] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(texts):
                continue
            results.append(
                SearchResult(
                    score=float(score),
                    text=texts[idx],
                    metadata=metadata[idx],
                )
            )
        return results

    @staticmethod
    def _normalize(vectors: np.ndarray) -> np.ndarray:
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        norms[norms == 0] = 1
        return vectors / norms
