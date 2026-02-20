# Data retrieval API schemas
"""Request and response schemas for data retrieval endpoints."""

from typing import Literal, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class AttachmentSchema(BaseModel):
    """Attachment file schema."""
    name: str = Field(..., description="File name")
    url: str = Field(..., description="File URL")
    size: str = Field(..., description="File size")
    type: str = Field(..., description="File MIME type")


class GalleryItemSchema(BaseModel):
    """Gallery item schema for PlayDay/PlayBook data."""
    title: str = Field(..., description="Item title")
    description: str = Field(..., description="Short description")
    author: str = Field(..., description="Author name")
    date: str = Field(..., description="Date string (YYYY.MM.DD format)")
    category: str = Field(..., description="Category name")
    fullDescription: Optional[str] = Field(None, description="Full detailed description")
    tags: Optional[list[str]] = Field(None, description="Tags list")
    attachments: Optional[list[AttachmentSchema]] = Field(None, description="Attachment files")
    session: Optional[int] = Field(None, description="Session number for PlayDay items")


class PlaydayResponse(BaseModel):
    """Response schema for PlayDay gallery data."""
    items: list[GalleryItemSchema] = Field(..., description="List of PlayDay gallery items")


class PlaybookCategory(str):
    """Playbook category type."""
    USECASE = "usecase"
    TREND = "trend"
    PROMPT = "prompt"
    HAI = "hai"
    TEAMS = "teams"


class PlaybookRequest(BaseModel):
    """Request schema for PlayBook data."""
    category: Literal["usecase", "trend", "prompt", "hai", "teams"] = Field(
        "usecase",
        description="PlayBook category"
    )


class PlaybookResponse(BaseModel):
    """Response schema for PlayBook data."""
    items: list[GalleryItemSchema] = Field(..., description="List of PlayBook items")
    category: Literal["usecase", "trend", "prompt", "hai", "teams"] = Field(
        ...,
        description="Requested category"
    )


class NoticeSchema(BaseModel):
    """Notice schema."""
    title: str = Field(..., description="Notice title")
    date: str = Field(..., description="Notice date (YYYY.MM.DD format)")
    badge: str = Field(..., description="Badge text")
    badgeColor: str = Field(..., description="Badge color (CSS color value)")


class NoticesResponse(BaseModel):
    """Response schema for notices data."""
    notices: list[NoticeSchema] = Field(..., description="List of notices")
