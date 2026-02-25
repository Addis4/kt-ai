#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHONPATH=. uvicorn apps.api.main:app --reload --port 8000
