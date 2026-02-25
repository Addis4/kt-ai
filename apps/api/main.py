"""FastAPI entrypoint for KT.ai backend."""

from __future__ import annotations

from datetime import datetime
import logging
from pathlib import Path
from typing import List

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from agents.exploration.agent import ExplorationAgent
from agents.knowledge_mapper.agent import KnowledgeMappingAgent
from agents.learning_path.agent import ChecklistView, LearningPathAgent
from agents.orchestrator.agent import OrchestratorAgent, SessionContext
from apps.api.config import CONFIG
from apps.api.db import Base, SessionLocal, engine, get_db
from apps.api.docgen import write_docx, write_pptx
from apps.api.models import ChecklistItem, OnboardingSession
from apps.api.rate_limit import RateLimiter
from apps.api.schemas import (
    ChatRequest,
    ChatResponse,
    ChecklistItemResponse,
    ExplainRequest,
    ExplainResponse,
    ExploreRequest,
    ExploreResponse,
    GenerateDocRequest,
    GenerateDocResponse,
    HomeResponse,
    LearningPathResponse,
    ProjectContext,
    TrackerResponse,
    UserContext,
)
from apps.api.seed import seed_db
from domain.index_store import IndexStore
from infra.config.settings import PRODUCT_NAME
from mcp.confluence.server import ConfluenceMCPServer
from mcp.gateway.gateway import MCPGateway
from mcp.github.server import GitHubMCPServer
from mcp.gitlab.server import GitlabMCPServer
from mcp.jira.server import JiraMCPServer
from memory.sessions.store import append_message
from typing import Optional

app = FastAPI(title="KT.ai API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rate_limiter = RateLimiter()
logger = logging.getLogger("ktai.api")

# MCP gateway and servers
mcp_gateway = MCPGateway()
mcp_gateway.register_server("gitlab", GitlabMCPServer())
mcp_gateway.register_server("jira", JiraMCPServer())
mcp_gateway.register_server("confluence", ConfluenceMCPServer())
mcp_gateway.register_server("github", GitHubMCPServer())

# Agents
knowledge_mapper = KnowledgeMappingAgent(mcp_gateway)
learning_agent = LearningPathAgent()
exploration_agent = ExplorationAgent(IndexStore(CONFIG.index_root))

GENERATED_DIR = Path("apps/api/generated")


@app.on_event("startup")
def startup() -> None:
    """Initialize database and seed data on startup."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()


def _get_primary_session(db: Session) -> OnboardingSession:
    session = db.query(OnboardingSession).first()
    if not session:
        raise HTTPException(status_code=404, detail="No onboarding session found")
    return session


def _get_orchestrator(db: Session) -> OrchestratorAgent:
    session = _get_primary_session(db)
    context = SessionContext(
        session_id=session.id,
        user_role=session.user.role,
        project_key=session.project.key,
    )
    return OrchestratorAgent(context)


def _serialize_checklist_items(items: List[ChecklistItem]) -> List[ChecklistItemResponse]:
    return [
        ChecklistItemResponse(
            id=item.id,
            title=item.title,
            description=item.description,
            status=item.status,
            order_index=item.order_index,
        )
        for item in items
    ]


@app.get("/api/home", response_model=HomeResponse)
def home(db: Session = Depends(get_db)) -> HomeResponse:
    """Return detected user context for the home screen."""
    session = _get_primary_session(db)
    user = session.user
    project = session.project

    return HomeResponse(
        product_name=PRODUCT_NAME,
        user=UserContext(id=user.id, name=user.name, role=user.role, team=user.team),
        project=ProjectContext(
            id=project.id,
            key=project.key,
            name=project.name,
            description=project.description,
        ),
        session_status=session.status,
    )


@app.get("/api/learning-path", response_model=LearningPathResponse)
def learning_path(db: Session = Depends(get_db)) -> LearningPathResponse:
    """Return the learning path checklist and confidence state."""
    session = _get_primary_session(db)
    items = (
        db.query(ChecklistItem)
        .filter(ChecklistItem.session_id == session.id)
        .order_by(ChecklistItem.order_index)
        .all()
    )
    views = [
        ChecklistView(
            id=item.id,
            title=item.title,
            description=item.description,
            status=item.status,
            order_index=item.order_index,
        )
        for item in items
    ]

    next_step = learning_agent.recommend_next_step(views)
    confidence_level, rationale = learning_agent.infer_confidence(views)

    return LearningPathResponse(
        product_name=PRODUCT_NAME,
        role=session.user.role,
        items=_serialize_checklist_items(items),
        next_step=next_step,
        confidence_level=confidence_level,
        confidence_rationale=rationale,
    )


@app.post("/api/learning-path/explain", response_model=ExplainResponse)
def explain_learning_path(
    request: ExplainRequest, db: Session = Depends(get_db)
) -> ExplainResponse:
    """Explain a single checklist item."""
    item = db.query(ChecklistItem).filter(ChecklistItem.id == request.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")

    view = ChecklistView(
        id=item.id,
        title=item.title,
        description=item.description,
        status=item.status,
        order_index=item.order_index,
    )
    explanation = learning_agent.explain_item(view)
    return ExplainResponse(item_id=item.id, explanation=explanation)


@app.post("/api/explore", response_model=ExploreResponse)
def explore(request: ExploreRequest, http_request: Request, db: Session = Depends(get_db)) -> ExploreResponse:
    """Route exploration queries through the exploration agent."""
    rate_limiter.check(http_request)
    session = _get_primary_session(db)
    if request.session_id != session.id:
        raise HTTPException(status_code=404, detail="Session not found")
    _ = _get_orchestrator(db)
    answer = exploration_agent.answer_question(
        session_id=request.session_id,
        owner=request.context.owner,
        repo=request.context.repo,
        question=request.question,
        source_type=request.context.type,
        commit_id=request.context.commit_id,
    )
    return ExploreResponse(**answer)


@app.get("/api/github/repos", response_model=None)
def list_github_repos(owner: Optional[str] = None, http_request: Request = None):
    """List GitHub repositories for the authenticated user or provided owner."""
    if http_request:
        rate_limiter.check(http_request)

    if not CONFIG.github_token:
        raise HTTPException(status_code=502, detail="GitHub token not configured")

    try:
        return mcp_gateway.request(
            "github",
            "list_repos",
            {"owner": owner, "type": "all"}
        )
    except Exception as exc:
        logger.exception("GitHub repo listing failed")
        raise HTTPException(status_code=502, detail=str(exc)) from exc

@app.post("/api/index/reindex")
def reindex_repo(payload: dict, http_request: Request) -> dict:
    """Trigger indexing for repo/jira/confluence sources."""
    rate_limiter.check(http_request)
    source_type = payload.get("type", "repo")
    if source_type == "repo":
        owner = payload.get("owner")
        repo = payload.get("repo")
        if not owner or not repo:
            raise HTTPException(status_code=400, detail="owner and repo are required")
        return knowledge_mapper.ingest_repo(owner, repo)
    if source_type == "jira":
        project_key = payload.get("project_key")
        if not project_key:
            raise HTTPException(status_code=400, detail="project_key is required")
        return knowledge_mapper.ingest_jira(project_key)
    if source_type == "confluence":
        space_key = payload.get("space_key")
        if not space_key:
            raise HTTPException(status_code=400, detail="space_key is required")
        return knowledge_mapper.ingest_confluence(space_key)
    raise HTTPException(status_code=400, detail="Invalid source type")


@app.get("/api/index/status")
def index_status(source_type: str, owner: str, repo: str | None = None) -> dict:
    """Return indexing status for a source."""
    if not owner:
        raise HTTPException(status_code=400, detail="owner is required")
    index_key = f"{source_type}__{owner}" if not repo else f"{source_type}__{owner}__{repo}"
    return knowledge_mapper.get_status(index_key)


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest, http_request: Request) -> ChatResponse:
    """Buddy-style chat endpoint with session memory."""
    rate_limiter.check(http_request)
    history = append_message(request.session_id, "user", request.message)
    from agents.exploration.llm_provider import get_llm_provider

    llm_provider, backend = get_llm_provider()
    system = "You are a helpful KT.ai buddy. Ask clarifying questions and offer to draft docs or slides when asked."
    messages = [{"role": "system", "content": system}] + history
    answer = llm_provider.generate(messages)
    append_message(request.session_id, "assistant", answer)
    followups = ExplorationAgent._extract_followups(answer)
    return ChatResponse(session_id=request.session_id, answer=answer, followups=followups, model_used=backend)


@app.post("/api/generate-doc", response_model=GenerateDocResponse)
def generate_doc(request: GenerateDocRequest, http_request: Request) -> GenerateDocResponse:
    rate_limiter.check(http_request)
    from agents.exploration.llm_provider import get_llm_provider

    llm_provider, backend = get_llm_provider()
    prompt = (
        f"Create a structured outline for: {request.title}. "
        "Return one bullet per line. Do not include any citations."
    )
    outline = llm_provider.generate(
        [
            {"role": "system", "content": "You generate structured outlines for docs and slides."},
            {"role": "user", "content": f"{request.prompt}\n\n{prompt}"},
        ]
    )
    lines = [line.strip("- ").strip() for line in outline.splitlines() if line.strip()]
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    safe_title = request.title.replace(" ", "_")
    if request.format == "pptx":
        filename = f"{safe_title}.pptx"
        output_path = GENERATED_DIR / filename
        write_pptx(request.title, lines, output_path)
    else:
        filename = f"{safe_title}.docx"
        output_path = GENERATED_DIR / filename
        write_docx(request.title, lines, output_path)
    return GenerateDocResponse(file_name=filename, url=f"/api/generated/{filename}")


@app.get("/api/generated/{file_name}")
def download_generated(file_name: str) -> FileResponse:
    file_path = GENERATED_DIR / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(str(file_path))


@app.get("/api/tracker", response_model=TrackerResponse)
def tracker() -> TrackerResponse:
    """Return mocked access request status."""
    requests = [
        {
            "id": "REQ-1001",
            "system": "GitLab",
            "status": "Approved",
            "updated_at": "2026-01-18",
        },
        {
            "id": "REQ-1002",
            "system": "Confluence",
            "status": "Pending",
            "updated_at": "2026-01-20",
        },
    ]
    return TrackerResponse(
        product_name=PRODUCT_NAME,
        updated_at=datetime.utcnow(),
        requests=requests,
    )
