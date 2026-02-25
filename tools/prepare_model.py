"""Validate and register a local GGUF model path."""

from __future__ import annotations

import os
from pathlib import Path


def main() -> None:
    model_path = os.environ.get("LOCAL_LLM_PATH")
    if not model_path:
        raise SystemExit("LOCAL_LLM_PATH is not set.")
    model_file = Path(model_path)
    if not model_file.exists():
        raise SystemExit(f"Model not found: {model_file}")
    if model_file.suffix.lower() != ".gguf":
        raise SystemExit("Model must be a .gguf file")
    print(f"Model OK: {model_file}")


if __name__ == "__main__":
    main()
