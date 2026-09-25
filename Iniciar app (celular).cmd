@echo off
title Retequenos - App movil y KDS (Produccion Local)
cd /d "%~dp0"
echo ======================================================
echo RETEQUENOS OS - Servidor Seguro y Hub Operativo
echo ======================================================
echo Abriendo la app en http://localhost:3000 ...
start "" "http://localhost:3000"

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  node "tools\server.js" --port 3000 -Lan
) else (
  call "tools\node.cmd" "tools\server.js" --port 3000 -Lan
)

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [ERROR] No se pudo iniciar el servidor Node.js.
  pause
)

