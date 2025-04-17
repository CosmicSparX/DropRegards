@echo off
echo Setting up environment...

:: Load environment variables from .env if it exists
if exist .env (
    for /f "tokens=*" %%a in (.env) do (
        set "%%a"
    )
)

:: Set required environment variables if not already set
if not defined FLASK_APP (
    set FLASK_APP=api/index.py
    echo Set environment variable: FLASK_APP
)

if not defined PYTHONPATH (
    set PYTHONPATH=.
    echo Set environment variable: PYTHONPATH
)

echo Starting Flask application...
flask run --debug 