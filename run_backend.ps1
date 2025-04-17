# PowerShell script to run the Flask backend

# Load environment variables from .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^\s*([^#=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "Set environment variable: $key" -ForegroundColor DarkGray
        }
    }
}

# Set required environment variables if not loaded from .env
if (-not $env:FLASK_APP) {
    $env:FLASK_APP = "api/index.py"
    Write-Host "Set environment variable: FLASK_APP" -ForegroundColor DarkGray
}

if (-not $env:PYTHONPATH) {
    $env:PYTHONPATH = "."
    Write-Host "Set environment variable: PYTHONPATH" -ForegroundColor DarkGray
}

# Run the Flask application in development mode
Write-Host "Starting Flask application..." -ForegroundColor Green
flask run --debug 