# KT.ai API

## Environment Variables

Create a `.env` file at the repo root with:

```
GITHUB_TOKEN=your_pat
JIRA_TOKEN=your_jira_token
CONFLUENCE_TOKEN=your_confluence_token
JIRA_BASE_URL=https://your-domain.atlassian.net
CONFLUENCE_BASE_URL=https://your-domain.atlassian.net/wiki
OPENAI_API_KEY=your_key
LLM_BACKEND=local
LOCAL_LLM_PATH=/absolute/path/to/model.gguf
```

Optional overrides:
- `OPENAI_CHAT_MODEL` (default `gpt-4o-mini`)
- `OPENAI_EMBEDDING_MODEL` (default `text-embedding-3-small`)
- `EMBEDDING_BACKEND` (`openai` | `local`)
- `EMBEDDING_MODEL` (default `sentence-transformers/all-MiniLM-L6-v2`)
- `INDEX_ROOT` (default `indexes`)

Demo-only defaults live in `apps/api/config_demo.py`. Set `DEMO_MODE=true` to load
those values locally (do not use in production).

## Indexing

Trigger a reindex:

```
POST /api/index/reindex
{
  "type": "repo",
  "owner": "openai",
  "repo": "openai-python"
}
```

Check index status:

```
GET /api/index/status?source_type=repo&owner=openai&repo=openai-python
```

## GitHub Repos

```
GET /api/github/repos
```

## Explore Q/A

```
POST /api/explore
{
  "session_id": 1,
  "context": { "type": "repo", "owner": "openai", "repo": "openai-python", "commit_id": "HEAD" },
  "question": "Where is the OpenAI client initialized?"
}
```
