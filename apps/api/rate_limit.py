"""Simple in-memory rate limiter for API endpoints."""

from __future__ import annotations

import time
from collections import defaultdict
from typing import DefaultDict, Tuple

from fastapi import HTTPException, Request


class RateLimiter:
    """Naive fixed-window rate limiter."""

    def __init__(self, max_requests: int = 30, window_seconds: int = 60) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._store: DefaultDict[str, Tuple[int, float]] = defaultdict(lambda: (0, time.time()))

    def check(self, request: Request) -> None:
        client_ip = request.client.host if request.client else "unknown"
        count, window_start = self._store[client_ip]
        now = time.time()
        if now - window_start > self.window_seconds:
            self._store[client_ip] = (1, now)
            return
        if count >= self.max_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        self._store[client_ip] = (count + 1, window_start)
