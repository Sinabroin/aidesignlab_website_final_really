# FastAPI 백엔드 실행 가이드

## 1. 의존성 설치

프로젝트 루트에서 실행:

```bash
# uv를 사용한 경우
cd apps/api
uv sync

# 또는 pip를 사용한 경우
cd apps/api
pip install -e .
```

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 (또는 `.env.local`):

```env
# NextAuth JWT 검증을 위한 시크릿 (프론트엔드와 동일해야 함)
NEXTAUTH_SECRET=your-nextauth-secret-here

# 데이터베이스 URL (선택사항, 기본값: sqlite:///./app.db)
DATABASE_URL=sqlite:///./app.db

# 디버그 모드 (개발 시)
DEBUG=true
```

## 3. 서버 실행

### 개발 모드 (자동 리로드)

```bash
cd apps/api
uvicorn app.main:app --reload --port 8000
```

### 프로덕션 모드

```bash
cd apps/api
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 4. API 문서 확인

서버 실행 후 브라우저에서 접속:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## 5. 헬스 체크

```bash
curl http://localhost:8000/health
```

## 문제 해결

### 포트가 이미 사용 중인 경우

다른 포트 사용:
```bash
uvicorn app.main:app --reload --port 8001
```

그리고 프론트엔드 `.env.local`에서 `NEXT_PUBLIC_API_URL=http://localhost:8001`로 변경

### 모듈을 찾을 수 없는 경우

`apps/api` 디렉토리에서 실행했는지 확인하거나, PYTHONPATH 설정:
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```
