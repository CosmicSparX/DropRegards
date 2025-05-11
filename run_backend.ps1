#!/usr/bin/env pwsh
Write-Host "Starting the DropRegards Backend API..." -ForegroundColor Cyan

# Set Python path to include current directory with full path
$env:PYTHONPATH = (Get-Location).Path

# Set Flask environment variables
$env:FLASK_APP = "api.index"
$env:FLASK_ENV = "development"

# Activate virtual environment if it exists
if (Test-Path "venv/Scripts/Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    & venv/Scripts/Activate.ps1
}
elseif (Test-Path "venv/bin/Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    & venv/bin/Activate.ps1
}
else {
    Write-Host "Virtual environment not found. Please run setup_venv.ps1 first." -ForegroundColor Red
    exit 1
}

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Yellow
try {
    $null = Get-Command pip -ErrorAction Stop
    $flaskInstalled = pip show flask 2>$null
    if (-not $flaskInstalled) {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        pip install -r api/requirements.txt
    }
}
catch {
    Write-Host "Error: pip not found. Please ensure Python is installed correctly." -ForegroundColor Red
    exit 1
}

# Start the Flask development server
Write-Host "Starting Flask server..." -ForegroundColor Green
try {
    python -m flask run --host=0.0.0.0 --port=5000 --debug
}
catch {
    Write-Host "Error starting Flask server: $_" -ForegroundColor Red
}

Write-Host "Backend server stopped." -ForegroundColor Cyan 