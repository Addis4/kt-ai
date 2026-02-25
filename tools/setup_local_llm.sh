#!/usr/bin/env bash
set -euo pipefail

if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew is required. Install from https://brew.sh" >&2
  exit 1
fi

brew list cmake >/dev/null 2>&1 || brew install cmake
brew list libomp >/dev/null 2>&1 || brew install libomp

python3 -m venv .venv
source .venv/bin/activate
pip install -e .

echo "Setup complete. Activate with: source .venv/bin/activate"
