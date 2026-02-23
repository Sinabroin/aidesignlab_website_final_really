@echo off
REM EPERM fix: close Cursor, dev server, browsers first. Run as Administrator.

echo Stopping Node processes...
taskkill /f /im node.exe 2>nul

timeout /t 2 /nobreak >nul

echo Cleaning node_modules...
if exist node_modules (
  rmdir /s /q node_modules 2>nul
  if exist node_modules (
    echo rmdir failed, trying move...
    move node_modules node_modules_backup 2>nul
  )
)
if exist apps\web\node_modules rmdir /s /q apps\web\node_modules 2>nul

echo.
echo Running npm install...
call npm install

echo.
echo Running prisma generate...
cd apps\web
call npx prisma generate
cd ..\..

echo.
echo Done. If prisma generate failed, close ALL programs (Cursor, browsers, etc.) and run:
echo   cd apps\web
echo   npx prisma generate
pause
