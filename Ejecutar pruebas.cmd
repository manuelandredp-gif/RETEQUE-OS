@echo off
title Retequenos - Bateria de Pruebas Automatizadas
cd /d "%~dp0"
echo ======================================================
echo RETEQUENOS OS - EJECUTANDO PRUEBAS DEL SISTEMA
echo ======================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  node "tools\test-system.js"
) else (
  call "tools\node.cmd" "tools\test-system.js"
)

echo.
pause
