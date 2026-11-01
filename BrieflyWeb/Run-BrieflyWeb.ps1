$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$backendPath = Join-Path $projectRoot 'backend'
$envPath = Join-Path $backendPath '.env'
$envTemplatePath = Join-Path $projectRoot '.env.example'

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCommand) {
    throw 'Python 3.12 or newer is required. Install Python from https://www.python.org/downloads/ and enable Add python.exe to PATH.'
}

$pythonVersion = & python -c 'import sys; print("%d.%d" % sys.version_info[:2])'
$versionParts = $pythonVersion.Trim().Split('.')
if ([int]$versionParts[0] -lt 3 -or ([int]$versionParts[0] -eq 3 -and [int]$versionParts[1] -lt 12)) {
    throw "Python 3.12 or newer is required. Found Python $pythonVersion."
}

if (-not (Test-Path $envPath)) {
    Copy-Item -LiteralPath $envTemplatePath -Destination $envPath
    Write-Host 'Created backend/.env from .env.example.' -ForegroundColor Cyan
    Write-Host 'Add your own AI provider key to backend/.env to enable AI answers and summaries.' -ForegroundColor Yellow
}

Set-Location $backendPath
$venvPython = Join-Path $backendPath '.venv\Scripts\python.exe'
if (-not (Test-Path $venvPython)) {
    Write-Host 'Creating an isolated Python environment...' -ForegroundColor Cyan
    & python -m venv (Join-Path $backendPath '.venv')
    if ($LASTEXITCODE -ne 0) { throw 'Could not create the Python environment.' }
}

Write-Host 'Installing or checking BrieflyWeb API dependencies...' -ForegroundColor Cyan
& $venvPython -m pip install -e .
if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }

Write-Host 'Starting BrieflyWeb API at http://localhost:8000' -ForegroundColor Green
Write-Host 'Keep this window open while using the extension. Press Ctrl+C to stop.' -ForegroundColor DarkGray
& $venvPython -m uvicorn app.main:app --host 127.0.0.1 --port 8000