<#
.SYNOPSIS
  Push Tranvas Go API backend to Hugging Face Spaces.
.DESCRIPTION
  Creates an ultra-clean deployment branch containing only the Go backend
  source code and Hugging Face Docker configuration, then pushes it to your Space.
.PARAMETER SpaceUrl
  The Git HTTPS URL of your Hugging Face Space.
  Example: https://huggingface.co/spaces/username/tranvas-api
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$SpaceUrl
)

$ErrorActionPreference = "Stop"

if (-not $SpaceUrl) {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Tranvas API -> Hugging Face Spaces Deployment Sync" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "Masukkan URL Space Git Hugging Face Anda:" -ForegroundColor Yellow
    Write-Host "(Contoh: https://huggingface.co/spaces/khairannoor/tranvas-api)" -ForegroundColor Gray
    $SpaceUrl = Read-Host "Space Git URL"
}

if (-not $SpaceUrl) {
    Write-Host "Error: Space Git URL tidak boleh kosong!" -ForegroundColor Red
    exit 1
}

$tempDir = Join-Path $env:TEMP ("tranvas-hf-" + (Get-Random))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "Menyiapkan file backend di temporary directory: $tempDir" -ForegroundColor Green

# Salin file backend yang diperlukan
Copy-Item "deploy\huggingface\Dockerfile" (Join-Path $tempDir "Dockerfile") -Force
Copy-Item "deploy\huggingface\README.md" (Join-Path $tempDir "README.md") -Force
Copy-Item "go.mod" (Join-Path $tempDir "go.mod") -Force
Copy-Item "go.sum" (Join-Path $tempDir "go.sum") -Force
Copy-Item "main.go" (Join-Path $tempDir "main.go") -Force
Copy-Item "api" (Join-Path $tempDir "api") -Recurse -Force
Copy-Item "backend" (Join-Path $tempDir "backend") -Recurse -Force

Push-Location $tempDir
try {
    git init -b main
    git config user.name "Tranvas Deployer"
    git config user.email "deploy@tranvas.com"
    git add .
    git commit -m "deploy: update Tranvas Go API backend for Hugging Face Spaces"
    
    Write-Host "Pushing ke Hugging Face Space: $SpaceUrl ..." -ForegroundColor Cyan
    git push $SpaceUrl main --force
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " BERHASIL DI-PUSH KE HUGGING FACE SPACES!" -ForegroundColor Green
    Write-Host " Silakan buka Space Anda untuk memantau proses build Docker." -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
}
finally {
    Pop-Location
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
