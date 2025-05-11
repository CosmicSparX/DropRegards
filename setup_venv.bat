@echo off
echo Setting up Python virtual environment for DropRegards...

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Python is not installed or not in PATH.
    echo Please install Python 3.8 or higher.
    exit /b 1
)

REM Check if virtual environment already exists
if exist venv (
    echo Virtual environment already exists.
    echo If you want to recreate it, delete the venv directory first.
    exit /b 0
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo Installing required packages...
pip install -r api\requirements.txt

echo Virtual environment setup complete.
echo To activate, run: venv\Scripts\activate.bat
echo To start the backend server, run: run_backend.bat 