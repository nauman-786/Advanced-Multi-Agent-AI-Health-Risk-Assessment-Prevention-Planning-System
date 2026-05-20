# PRESAGE Multi-Agent System Startup Script (PowerShell)
# This script starts both the API server and React frontend

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  PRESAGE Multi-Agent AI Health System" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting FastAPI backend server on port 8000..." -ForegroundColor Yellow
Write-Host "(This will run in the background)" -ForegroundColor Gray
Write-Host ""

# Start API server in background PowerShell job
$apiJob = Start-Job -ScriptBlock {
    Set-Location "$using:rootDir"
    uvicorn api.main:app --host 127.0.0.1 --port 8000
}

Write-Host "✓ API Server started (Job ID: $($apiJob.Id))" -ForegroundColor Green
Write-Host "  Endpoint: http://127.0.0.1:8000" -ForegroundColor Gray
Write-Host "  Health Check: http://127.0.0.1:8000/health" -ForegroundColor Gray
Write-Host ""

# Wait a moment for API to start
Start-Sleep -Seconds 2

Write-Host "Starting React frontend..." -ForegroundColor Yellow
Write-Host ""

# Start React frontend (this will block)
Set-Location "$rootDir\client"
npm run dev

Write-Host ""
Write-Host "React closed. API server is still running in the background." -ForegroundColor Yellow
Write-Host "To stop the API server, run: Stop-Job -Id $($apiJob.Id) | Remove-Job" -ForegroundColor Gray
