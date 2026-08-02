$credential = New-Object System.Management.Automation.PSCredential('u811973920', (ConvertTo-SecureString 'Temp#Wayra2026!' -AsPlainText -Force))
$session = New-PSSession -HostName 5.183.10.192 -Port 65002 -Credential $credential -ErrorAction SilentlyContinue

if ($session) {
  Invoke-Command -Session $session -ScriptBlock {
    cd public_html
    Write-Host '=== Current Directory ===' 
    pwd
    Write-Host ''
    Write-Host '=== Check dist folder ==='
    if (Test-Path 'dist/index.html') {
      Write-Host '✅ dist/index.html EXISTS'
      Get-Item 'dist/index.html' | Select-Object FullName, Length
    } else {
      Write-Host '❌ dist/index.html NOT FOUND'
      if (Test-Path 'dist') {
        Write-Host 'dist folder exists but index.html missing'
        Get-ChildItem 'dist' -ErrorAction SilentlyContinue | Select-Object -First 5
      } else {
        Write-Host 'dist folder does not exist'
      }
    }
    Write-Host ''
    Write-Host '=== Check server.js ==='
    if (Test-Path 'server/server.js') {
      Write-Host '✅ server/server.js EXISTS'
    }
    Write-Host ''
    Write-Host '=== Git Status ==='
    git log --oneline -5
    Write-Host ''
    Write-Host '=== Git Remote ==='
    git remote -v
  }
  Remove-PSSession $session
} else {
  Write-Host 'SSH Connection failed - make sure PowerShell has OpenSSH installed'
  Write-Host 'Try: Add-WindowsCapability -Online -Name OpenSSH.Client'
}
