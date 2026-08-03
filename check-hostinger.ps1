$hostingerHost = $env:HOSTINGER_HOST
$hostingerPort = if ($env:HOSTINGER_PORT) { [int]$env:HOSTINGER_PORT } else { 65002 }
$hostingerUser = $env:HOSTINGER_USER

if (-not $hostingerHost -or -not $hostingerUser) {
  Write-Error 'Define HOSTINGER_HOST y HOSTINGER_USER antes de ejecutar este script.'
  exit 1
}

$credential = Get-Credential -UserName $hostingerUser -Message 'Credenciales SSH de Hostinger'
$session = New-PSSession -HostName $hostingerHost -Port $hostingerPort -Credential $credential -ErrorAction SilentlyContinue

if (-not $session) {
  Write-Error 'No se pudo establecer la conexion SSH.'
  exit 1
}

Invoke-Command -Session $session -ScriptBlock {
  Set-Location public_html
  Get-Location
  Test-Path 'dist/index.html'
  Test-Path 'server/server.js'
  git log --oneline -5
  git remote -v
}

Remove-PSSession $session
