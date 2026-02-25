# KT.ai

KT.ai is an AI-powered Project Onboarding & Knowledge Transfer platform. It guides
new developers through onboarding using a multi-agent architecture and governed
MCP tool access.

## Architecture

- **Monorepo** with backend and frontend in a single repo
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: Next.js App Router
- **Agents**: Orchestrator + domain agents with strict boundaries
- **MCP**: Read-only, declarative tools accessed via the MCP gateway only

### Agent Roles

- **Orchestrator Agent**: Routes intent and maintains session context
- **Learning Path Agent**: Checklist, progress, next-step, confidence inference
- **Exploration Agent**: Repo-aware RAG Q&A with citations
- **Knowledge Mapping Agent**: Builds repository indexes on demand

### MCP Gateways & Servers

All external integrations are read-only MCP servers and accessed via the
`mcp/gateway` abstraction.

## Folder Structure

```
kt-ai/
├── apps/
│   ├── web/                         # Next.js frontend (KT.ai UI)
│   └── api/                         # FastAPI backend
│
├── agents/
│   ├── orchestrator/                # Intent routing agent
│   ├── learning_path/               # Checklist, confidence, next-step logic
│   ├── exploration/                 # Repo/Jira/Docs exploration
│   └── knowledge_mapper/             # Project Knowledge Map builder
│
├── mcp/
│   ├── gateway/                     # MCP gateway abstraction
│   ├── github/                      # GitHub MCP server (read-only)
│   ├── gitlab/                      # GitLab MCP server (read-only)
│   ├── jira/                        # Jira MCP server (read-only)
│   └── confluence/                  # Confluence MCP server (read-only)
│
├── domain/
│   ├── project/                     # Project Knowledge Map models
│   ├── learning/                    # Learning blueprint & checklist models
│   └── user/                        # User profile & context models
│
├── contracts/
│   ├── agent_io/                    # Agent input/output schemas
│   ├── mcp_tools/                   # MCP tool schemas
│   └── api/                         # REST API request/response schemas
│
├── memory/
│   ├── sessions/                    # Onboarding session state
│   └── confidence/                  # Confidence inference state
│
├── infra/
│   ├── config/
│   └── observability/
│
├── README.md
└── pyproject.toml
```

## Backend API

Base URL: `http://localhost:8000`

- `GET  /api/home`
- `GET  /api/learning-path`
- `POST /api/learning-path/explain`
- `POST /api/explore`
- `GET  /api/github/repos`
- `POST /api/index/reindex`
- `GET  /api/index/status?source_type=...&owner=...&repo=...`
- `GET  /api/tracker`
- `POST /api/chat`
- `POST /api/generate-doc`
- `GET  /api/generated/{file_name}`

The SQLite database seeds:
- One user: **Backend Developer**
- One project: **payments-platform**

## Running KT.ai Locally

### Backend (Local LLM default)

```bash
cd /Users/addi/Desktop/workspace/vibeathon/kt-ai
./tools/setup_local_llm.sh
./tools/download_model.sh
export LOCAL_LLM_PATH=\"/absolute/path/to/model.gguf\"
python tools/prepare_model.py
./tools/run_local_server.sh
```

### Backend Environment

Create a `.env` file in the repo root with:

```
GITHUB_TOKEN=your_pat
JIRA_TOKEN=your_jira_token
CONFLUENCE_TOKEN=your_confluence_token
JIRA_BASE_URL=https://your-domain.atlassian.net
CONFLUENCE_BASE_URL=https://your-domain.atlassian.net/wiki
LLM_BACKEND=local
LOCAL_LLM_PATH=/absolute/path/to/model.gguf
OPENAI_API_KEY=your_key
```

Optional overrides:
- `OPENAI_CHAT_MODEL` (default `gpt-4o-mini`)
- `OPENAI_EMBEDDING_MODEL` (default `text-embedding-3-small`)
- `EMBEDDING_BACKEND` (`openai` | `local`)
- `EMBEDDING_MODEL` (default `sentence-transformers/all-MiniLM-L6-v2`)
- `INDEX_ROOT` (default `indexes`)

Demo-only defaults live in `apps/api/config_demo.py`. Set `DEMO_MODE=true` to load
those values locally (do not use in production).

### Frontend

```bash
cd /Users/addi/Desktop/workspace/vibeathon/kt-ai/apps/web
npm install
npm run dev
```

Open `http://localhost:3000` to view the KT.ai UI.

## Frontend UI Notes

- Figma source files live under `apps/web/figma-ui/AI Project Onboarding Portal/`.
- The animated background uses `lottie-react` with a placeholder at
  `apps/web/public/animations/placeholder.json`. Replace that file with a
  production Lottie export to update the background.
- Set `NEXT_PUBLIC_API_BASE_URL` to point the web UI at a backend other than
  `http://localhost:8000`.
- For large assets (>10MB), use Git LFS in `apps/web/public/large/` or host them
  in an external bucket/CDN and reference the URL in the UI.

## Notes

- Agents never call tools directly; they use the MCP Gateway.
- UI only calls the FastAPI backend; no direct agent calls.
- Integrations are read-only.
- RAG indexes are stored under `indexes/` and query logs at `infra/observability/query_logs.jsonl`.
- Verify GGUF model licenses before downloading.