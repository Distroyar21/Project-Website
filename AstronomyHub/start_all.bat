@echo off
echo ========================================
echo   🔭 STARTING ASTRONOMY HUB SYSTEM
echo ========================================

:: Start Gemini Cloud Service
echo [1/4] Starting Gemini AI API (Node)...
start "Gemini AI" cmd /k "cd /d "backend" && npm run ai-start"

:: Start AI Service (Python)
echo [2/4] Starting AI Service (Python)...
start "Offline AI" cmd /k "cd /d "backend\astrohub" && C:\Python313\python.exe app.py"

:: Start Node.js Backend
echo [3/4] Starting Main Backend...
start "Backend Server" cmd /k "cd /d "backend" && npm start"

:: Start Frontend
echo [4/4] Starting Astronomy Hub UI (Vite)...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   🚀 ALL SYSTEMS ARE LAUNCHING!
echo ========================================
echo Close the individual terminal windows to stop the servers.
pause
