# Servidor estatico para la web compilada (web/dist) con fallback SPA para React Router. No necesita Node.
# Uso: powershell -ExecutionPolicy Bypass -File tools\serve-web.ps1 -Port 5173
param([int]$Port = 5173, [switch]$Lan)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$Root = Join-Path $PSScriptRoot '..\web\dist'
if (-not (Test-Path (Join-Path $Root 'index.html'))) {
  Write-Host "No existe web\dist. Ejecuta primero: Compilar web.cmd"
  exit 1
}
$Root = (Resolve-Path $Root).Path

$Mime = @{
  '.html'='text/html; charset=UTF-8'; '.js'='text/javascript; charset=UTF-8'; '.mjs'='text/javascript; charset=UTF-8'
  '.css'='text/css; charset=UTF-8'; '.json'='application/json; charset=UTF-8'; '.map'='application/json'
  '.webmanifest'='application/manifest+json'; '.txt'='text/plain; charset=UTF-8'
  '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.gif'='image/gif'; '.svg'='image/svg+xml'
  '.ico'='image/x-icon'; '.webp'='image/webp'; '.avif'='image/avif'
  '.woff'='font/woff'; '.woff2'='font/woff2'; '.ttf'='font/ttf'
}

function Send-File($res, [string]$file, [int]$code = 200) {
  $ext = [IO.Path]::GetExtension($file).ToLower()
  $type = if ($Mime.ContainsKey($ext)) { $Mime[$ext] } else { 'application/octet-stream' }
  $bytes = [IO.File]::ReadAllBytes($file)
  $res.StatusCode = $code
  $res.ContentType = $type
  $res.Headers['Cache-Control'] = if ($ext -eq '.html') { 'no-cache' } else { 'public, max-age=3600' }
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
  $res.OutputStream.Close()
}

$listener = New-Object System.Net.HttpListener
$prefix = if ($Lan) { "http://+:$Port/" } else { "http://localhost:$Port/" }
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch {
  Write-Host "No se pudo abrir el puerto $Port. Si usaste -Lan, ejecuta como administrador."
  exit 1
}
$ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*' } | Select-Object -First 1).IPAddress
Write-Host ""
Write-Host "RETEQUENOS WEB sirviendo $Root"
Write-Host "   http://localhost:$Port"
if ($Lan -and $ip) { Write-Host "   Desde el celular: http://${ip}:$Port" }
Write-Host ""

$index = Join-Path $Root 'index.html'
while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $req = $ctx.Request; $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    $full = [IO.Path]::GetFullPath((Join-Path $Root $path.TrimStart('/')))
    if (-not $full.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403; $res.Close(); continue
    }
    if (Test-Path $full -PathType Leaf) {
      Send-File $res $full
    } elseif ((Test-Path $full -PathType Container) -and (Test-Path (Join-Path $full 'index.html'))) {
      Send-File $res (Join-Path $full 'index.html')
    } else {
      Send-File $res $index
    }
  } catch {
    try { $res.StatusCode = 500; $res.Close() } catch {}
  }
}
