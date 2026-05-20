@echo off
REM Start PRESAGE Multi-Agent System on Windows

echo.
echo ===============================================
echo  PRESAGE Multi-Agent AI Health System
echo ===============================================
echo.

REM Start the API server in one terminal
echo Starting FastAPI backend server on port 8000...
echo.
start cmd /k "cd /d %~dp0 && uvicorn api.main:app --host 127.0.0.1 --port 8000"

timeout /t 3

REM Start the React frontend in another terminal
echo Starting React frontend...
echo.
start cmd /k "cd /d %~dp0\client && npm run dev"

echo.
echo ===============================================
echo API Server: http://127.0.0.1:8000
echo React UI: http://localhost:3000
echo ===============================================
echo.
