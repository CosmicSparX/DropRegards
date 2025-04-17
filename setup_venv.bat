@echo off
echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies from api/requirements.txt...
pip install -r api/requirements.txt

echo Setting environment variables...
set FLASK_APP=api/index.py
set FLASK_ENV=development
set JWT_SECRET_KEY=dev_secret_key
set PYTHONPATH=.

echo.
echo Virtual environment setup complete!
echo To activate the environment in the future, run: venv\Scripts\activate
echo To run the Flask development server: flask run
echo. 