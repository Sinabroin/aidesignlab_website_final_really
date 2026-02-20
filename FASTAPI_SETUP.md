# FastAPI 백엔드 설정 가이드

## 완료된 작업

### ✅ 1. FastAPI 서버 실행 방법

**의존성 설치:**
```bash
cd apps/api
uv sync
# 또는
pip install -e .
```

**서버 실행:**
```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

**API 문서 확인:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

자세한 내용은 `apps/api/README.md` 참조

### ✅ 2. 환경 변수 설정 (완료)

**프론트엔드 (`.env.local`):**
- `NEXT_PUBLIC_API_URL=http://localhost:8000` ✅ 설정 완료
- `NEXTAUTH_SECRET=wx-J9wVtZtRLQtsvC1-LJab7TOumcv_OXaE0VpSM4DI` ✅ 설정 완료

**FastAPI 백엔드 (`.env`):**
- 프로젝트 루트에 `.env` 파일 생성 완료 ✅
- `NEXTAUTH_SECRET` 설정 완료 (프론트엔드와 동일한 값) ✅
- `DATABASE_URL=sqlite:///./app.db` (기본값) ✅
- `DEBUG=true` (개발 모드) ✅

**중요:** 
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다 (보안상 중요!)
- 다른 개발자들은 `.env.example` 파일을 참고하여 자신의 `.env` 파일을 생성해야 합니다
- `NEXTAUTH_SECRET`은 프론트엔드와 백엔드에서 **반드시 동일한 값**이어야 JWT 검증이 작동합니다

### ✅ 3. 인증 연동 완성

**구현 내용:**
- `apps/api/app/dependencies.py`에서 NextAuth JWT 토큰 검증 구현
- `python-jose[cryptography]` 라이브러리 추가
- `get_current_user()`: NextAuth 세션 쿠키에서 JWT 토큰 추출 및 검증
- `require_operator()`: operator 권한 체크 (allowlist 기반)

**동작 방식:**
1. 프론트엔드에서 FastAPI로 요청 시 `next-auth.session-token` 쿠키 자동 전송
2. FastAPI에서 쿠키의 JWT 토큰을 `NEXTAUTH_SECRET`으로 검증
3. 검증 성공 시 사용자 정보 반환
4. `require_operator` 의존성에서 allowlist 확인하여 operator 권한 체크

**주의사항:**
- 개발 모드에서 `NEXTAUTH_SECRET`이 없으면 기본 사용자로 인증 (보안 주의!)
- 프로덕션에서는 반드시 `NEXTAUTH_SECRET` 설정 필요

### ✅ 4. 데이터베이스 연동

**현재 상태:**
- `apps/api/app/services/data.py`에서 mockData를 JSON으로 읽어서 반환
- `data/mock_data.json` 파일 생성 (TypeScript mockData를 JSON으로 변환)

**구현된 함수:**
- `get_playday_items()`: PlayDay 갤러리 데이터
- `get_playbook_items(category)`: PlayBook 카테고리별 데이터
- `get_notices()`: 공지사항 데이터

**실제 DB 연동 방법 (TODO):**

1. **데이터베이스 모델 정의** (`apps/api/app/models/`):
```python
from sqlmodel import SQLModel, Field

class GalleryItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str
    author: str
    date: str
    category: str
    # ...
```

2. **서비스 레이어 수정** (`apps/api/app/services/data.py`):
```python
from sqlmodel import Session, select
from app.models import GalleryItem

async def get_playday_items(session: Session) -> list[GalleryItemSchema]:
    statement = select(GalleryItem).where(GalleryItem.category == "playday")
    items = session.exec(statement).all()
    return [_convert_to_schema(item) for item in items]
```

3. **라우터에서 DB 세션 주입**:
```python
@router.get("/playday", response_model=PlaydayResponse)
async def get_playday(
    session: Session = Depends(get_db_session),
) -> PlaydayResponse:
    items = await get_playday_items(session)
    return PlaydayResponse(items=items)
```

## 다음 단계

1. **FastAPI 서버 실행 확인**
   ```bash
   cd apps/api
   uvicorn app.main:app --reload --port 8000
   ```

2. **프론트엔드에서 API 호출 테스트**
   - 브라우저에서 http://localhost:3000 접속
   - 개발자 도구 Network 탭에서 `/api/v1/admin/allowlist` 호출 확인

3. **인증 테스트**
   - NextAuth로 로그인 후 admin 페이지 접근
   - FastAPI 로그에서 JWT 검증 성공 여부 확인

4. **실제 데이터베이스 연동** (선택사항)
   - PostgreSQL 등 DB 설정
   - SQLModel 모델 정의
   - 서비스 레이어에서 DB 쿼리로 교체

## 문제 해결

### 포트 충돌
- FastAPI 기본 포트 8000이 사용 중이면 다른 포트 사용:
  ```bash
  uvicorn app.main:app --reload --port 8001
  ```
- `.env.local`에서 `NEXT_PUBLIC_API_URL=http://localhost:8001`로 변경

### 인증 실패
- `NEXTAUTH_SECRET`이 프론트엔드와 동일한지 확인
- 쿠키가 제대로 전송되는지 확인 (브라우저 개발자 도구 → Application → Cookies)

### CORS 오류
- `apps/api/app/settings.py`의 `CORS_ORIGINS`에 프론트엔드 URL 추가

## 파일 구조

```
apps/api/
├── app/
│   ├── main.py              # FastAPI 앱 진입점
│   ├── settings.py          # 설정 (환경 변수)
│   ├── dependencies.py      # 인증/DB 의존성
│   ├── schemas/             # Pydantic 스키마
│   │   ├── allowlist.py
│   │   ├── data.py
│   │   └── common.py
│   ├── routers/             # API 엔드포인트
│   │   ├── admin.py
│   │   └── data.py
│   └── services/            # 비즈니스 로직
│       ├── allowlist.py
│       └── data.py
├── pyproject.toml           # Python 의존성
└── README.md                # 상세 실행 가이드

apps/web/
├── lib/api/                 # API 클라이언트
│   ├── client.ts
│   ├── types.ts
│   ├── admin.ts
│   └── data.ts
└── .env.local               # 환경 변수 (NEXT_PUBLIC_API_URL)

data/
├── allowlists.json          # 권한 목록
└── mock_data.json           # Mock 데이터 (JSON)
```
