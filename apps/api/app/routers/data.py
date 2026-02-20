# Data retrieval API routes
"""Data endpoints for PlayDay, PlayBook, and Notices."""

from typing import Literal
from fastapi import APIRouter, Query, HTTPException, status

from app.schemas.data import (
    PlaydayResponse,
    PlaybookRequest,
    PlaybookResponse,
    NoticesResponse,
)
from app.services.data import (
    get_playday_items,
    get_playbook_items,
    get_notices,
)

router = APIRouter(prefix="/data", tags=["data"])


@router.get("/playday", response_model=PlaydayResponse)
async def get_playday() -> PlaydayResponse:
    """PlayDay 갤러리 데이터 조회."""
    try:
        items = await get_playday_items()
        return PlaydayResponse(items=items)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve PlayDay data: {str(e)}",
        )


@router.get("/playbook", response_model=PlaybookResponse)
async def get_playbook(
    category: Literal["usecase", "trend", "prompt", "hai", "teams"] = Query(
        "usecase", description="PlayBook category"
    ),
) -> PlaybookResponse:
    """PlayBook 데이터 조회."""
    try:
        items = await get_playbook_items(category)
        return PlaybookResponse(items=items, category=category)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve PlayBook data: {str(e)}",
        )


@router.get("/notices", response_model=NoticesResponse)
async def get_notices_data() -> NoticesResponse:
    """공지사항 데이터 조회."""
    try:
        notices = await get_notices()
        return NoticesResponse(notices=notices)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve notices: {str(e)}",
        )
