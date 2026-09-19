@echo off
title Retequenos - Web
cd /d "%~dp0"
if not exist "web\dist\index.html" (
  echo La web no esta compilada. Compilando...
  call "Compilar web.cmd" nopause
)
echo Abriendo la web en http://localhost:5173 ...
start "" "http://localhost:5173"
powershell -NoProfile -ExecutionPolicy Bypass -File "tools\serve-web.ps1" -Port 5173 -Lan
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo No se pudo publicar en la red. Se abre solo en esta PC:
  powershell -NoProfile -ExecutionPolicy Bypass -File "tools\serve-web.ps1" -Port 5173
)
pause
