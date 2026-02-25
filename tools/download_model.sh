#!/usr/bin/env bash
set -euo pipefail

MODEL_DIR="${1:-models}"
mkdir -p "$MODEL_DIR"

cat <<'MSG'
Download a GGUF model compatible with llama.cpp.

Recommended options:
- TheBloke/Llama-2-7B-Chat-GGUF (license required)
- TheBloke/Mistral-7B-Instruct-v0.2-GGUF
- TheBloke/OpenHermes-2.5-Mistral-7B-GGUF

Example (requires Hugging Face token and acceptance of model license):
  huggingface-cli download TheBloke/Mistral-7B-Instruct-v0.2-GGUF mistral-7b-instruct-v0.2.Q4_K_M.gguf \
    --local-dir "$MODEL_DIR"

After download, set LOCAL_LLM_PATH in .env to the absolute path of the .gguf file.
MSG
