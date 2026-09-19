@echo off
title Retequenos - App movil (prototipo)
cd /d "%~dp0"
echo Abriendo la app movil en http://localhost:3000 ...
echo Para verla en tu celular, conectalo a la misma red WiFi y abre la direccion que aparece abajo.
start "" "http://localhost:3000"
powershell -NoProfile -ExecutionPolicy Bypass -File "tools\serve-app.ps1" -Port 3000 -Lan
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo No se pudo publicar en la red. Se abre solo en esta PC:
  powershell -NoProfile -ExecutionPolicy Bypass -File "tools\serve-app.ps1" -Port 3000
)
pause
