"""
WSGI entry point for the DropRegards API application.
This file is used for production deployment with uWSGI or Gunicorn.
"""

import os
import sys

# Ensure the project root is in the Python path
app_path = os.path.dirname(os.path.abspath(__file__))
if app_path not in sys.path:
    sys.path.insert(0, app_path)

# Import the Flask application
from api.index import app

# This allows running the application with: gunicorn wsgi:app
if __name__ == "__main__":
    app.run() 