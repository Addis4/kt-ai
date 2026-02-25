"""GitHub API client for read-only repository access."""

from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Optional

import requests


class GitHubClient:
    """Minimal GitHub REST client with retry and metadata enrichment."""

    def __init__(self, token: Optional[str] = None) -> None:
        self.base_url = "https://api.github.com"
        self.session = requests.Session()
        if token:
            self.session.headers.update({"Authorization": f"token {token}"})
        self.session.headers.update({"Accept": "application/vnd.github+json"})
        self.logger = logging.getLogger("ktai.github")
        masked = f"{token[:4]}..." if token else "missing"
        self.logger.info("GitHub client initialized (token=%s)", masked)

    def _request(self, method: str, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        url = f"{self.base_url}{path}"
        retries = 3
        for attempt in range(retries):
            response = self.session.request(method, url, params=params, timeout=20)
            self.logger.info("GitHub request %s %s -> %s", method, path, response.status_code)
            if response.status_code in {429, 500, 502, 503, 504} and attempt < retries - 1:
                time.sleep(1.5 * (attempt + 1))
                continue
            response.raise_for_status()
            return response.json()
        response.raise_for_status()

    def list_repos(self, owner: Optional[str] = None, repo_type: str = "all") -> List[Dict[str, Any]]:
        """List repositories for a user or organization."""
        if owner:
            data = self._request("GET", f"/users/{owner}/repos", params={"type": repo_type})
        else:
            data = self._request("GET", "/user/repos", params={"type": repo_type})
        return [
            {
                "id": repo.get("id"),
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description"),
                "url": repo.get("html_url"),
                "default_branch": repo.get("default_branch"),
            }
            for repo in data
        ]

    def get_repo_structure(
        self, owner: str, repo: str, ref: Optional[str] = None, path: str = ""
    ) -> Dict[str, Any]:
        """Return repo structure and README content for a path."""
        params = {"ref": ref} if ref else None
        items = self._request("GET", f"/repos/{owner}/{repo}/contents/{path}", params=params)
        if isinstance(items, dict):
            items_list = [items]
        else:
            items_list = items

        readme = None
        if not path:
            try:
                readme_resp = self._request("GET", f"/repos/{owner}/{repo}/readme", params=params)
                readme = {
                    "path": readme_resp.get("path"),
                    "download_url": readme_resp.get("download_url"),
                }
            except requests.HTTPError:
                readme = None

        return {
            "items": [
                {
                    "type": item.get("type"),
                    "name": item.get("name"),
                    "path": item.get("path"),
                    "sha": item.get("sha"),
                    "url": item.get("html_url"),
                }
                for item in items_list
            ],
            "readme": readme,
        }

    def get_file_content(
        self, owner: str, repo: str, path: str, ref: Optional[str] = None
    ) -> Dict[str, Any]:
        """Return raw file content and metadata."""
        params = {"ref": ref} if ref else None
        item = self._request("GET", f"/repos/{owner}/{repo}/contents/{path}", params=params)
        download_url = item.get("download_url")
        text = ""
        if download_url:
            raw_resp = self.session.get(download_url, timeout=20)
            raw_resp.raise_for_status()
            text = raw_resp.text

        commit_sha = None
        try:
            commit = self._request("GET", f"/repos/{owner}/{repo}/commits", params={"path": path})
            if commit:
                commit_sha = commit[0].get("sha")
        except requests.HTTPError:
            commit_sha = None

        return {
            "text": text,
            "metadata": {
                "source_type": "repo",
                "owner": owner,
                "repo": repo,
                "path": path,
                "commit": commit_sha,
                "url": item.get("html_url"),
            },
        }

    def get_file_at_commit(self, owner: str, repo: str, path: str, commit_id: str) -> Dict[str, Any]:
        """Return raw file content at a specific commit."""
        return self.get_file_content(owner, repo, path, ref=commit_id)
