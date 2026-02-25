"""Pydantic schemas for API IO."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class UserContext(BaseModel):
    id: int
    name: str
    role: str
    team: Optional[str] = None


class ProjectContext(BaseModel):
    id: int
    key: str
    name: str
    description: str


class HomeResponse(BaseModel):
    product_name: str
    user: UserContext
    project: ProjectContext
    session_status: str


class ChecklistItemResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    order_index: int


class LearningPathResponse(BaseModel):
    product_name: str
    role: str
    items: List[ChecklistItemResponse]
    next_step: Optional[str] = None
    confidence_level: str
    confidence_rationale: str


class ExplainRequest(BaseModel):
    item_id: int = Field(..., description="Checklist item id to explain")


class ExplainResponse(BaseModel):
    item_id: int
    explanation: str


class ExploreContext(BaseModel):
    type: str = Field(..., description="repo|jira|confluence")
    owner: str
    repo: str
    commit_id: Optional[str] = None


class ExploreRequest(BaseModel):
    session_id: int
    context: ExploreContext
    question: str


class ExploreSource(BaseModel):
    type: str
    id: str
    path: str
    url: str
    excerpt: str


class ExploreResponse(BaseModel):
    answer: str
    sources: List[ExploreSource]
    confidence: str
    confidence_rationale: str
    model_used: str
    followups: List[str]


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    followups: List[str]
    model_used: str


class GenerateDocRequest(BaseModel):
    session_id: str
    title: str
    prompt: str
    format: str = Field(..., description="docx|pptx")


class GenerateDocResponse(BaseModel):
    file_name: str
    url: str


class TrackerResponse(BaseModel):
    product_name: str
    updated_at: datetime
    requests: List[dict]
