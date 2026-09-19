@echo off
title Retequenos - Compilar web
cd /d "%~dp0web"
echo Compilando la web (TypeScript + Vite) con el Node integrado de Antigravity...
call "..\tools\node.cmd" node_modules\typescript\bin\tsc -b
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Hay errores de TypeScript. Revisa los mensajes de arriba.
  if not "%1"=="nopause" pause
  exit /b 1
)
call "..\tools\node.cmd" node_modules\vite\bin\vite.js build
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo La compilacion fallo.
  if not "%1"=="nopause" pause
  exit /b 1
)
echo.
echo Listo: web\dist actualizado. Sube el contenido de web\dist a tu hosting (Hostinger, Vercel, Netlify...).
if not "%1"=="nopause" pause
