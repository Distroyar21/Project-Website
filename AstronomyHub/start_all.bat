@echo off
echo ========================================
echo   🔭 STARTING ASTRONOMY HUB SYSTEM
echo ========================================

:: Start AI Service (Python)
echo [1/3] Starting AI Service (Python)...
start "AI Service" cmd /k "cd /d "backend\astrohub (2)\astrohub" && C:\Python313\python.exe app.py"

:: Start Node.js Backend
echo [2/3] Starting Main Backend...
start "Backend Server" cmd /k "cd /d "backend" && npm start"

:: Start Frontend
echo [3/3] Starting Astronomy Hub UI (Vite)...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   🚀 ALL SYSTEMS ARE LAUNCHING!
echo ========================================
echo Close the individual terminal windows to stop the servers.
pause
