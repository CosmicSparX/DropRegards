from flask import request, jsonify, current_app
from functools import wraps
import jwt
import os
from datetime import datetime

def token_required(f):
    """
    Decorator to make a route require a valid JWT token
    
    The token should be passed in the Authorization header using the Bearer scheme:
    Authorization: Bearer <token>
    
    If the token is valid, the decorated function will receive the user information
    as a 'current_user' parameter
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if Authorization header is present
        auth_header = request.headers.get('Authorization')
        if auth_header:
            # Extract token from "Bearer <token>"
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]
        
        if not token:
            return jsonify({
                'error': 'Authentication token is missing',
                'message': 'Access denied. Please provide a valid token.'
            }), 401
        
        try:
            # Decode the token
            secret_key = os.environ.get('JWT_SECRET_KEY', 'dev_secret_key')
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            # Check if token is expired
            if 'exp' in payload and datetime.utcnow().timestamp() > payload['exp']:
                return jsonify({
                    'error': 'Token expired',
                    'message': 'Authentication token has expired. Please log in again.'
                }), 401
            
            # Create current_user object from payload
            current_user = {
                'wallet_address': payload['sub']
            }
            
            # TODO: Optionally fetch more user data from database
            # user = find_user_by_wallet(current_user['wallet_address'])
            # if user:
            #     current_user.update(user)
            
        except jwt.ExpiredSignatureError:
            return jsonify({
                'error': 'Token expired',
                'message': 'Authentication token has expired. Please log in again.'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'error': 'Invalid token',
                'message': 'Invalid authentication token. Please log in again.'
            }), 401
        
        # Pass the current_user to the decorated function
        return f(current_user, *args, **kwargs)
    
    return decorated 