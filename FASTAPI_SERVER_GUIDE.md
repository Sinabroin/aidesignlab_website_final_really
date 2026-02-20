# FastAPI 서버 실행 완벽 가이드

## 📋 목차
1. [사전 준비사항 확인](#1-사전-준비사항-확인)
2. [Python 버전 확인](#2-python-버전-확인)
3. [의존성 설치](#3-의존성-설치)
4. [환경 변수 확인](#4-환경-변수-확인)
5. [서버 실행](#5-서버-실행)
6. [서버 실행 후 확인](#6-서버-실행-후-확인)
7. [서버 실행 후 어떤 일이 일어나는가?](#7-서버-실행-후-어떤-일이-일어나는가)
8. [문제 해결](#8-문제-해결)

---

## 1. 사전 준비사항 확인

### 1-1. 터미널 열기
- **Windows**: PowerShell 또는 Command Prompt 열기
- **Mac/Linux**: Terminal 열기

### 1-2. 프로젝트 디렉토리로 이동
```powershell
# Windows PowerShell
cd c:\projects\aidesignlab_website_final_really

# Mac/Linux
cd ~/projects/aidesignlab_website_final_really
```

**확인 방법:**
```powershell
# 현재 위치 확인
pwd  # Mac/Linux
Get-Location  # Windows PowerShell

# 프로젝트 파일 확인
ls  # Mac/Linux
dir  # Windows
```

프로젝트 루트에 `apps/api` 폴더가 보여야 합니다.

---

## 2. Python 버전 확인

### 2-1. Python 설치 확인
```powershell
python --version
# 또는
python3 --version
```

**예상 출력:**
```
Python 3.12.0
```

**⚠️ 중요:** Python 3.12 이상이 필요합니다!

### 2-2. Python이 설치되지 않은 경우
- **Windows**: https://www.python.org/downloads/ 에서 다운로드
- **Mac**: `brew install python@3.12` 또는 공식 사이트에서 다운로드
- 설치 시 "Add Python to PATH" 옵션 체크 (Windows)

### 2-3. Python 경로 확인
```powershell
where python  # Windows
which python3  # Mac/Linux
```

---

## 3. 의존성 설치

### 3-1. uv 설치 확인 (권장 방법)

**uv란?**
- 빠른 Python 패키지 관리자
- pip보다 훨씬 빠르고 효율적

**설치 확인:**
```powershell
uv --version
```

**설치되지 않은 경우:**
```powershell
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Mac/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 3-2. uv를 사용한 의존성 설치 (방법 1 - 권장)

```powershell
# 1. API 디렉토리로 이동
cd apps/api

# 2. 의존성 설치
uv sync
```

**설치 과정:**
```
✓ Resolved 15 packages
✓ Downloaded 15 packages
✓ Installed 15 packages
```

**설치 시간:** 약 10-30초 (인터넷 속도에 따라 다름)

### 3-3. pip를 사용한 의존성 설치 (방법 2 - 대안)

uv가 설치되지 않은 경우:

```powershell
# 1. API 디렉토리로 이동
cd apps/api

# 2. 가상환경 생성 (선택사항이지만 권장)
python -m venv venv

# 3. 가상환경 활성화
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. 의존성 설치
pip install -e .
```

**설치 확인:**
```powershell
# 설치된 패키지 확인
uv pip list
# 또는
pip list
```

다음 패키지들이 보여야 합니다:
- fastapi
- uvicorn
- pydantic
- python-jose
- 등등...

---

## 4. 환경 변수 확인

### 4-1. .env 파일 확인

프로젝트 루트에 `.env` 파일이 있는지 확인:

```powershell
# 프로젝트 루트로 이동
cd c:\projects\aidesignlab_website_final_really

# 파일 확인
ls .env  # Mac/Linux
dir .env  # Windows
```

### 4-2. .env 파일 내용 확인

`.env` 파일이 있어야 하며, 다음 내용이 포함되어야 합니다:

```env
NEXTAUTH_SECRET=wx-J9wVtZtRLQtsvC1-LJab7TOumcv_OXaE0VpSM4DI
DATABASE_URL=sqlite:///./app.db
DEBUG=true
```

**⚠️ 중요:** `NEXTAUTH_SECRET`이 비어있으면 안 됩니다!

### 4-3. .env 파일이 없는 경우

프로젝트 루트에 `.env` 파일을 생성하고 위 내용을 입력하세요.

---

## 5. 서버 실행

### 5-1. API 디렉토리로 이동

```powershell
cd apps/api
```

### 5-2. 서버 실행 명령어

**uv를 사용한 경우 (권장):**
```powershell
uv run uvicorn app.main:app --reload --port 8000
```

**pip를 사용한 경우:**
```powershell
uvicorn app.main:app --reload --port 8000
```

**명령어 설명:**
- `uvicorn`: FastAPI 서버 실행 도구
- `app.main:app`: `app/main.py` 파일의 `app` 객체를 실행
- `--reload`: 코드 변경 시 자동 재시작 (개발 모드)
- `--port 8000`: 8000번 포트에서 실행

### 5-3. 서버 실행 확인

**성공적인 실행 시 출력:**
```
INFO:     Will watch for changes in these directories: ['C:\\projects\\aidesignlab_website_final_really\\apps\\api']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**이 메시지가 보이면 서버가 성공적으로 실행된 것입니다!** ✅

---

## 6. 서버 실행 후 확인

### 6-1. 브라우저에서 확인

**1. 루트 엔드포인트 확인:**
```
http://localhost:8000
```

**예상 응답:**
```json
{
  "message": "AI Design Lab API"
}
```

**2. 헬스 체크 확인:**
```
http://localhost:8000/health
```

**예상 응답:**
```json
{
  "status": "ok"
}
```

**3. API 문서 확인 (가장 중요!):**
```
http://localhost:8000/docs
```

이 페이지에서:
- 모든 API 엔드포인트 목록 확인 가능
- 각 API의 요청/응답 형식 확인 가능
- 직접 API 테스트 가능 (Try it out 버튼)

**4. ReDoc 문서 확인:**
```
http://localhost:8000/redoc
```

더 읽기 쉬운 형태의 API 문서입니다.

### 6-2. 터미널에서 확인 (curl 사용)

**Windows PowerShell:**
```powershell
# 루트 엔드포인트
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing

# 헬스 체크
Invoke-WebRequest -Uri http://localhost:8000/health -UseBasicParsing
```

**Mac/Linux:**
```bash
# 루트 엔드포인트
curl http://localhost:8000

# 헬스 체크
curl http://localhost:8000/health
```

---

## 7. 서버 실행 후 어떤 일이 일어나는가?

### 7-1. 서버 시작 과정

**1단계: Uvicorn 프로세스 시작**
```
INFO:     Started reloader process [12345] using WatchFiles
```
- 파일 변경 감지 프로세스 시작
- 코드 수정 시 자동 재시작 준비

**2단계: FastAPI 애플리케이션 로드**
```
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
```
- `app/main.py` 파일 실행
- FastAPI 앱 객체 생성
- 라우터 등록 (`admin`, `data`)
- 미들웨어 설정 (CORS)
- 환경 변수 로드 (`.env` 파일 읽기)

**3단계: 서버 준비 완료**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```
- HTTP 요청 대기 상태
- 포트 8000에서 리스닝 시작

### 7-2. 요청 처리 과정

**예시: 프론트엔드에서 `/api/v1/admin/allowlist` 호출 시**

```
1. 프론트엔드 (localhost:3000)
   ↓ HTTP GET 요청
   http://localhost:8000/api/v1/admin/allowlist
   Cookie: next-auth.session-token=xxx...

2. FastAPI 서버 (localhost:8000)
   ↓ 요청 수신
   
3. CORS 미들웨어
   ↓ Origin 확인 (localhost:3000 허용됨)
   
4. 라우터 매칭
   ↓ /api/v1/admin/allowlist → admin.router
   
5. 인증 검증
   ↓ dependencies.py의 require_operator()
   - 쿠키에서 JWT 토큰 추출
   - NEXTAUTH_SECRET으로 검증
   - allowlist에서 operator 권한 확인
   
6. 비즈니스 로직 실행
   ↓ services/allowlist.py의 get_allowlists_service()
   - data/allowlists.json 파일 읽기
   
7. 응답 반환
   ↓ JSON 형식으로 데이터 반환
   {
     "operators": ["2501034@hdec.co.kr", ...],
     "community": ["ace001@hdec.co.kr", ...]
   }
   
8. 프론트엔드 수신
   ↓ 응답 처리 및 UI 업데이트
```

### 7-3. 실시간 코드 변경 감지

**개발 모드 (`--reload` 옵션)에서:**

코드를 수정하면:
```
INFO:     Detected file change in 'app\\routers\\admin.py'. Reloading...
INFO:     Stopping reloader process [12345]
INFO:     Stopping server process [12346]
INFO:     Started reloader process [12347] using WatchFiles
INFO:     Started server process [12348]
INFO:     Application startup complete.
```

- 파일 변경 감지
- 서버 자동 재시작
- 새 코드로 다시 실행

**⚠️ 주의:** 재시작 중에는 잠시 요청이 처리되지 않을 수 있습니다.

### 7-4. 사용 가능한 API 엔드포인트

서버 실행 후 다음 엔드포인트들이 활성화됩니다:

**공개 엔드포인트:**
- `GET /` - 루트 (API 정보)
- `GET /health` - 헬스 체크
- `GET /docs` - Swagger UI 문서
- `GET /redoc` - ReDoc 문서
- `GET /openapi.json` - OpenAPI 스펙

**인증 필요 엔드포인트:**
- `GET /api/v1/admin/allowlist` - 운영진/ACE 목록 조회
- `POST /api/v1/admin/allowlist` - 멤버 추가
- `DELETE /api/v1/admin/allowlist` - 멤버 제거
- `GET /api/v1/data/playday` - PlayDay 데이터
- `GET /api/v1/data/playbook` - PlayBook 데이터
- `GET /api/v1/data/notices` - 공지사항 데이터

### 7-5. 로그 확인

서버 실행 중 터미널에서 다음 정보를 확인할 수 있습니다:

**요청 로그:**
```
INFO:     127.0.0.1:52341 - "GET /api/v1/admin/allowlist HTTP/1.1" 200 OK
```

- 요청 IP 주소
- 요청 메서드 및 경로
- HTTP 상태 코드
- 응답 시간

**에러 로그:**
```
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  ...
```

에러 발생 시 상세한 스택 트레이스가 출력됩니다.

---

## 8. 문제 해결

### 8-1. 포트가 이미 사용 중인 경우

**에러 메시지:**
```
ERROR:    [Errno 48] Address already in use
```

**해결 방법:**

**방법 1: 다른 포트 사용**
```powershell
uvicorn app.main:app --reload --port 8001
```

그리고 `.env.local`에서:
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**방법 2: 사용 중인 프로세스 종료**
```powershell
# Windows: 포트 사용 프로세스 찾기
netstat -ano | findstr :8000

# 프로세스 ID 확인 후 종료
taskkill /PID [프로세스ID] /F

# Mac/Linux: 포트 사용 프로세스 찾기
lsof -i :8000

# 프로세스 종료
kill -9 [PID]
```

### 8-2. 모듈을 찾을 수 없는 경우

**에러 메시지:**
```
ModuleNotFoundError: No module named 'app'
```

**해결 방법:**

**apps/api 디렉토리에서 실행했는지 확인:**
```powershell
# 현재 위치 확인
pwd  # Mac/Linux
Get-Location  # Windows

# apps/api 디렉토리로 이동
cd apps/api
```

### 8-3. 의존성이 설치되지 않은 경우

**에러 메시지:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**해결 방법:**
```powershell
cd apps/api
uv sync
# 또는
pip install -e .
```

### 8-4. 환경 변수를 찾을 수 없는 경우

**에러 메시지:**
```
ValueError: NEXTAUTH_SECRET is required
```

**해결 방법:**

1. 프로젝트 루트에 `.env` 파일이 있는지 확인
2. `.env` 파일에 `NEXTAUTH_SECRET`이 설정되어 있는지 확인
3. 파일 경로가 올바른지 확인 (프로젝트 루트에 있어야 함)

### 8-5. CORS 오류

**브라우저 콘솔 에러:**
```
Access to fetch at 'http://localhost:8000/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**해결 방법:**

`apps/api/app/settings.py`의 `CORS_ORIGINS`에 프론트엔드 URL 추가:
```python
CORS_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",  # 추가
]
```

### 8-6. 서버가 시작되지 않는 경우

**디버깅 단계:**

1. **Python 버전 확인:**
   ```powershell
   python --version
   ```
   Python 3.12 이상이어야 합니다.

2. **의존성 재설치:**
   ```powershell
   cd apps/api
   uv sync --refresh
   ```

3. **코드 문법 확인:**
   ```powershell
   python -m py_compile app/main.py
   ```

4. **환경 변수 확인:**
   ```powershell
   # .env 파일이 있는지 확인
   ls .env
   
   # 내용 확인
   cat .env  # Mac/Linux
   type .env  # Windows
   ```

---

## 🎉 완료!

서버가 성공적으로 실행되면:

1. ✅ 터미널에 "Uvicorn running on http://127.0.0.1:8000" 메시지 표시
2. ✅ 브라우저에서 http://localhost:8000 접속 가능
3. ✅ http://localhost:8000/docs 에서 API 문서 확인 가능
4. ✅ 프론트엔드에서 API 호출 가능

**다음 단계:**
- 프론트엔드 서버도 실행하여 전체 시스템 테스트
- API 문서에서 각 엔드포인트 테스트
- 실제 데이터로 API 동작 확인

---

## 📝 요약: 빠른 참조

```powershell
# 1. 프로젝트 루트로 이동
cd c:\projects\aidesignlab_website_final_really

# 2. API 디렉토리로 이동
cd apps/api

# 3. 의존성 설치 (처음 한 번만)
uv sync

# 4. 서버 실행
uv run uvicorn app.main:app --reload --port 8000

# 5. 브라우저에서 확인
# http://localhost:8000/docs
```

**서버 중지:** `Ctrl + C` (터미널에서)
