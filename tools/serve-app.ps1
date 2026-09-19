# Servidor local de la app movil (prototipo) + panel admin + API de pedidos en memoria. No necesita Node.
#   /            -> app/index.html   (prototipo movil; abrelo desde el celular en la misma red)
#   /admin       -> app/admin.html   (panel administrador)
#   /api/pedidos -> API en memoria (GET / POST / PATCH /api/pedidos/:id)
# Uso: powershell -ExecutionPolicy Bypass -File tools\serve-app.ps1 -Port 3000
param([int]$Port = 3000, [switch]$Lan)

$BaseDir = (Resolve-Path (Join-Path $PSScriptRoot '..\app')).Path
[Console]::OutputEncoding = [Text.Encoding]::UTF8

$Mime = @{
  '.html'='text/html; charset=UTF-8'; '.js'='text/javascript; charset=UTF-8'; '.css'='text/css; charset=UTF-8'
  '.json'='application/json; charset=UTF-8'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.gif'='image/gif'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.webp'='image/webp'
  '.woff'='font/woff'; '.woff2'='font/woff2'; '.ttf'='font/ttf'; '.md'='text/plain; charset=UTF-8'
}
$Orders = New-Object System.Collections.ArrayList

function Send-Bytes($res, [int]$code, [string]$type, [byte[]]$bytes) {
  $res.StatusCode = $code
  $res.ContentType = $type
  $res.Headers['Cache-Control'] = 'no-cache'
  $res.Headers['Access-Control-Allow-Origin'] = '*'
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
  $res.OutputStream.Close()
}
function Send-Text($res, [int]$code, [string]$type, [string]$text) {
  Send-Bytes $res $code $type ([Text.Encoding]::UTF8.GetBytes($text))
}

$listener = New-Object System.Net.HttpListener
# -Lan publica en toda la red local (requiere consola de administrador la primera vez): http://<IP-de-esta-PC>:3000
$prefix = if ($Lan) { "http://+:$Port/" } else { "http://localhost:$Port/" }
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch {
  Write-Host "No se pudo abrir el puerto $Port. Si usaste -Lan, ejecuta como administrador o usa: netsh http add urlacl url=http://+:$Port/ user=Todos"
  exit 1
}
$ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.*' } | Select-Object -First 1).IPAddress
Write-Host ""
Write-Host "======================================================"
Write-Host "RETEQUENOS - APP MOVIL (prototipo) + PANEL ADMIN"
Write-Host "======================================================"
Write-Host "App movil:            http://localhost:$Port"
Write-Host "Panel administrador:  http://localhost:$Port/admin"
Write-Host "API pedidos:          http://localhost:$Port/api/pedidos"
if ($Lan -and $ip) { Write-Host "Desde el celular:     http://${ip}:$Port  (misma red WiFi)" }
elseif ($ip) { Write-Host "Para verlo en el celular ejecuta:  Iniciar app (celular).cmd" }
Write-Host ""

while ($listener.IsListening) {
  try { $ctx = $listener.GetContext() } catch { break }
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
    $res.Headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, OPTIONS'
    $res.Headers['Access-Control-Allow-Headers'] = 'Content-Type'

    if ($req.HttpMethod -eq 'OPTIONS') { $res.StatusCode = 204; $res.Close(); continue }

    if ($path -eq '/api/pedidos') {
      if ($req.HttpMethod -eq 'GET') {
        $json = if ($Orders.Count -gt 0) { ConvertTo-Json @($Orders) -Depth 10 } else { '[]' }
        Send-Text $res 200 'application/json; charset=UTF-8' $json
        continue
      }
      if ($req.HttpMethod -eq 'POST') {
        $body = (New-Object IO.StreamReader($req.InputStream, [Text.Encoding]::UTF8)).ReadToEnd()
        try {
          $order = $body | ConvertFrom-Json
          $order | Add-Member -NotePropertyName createdAt -NotePropertyValue ((Get-Date).ToString('o')) -Force
          if (-not $order.status) { $order | Add-Member -NotePropertyName status -NotePropertyValue 'new' -Force }
          $order | Add-Member -NotePropertyName time -NotePropertyValue 'Recien recibido' -Force
          $Orders.Insert(0, $order)
          Write-Host ("[NUEVO PEDIDO] {0} - {1} - Total: S/ {2} ({3})" -f $order.id, $order.customer, $order.total, $order.payMethod)
          Send-Text $res 201 'application/json; charset=UTF-8' (ConvertTo-Json @{ ok = $true; order = $order } -Depth 10)
        } catch {
          Send-Text $res 400 'application/json; charset=UTF-8' '{"ok":false,"error":"JSON invalido"}'
        }
        continue
      }
    }
    if ($path.StartsWith('/api/pedidos/') -and ($req.HttpMethod -eq 'POST' -or $req.HttpMethod -eq 'PATCH')) {
      $ordId = $path.Split('/')[3]
      $body = (New-Object IO.StreamReader($req.InputStream, [Text.Encoding]::UTF8)).ReadToEnd()
      try {
        $data = $body | ConvertFrom-Json
        $found = $Orders | Where-Object { $_.id -eq $ordId } | Select-Object -First 1
        if ($found -and $data.status) { $found.status = $data.status }
        Send-Text $res 200 'application/json; charset=UTF-8' '{"ok":true}'
      } catch {
        Send-Text $res 400 'application/json; charset=UTF-8' '{"ok":false}'
      }
      continue
    }

    switch ($path) {
      { $_ -in '/', '/index.html', '/app', '/mobile' } { $path = '/index.html' }
      { $_ -in '/admin', '/admin/' }                    { $path = '/admin.html' }
    }

    $full = [IO.Path]::GetFullPath((Join-Path $BaseDir $path.TrimStart('/')))
    if (-not $full.StartsWith($BaseDir, [StringComparison]::OrdinalIgnoreCase)) {
      Send-Text $res 403 'text/plain; charset=UTF-8' 'Forbidden'; continue
    }
    if (Test-Path $full -PathType Container) { $full = Join-Path $full 'index.html' }
    if (-not (Test-Path $full -PathType Leaf)) {
      Send-Text $res 404 'text/plain; charset=UTF-8' "404 No encontrado: $path"; continue
    }
    $ext = [IO.Path]::GetExtension($full).ToLower()
    $type = if ($Mime.ContainsKey($ext)) { $Mime[$ext] } else { 'application/octet-stream' }
    Send-Bytes $res 200 $type ([IO.File]::ReadAllBytes($full))
  } catch {
    try { Send-Text $res 500 'text/plain; charset=UTF-8' ("500 " + $_.Exception.Message) } catch {}
  }
}
