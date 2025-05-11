@echo off
echo Starting the DropRegards Backend API...

REM Set Python path to include current directory with full path
set PYTHONPATH=%cd%

REM Set Flask environment variables
set FLASK_APP=api.index
set FLASK_ENV=development

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Virtual environment not found. Please run setup_venv.bat first.
    exit /b 1
)

REM Check dependencies
echo Checking dependencies...
pip show flask >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Installing dependencies...
    pip install -r api\requirements.txt
)

REM Start the Flask development server
echo Starting Flask server...
python -m flask run --host=0.0.0.0 --port=5000 --debug

echo Backend server stopped. 