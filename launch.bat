@echo off
title Jeet Launcher
cd /d "%~dp0"
if exist "%~dp0web\server.js" (
    cd /d "%~dp0web"
)
taskkill /f /im node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
start /b "" node server.js
powershell -Command "for ($i = 0; $i -lt 30; $i++) { try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:38244/api/status' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { break } } catch { Start-Sleep -Milliseconds 250 } }"
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://127.0.0.1:38244" --window-size=1200,800
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://127.0.0.1:38244" --window-size=1200,800
) else (
    start "" "http://127.0.0.1:38244"
)
exit
