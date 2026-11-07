@echo off
title Jeet Launcher
cd /d "%~dp0"
taskkill /f /im node.exe >nul 2>&1
start /b "" node server.js
timeout /t 2 /nobreak >nul
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="http://127.0.0.1:38244" --window-size=1200,800
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="http://127.0.0.1:38244" --window-size=1200,800
) else (
    start "" "http://127.0.0.1:38244"
)
exit
