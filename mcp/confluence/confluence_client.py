"""Confluence REST client for read-only page access."""

from __future__ import annotations

import time
from typing import Any, Dict, List, Optional

import requests


class ConfluenceClient:
    """Minimal Confluence REST client with retry/backoff."""

    def __init__(self, base_url: str | None, token: str | None) -> None:
        self.base_url = base_url.rstrip("/") if base_url else None
        self.session = requests.Session()
        if token:
            self.session.headers.update({"Authorization": f"Bearer {token}"})
        self.session.headers.update({"Accept": "application/json"})

    def _request(self, method: str, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        if not self.base_url:
            return []
        url = f"{self.base_url}{path}"
        for attempt in range(3):
            response = self.session.request(method, url, params=params, timeout=20)
            if response.status_code in {429, 500, 502, 503, 504} and attempt < 2:
                time.sleep(1.5 * (attempt + 1))
                continue
            response.raise_for_status()
            return response.json()
        response.raise_for_status()

    def list_pages(self, space_key: str) -> List[Dict[str, Any]]:
        data = self._request(
            "GET",
            "/rest/api/content",
            params={"spaceKey": space_key, "limit": 50, "expand": "body.storage,version"},
        )
        pages = data.get("results", []) if isinstance(data, dict) else []
        return [self._page_to_meta(page) for page in pages]

    def get_page_content(self, page_id: str) -> Dict[str, Any]:
        page = self._request("GET", f"/rest/api/content/{page_id}", params={"expand": "body.storage,version"})
        return self._page_to_meta(page)

    def _page_to_meta(self, page: Dict[str, Any]) -> Dict[str, Any]:
        body = page.get("body", {}).get("storage", {}) if isinstance(page, dict) else {}
        return {
            "id": page.get("id"),
            "title": page.get("title"),
            "body": body.get("value"),
            "url": f"{self.base_url}/pages/viewpage.action?pageId={page.get('id')}" if self.base_url else None,
        }
