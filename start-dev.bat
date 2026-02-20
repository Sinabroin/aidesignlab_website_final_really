@echo off
chcp 65001 >nul
echo ========================================
echo  개발 서버 시작 스크립트
echo ========================================
echo.

cd /d c:\projects\aidesignlab_website_final_really

echo [1/3] 포트 3002 사용 중인 프로세스 종료...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%a 2>nul
  echo       PID %%a 종료됨
)

echo [2/3] .next 캐시 삭제...
if exist "apps\web\.next" (
  rmdir /s /q "apps\web\.next"
  echo       캐시 삭제 완료
) else (
  echo       캐시 없음 - 건너뜀
)

echo [3/3] 개발 서버 시작...
echo.
echo http://localhost:3002 접속하세요.
echo 종료하려면 Ctrl+C 를 누르세요.
echo.
npm run dev:web

pause
