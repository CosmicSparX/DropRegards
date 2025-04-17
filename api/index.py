from flask import Flask, jsonify, request
from api.routes.auth import auth_bp
from api.routes.users import users_bp
from api.routes.regards import regards_bp
from api.routes.nft import nft_bp
from flask_cors import CORS
import os

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Register blueprints for different API routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(regards_bp, url_prefix='/api/regards')
app.register_blueprint(nft_bp, url_prefix='/api/nft')

# Root route for testing
@app.route('/')
def home():
    return jsonify({
        "message": "DropRegards API is running",
        "status": "success"
    })

# This is needed for local development
if __name__ == '__main__':
    app.run(debug=True) 