"""LLM providers for KT.ai exploration answers."""

from __future__ import annotations

import subprocess
from typing import List, Literal

from openai import OpenAI

from apps.api.config import CONFIG


class LLMProvider:
    """Abstract chat provider."""

    def generate(self, messages: List[dict], max_tokens: int = 500, temperature: float = 0.2) -> str:
        raise NotImplementedError


class OpenAIProvider(LLMProvider):
    """OpenAI chat provider."""

    def __init__(self, api_key: str, model: str) -> None:
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def generate(self, messages: List[dict], max_tokens: int = 500, temperature: float = 0.2) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        return response.choices[0].message.content or ""


class LlamaCppProvider(LLMProvider):
    """Local LLM provider using llama-cpp-python."""

    def __init__(self, model_path: str) -> None:
        try:
            from llama_cpp import Llama
        except ImportError as exc:
            raise RuntimeError("llama-cpp-python is required for local LLM") from exc
        self.model = Llama(model_path=model_path, n_ctx=4096, n_threads=4)

    def generate(self, messages: List[dict], max_tokens: int = 500, temperature: float = 0.2) -> str:
        prompt = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in messages]) + "\nASSISTANT:"
        response = self.model(prompt=prompt, max_tokens=max_tokens, temperature=temperature)
        return response["choices"][0]["text"].strip()


class LocalCLIProvider(LLMProvider):
    """Local LLM provider that executes a CLI with prompt via stdin."""

    def __init__(self, executable_path: str) -> None:
        self.executable_path = executable_path

    def generate(self, messages: List[dict], max_tokens: int = 500, temperature: float = 0.2) -> str:
        prompt = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in messages])
        process = subprocess.run(
            [self.executable_path],
            input=prompt,
            text=True,
            capture_output=True,
            check=False,
        )
        if process.returncode != 0:
            raise RuntimeError(f"Local LLM failed: {process.stderr.strip()}")
        return process.stdout.strip()


def get_llm_provider() -> tuple[LLMProvider, Literal["openai", "local"]]:
    """Return configured LLM provider and model label."""
    backend = CONFIG.llm_backend.lower()
    if backend == "openai":
        if not CONFIG.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is required for OpenAI chat")
        return OpenAIProvider(CONFIG.openai_api_key, CONFIG.openai_chat_model), "openai"
    if not CONFIG.local_llm_path:
        raise RuntimeError("LOCAL_LLM_PATH is required for local LLM backend")
    if CONFIG.local_llm_path.endswith(".gguf"):
        return LlamaCppProvider(CONFIG.local_llm_path), "local"
    return LocalCLIProvider(CONFIG.local_llm_path), "local"
