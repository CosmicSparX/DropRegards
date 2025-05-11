from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configure CORS
from flask_cors import CORS
cors_origin = os.environ.get('CORS_ORIGIN', '*')
CORS(app, resources={r"/api/*": {"origins": cors_origin}})

# Configure app
app.config.update(
    JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY', 'dev_secret_key'),
    DEBUG=os.environ.get('FLASK_ENV', 'development') == 'development'
)

# Import routes after app creation to avoid circular imports
from api.routes.auth import auth_bp
from api.routes.users import users_bp
from api.routes.regards import regards_bp

# Register blueprints for different API routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(regards_bp, url_prefix='/api/regards')

# Root route for testing
@app.route('/')
def home():
    return jsonify({
        "message": "DropRegards API is running",
        "status": "success",
        "version": "1.0.0"
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource was not found on this server."
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred."
    }), 500

# This is needed for local development
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG']) 