@echo off
chcp 65001 >nul
cd /d "%~dp0"
"PO-Label-Dashboard\PO-Label-Dashboard.exe"
if errorlevel 1 pause

