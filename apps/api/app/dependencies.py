# FastAPI dependencies for authentication and database
"""Dependency injection functions for authentication and database sessions."""

from fastapi import Depends, HTTPException, status, Cookie
from sqlmodel import Session, create_engine
from jose import JWTError, jwt

from app.settings import settings
from app.services.allowlist import get_allowlists_service

# Database engine
engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)


def get_db_session():
    """Get database session."""
    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()


async def get_current_user(
    next_auth_session: str | None = Cookie(None, alias="next-auth.session-token"),
) -> dict[str, str]:
    """Get current authenticated user from NextAuth session cookie."""
    if not next_auth_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    
    # NextAuth JWT 검증
    secret = settings.NEXTAUTH_SECRET
    if not secret:
        # 개발 모드: 시크릿이 없으면 기본 검증만 수행
        return {"id": "dev-user", "email": "dev@example.com", "name": "Dev User"}
    
    try:
        # NextAuth JWT 디코딩 및 검증
        payload = jwt.decode(
            next_auth_session,
            secret,
            algorithms=["HS256"],
            options={"verify_signature": True, "verify_exp": True},
        )
        
        # NextAuth JWT 페이로드에서 사용자 정보 추출
        user_id = payload.get("sub") or payload.get("id") or "unknown"
        email = payload.get("email") or ""
        name = payload.get("name") or ""
        
        return {
            "id": str(user_id),
            "email": str(email),
            "name": str(name),
        }
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid session token: {str(e)}",
        )


async def require_operator(
    current_user: dict[str, str] = Depends(get_current_user),
) -> dict[str, str]:
    """Require operator role for endpoint access."""
    email = current_user.get("email", "").lower().strip()
    user_id = current_user.get("id", "").lower().strip()
    
    # 고정 운영자 체크
    FIXED_OPERATOR_EMAIL = "2501034@hdec.co.kr"
    if email == FIXED_OPERATOR_EMAIL or user_id == FIXED_OPERATOR_EMAIL:
        return current_user
    
    # allowlist에서 operator 목록 확인
    try:
        allowlists = await get_allowlists_service()
        operators = [op.lower().strip() for op in allowlists.get("operators", [])]
        
        if email in operators or user_id in operators:
            return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operator role required",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check operator role: {str(e)}",
        )
