#!/usr/bin/env pwsh
Write-Host "Setting up Python virtual environment for DropRegards..." -ForegroundColor Cyan

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Python 3.8 or higher." -ForegroundColor Yellow
    exit 1
}

# Check if virtual environment already exists
if (Test-Path "venv") {
    Write-Host "Virtual environment already exists." -ForegroundColor Yellow
    Write-Host "If you want to recreate it, delete the venv directory first." -ForegroundColor Yellow
    exit 0
}

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Green
python -m venv venv

# Determine activation script based on platform
$activateScript = if ($IsWindows -or $env:OS -match "Windows") { "venv\Scripts\Activate.ps1" } else { "venv/bin/Activate.ps1" }

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
& $activateScript

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install dependencies
Write-Host "Installing required packages..." -ForegroundColor Yellow
pip install -r api/requirements.txt

Write-Host "Virtual environment setup complete." -ForegroundColor Green
Write-Host "To activate, run: $activateScript" -ForegroundColor Cyan
Write-Host "To start the backend server, run: .\run_backend.ps1" -ForegroundColor Cyan 