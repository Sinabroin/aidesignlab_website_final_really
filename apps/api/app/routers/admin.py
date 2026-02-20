# Admin API routes
"""Admin endpoints for allowlist management."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.allowlist import (
    AllowlistResponse,
    AddMemberRequest,
    AddMemberResponse,
    RemoveMemberRequest,
    RemoveMemberResponse,
)
from app.dependencies import require_operator
from app.services.allowlist import (
    get_allowlists_service,
    add_member_service,
    remove_member_service,
)

router = APIRouter(prefix="/admin/allowlist", tags=["admin"])


@router.get("", response_model=AllowlistResponse)
async def get_allowlists(
    current_user: dict[str, str] = Depends(require_operator),
) -> AllowlistResponse:
    """운영진·ACE 목록 조회."""
    try:
        data = await get_allowlists_service()
        return AllowlistResponse(
            operators=data["operators"],
            community=data["community"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve allowlists: {str(e)}",
        )


@router.post("", response_model=AddMemberResponse)
async def add_member(
    request: AddMemberRequest,
    current_user: dict[str, str] = Depends(require_operator),
) -> AddMemberResponse:
    """목록에 멤버 추가."""
    try:
        await add_member_service(request.email, request.role)
        return AddMemberResponse(
            ok=True,
            email=request.email,
            role=request.role,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add member: {str(e)}",
        )


@router.delete("", response_model=RemoveMemberResponse)
async def remove_member(
    request: RemoveMemberRequest,
    current_user: dict[str, str] = Depends(require_operator),
) -> RemoveMemberResponse:
    """목록에서 멤버 제거."""
    try:
        result = await remove_member_service(request.email, request.role)
        if not result["ok"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=result.get("error", "Cannot remove member"),
            )
        return RemoveMemberResponse(ok=True)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to remove member: {str(e)}",
        )
