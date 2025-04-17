# PowerShell script to set up virtual environment for DropRegards backend

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Green
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
.\venv\Scripts\Activate

# Install dependencies
Write-Host "Installing dependencies from api/requirements.txt..." -ForegroundColor Green
pip install -r api/requirements.txt

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Green
$env:FLASK_APP = "api/index.py"
$env:FLASK_ENV = "development"
$env:JWT_SECRET_KEY = "dev_secret_key"  # Change this in production
$env:PYTHONPATH = "."

Write-Host ""
Write-Host "Virtual environment setup complete!" -ForegroundColor Green
Write-Host "To activate the environment in the future, run: .\venv\Scripts\Activate" -ForegroundColor Yellow
Write-Host "To run the Flask development server: flask run" -ForegroundColor Yellow
Write-Host "" 