# FastAPI 서버 빠른 시작 가이드

## 문제: `uv` 명령어가 인식되지 않는 경우

`uv`가 설치되지 않았거나 PATH에 없는 경우, `pip`를 사용하여 서버를 실행할 수 있습니다.

## 해결 방법

### 방법 1: pip 사용 (권장 - 이미 완료됨 ✅)

```powershell
# 1. API 디렉토리로 이동
cd c:\projects\aidesignlab_website_final_really\apps\api

# 2. 의존성 설치 (이미 완료됨)
python -m pip install -e .

# 3. 서버 실행
python -m uvicorn app.main:app --reload --port 8000
```

### 방법 2: uv 설치 후 사용

**Windows PowerShell에서:**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

설치 후 새 터미널을 열고:
```powershell
cd c:\projects\aidesignlab_website_final_really\apps\api
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

## 서버 실행 확인

서버가 정상적으로 실행되면:

1. **터미널 메시지 확인:**
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   INFO:     Application startup complete.
   ```

2. **브라우저에서 확인:**
   - http://localhost:8000 - API 정보
   - http://localhost:8000/health - 헬스 체크
   - http://localhost:8000/docs - **API 문서 (가장 중요!)**

## 서버 중지

터미널에서 `Ctrl + C`를 누르면 서버가 중지됩니다.

## 주의사항

- `uvicorn` 명령어가 직접 인식되지 않으면 `python -m uvicorn`을 사용하세요
- 서버 실행 중에는 터미널 창을 닫지 마세요
- 포트 8000이 이미 사용 중이면 `--port 8001` 등 다른 포트를 사용하세요
