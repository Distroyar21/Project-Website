@echo off
echo ========================================
echo   🔭 STARTING ASTRONOMY HUB SYSTEM
echo ========================================

:: Start AI Service
echo [1/3] Starting AI Service (FastAPI)...
start "AI Service" cmd /c "cd backend\astrohub (2)\astrohub && C:\Python313\python.exe app.py"

:: Start Node.js Backend
echo [2/3] Starting Node.js Backend...
start "Backend Server" cmd /c "cd backend && npm start"

:: Start Frontend
echo [3/3] Starting Frontend (Vite)...
start "Frontend" cmd /c "npm run dev"

echo.
echo ========================================
echo   🚀 ALL SYSTEMS ARE LAUNCHING!
echo ========================================
echo Close the individual terminal windows to stop the servers.
pause
