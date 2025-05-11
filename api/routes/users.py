from flask import Blueprint, request, jsonify
from api.middleware.auth import token_required
from api.models.user import create_user, update_user, find_user_by_username, find_user_by_wallet, username_exists
from api.utils.profile import get_profile_image

# Initialize blueprint
users_bp = Blueprint('users', __name__)

# Check if username is available
@users_bp.route('/check-username', methods=['GET'])
def check_username():
    """
    Check if a username is available
    Query parameters: ?username=value
    """
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username parameter is required"}), 400
    
    # Check if username exists in database
    available = not username_exists(username)
    
    return jsonify({
        "username": username,
        "available": available
    })

# Create new user profile
@users_bp.route('/profile', methods=['POST'])
@token_required
def create_profile(current_user):
    """
    Create a new user profile
    Request body: {
        username: string,
        displayName: string (optional),
        bio: string (optional),
        profileImage: string (optional)
    }
    """
    data = request.json
    wallet_address = current_user.get('walletAddress')
    username = data.get('username')
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    # Validate username format
    if not is_valid_username(username):
        return jsonify({"error": "Invalid username format"}), 400
    
    # Check if username is taken
    existing_user = find_user_by_username(username)
    if existing_user:
        return jsonify({"error": "Username is already taken"}), 409
    
    # Check if user already has a profile
    existing_profile = find_user_by_wallet(wallet_address)
    if existing_profile:
        return jsonify({"error": "User already has a profile"}), 409
    
    # Create user profile
    user_data = {
        'walletAddress': wallet_address,
        'username': username,
        'displayName': data.get('displayName', username),
        'bio': data.get('bio', ''),
        'profileImage': data.get('profileImage', '')
    }
    
    user = create_user(user_data)
    
    return jsonify({
        "message": "User profile created successfully",
        "user": user
    }), 201

# Get user profile
@users_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """
    Get the current user's profile
    """
    wallet_address = current_user.get('walletAddress')
    
    user = find_user_by_wallet(wallet_address)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Ensure user has a profile image (placeholder if needed)
    if not user.get('profileImage'):
        user['profileImage'] = get_profile_image(user)
    
    return jsonify(user)

# Update user profile
@users_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """
    Update the current user's profile
    Request body: {
        displayName: string (optional),
        bio: string (optional),
        profileImage: string (optional)
    }
    """
    data = request.json
    wallet_address = current_user.get('walletAddress')
    
    user = find_user_by_wallet(wallet_address)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Update user data
    update_data = {}
    if 'displayName' in data:
        update_data['displayName'] = data['displayName']
    if 'bio' in data:
        update_data['bio'] = data['bio']
    if 'profileImage' in data:
        update_data['profileImage'] = data['profileImage']
    
    updated_user = update_user(wallet_address, update_data)
    
    return jsonify(updated_user)

# Get user by username (public profile)
@users_bp.route('/username/<username>', methods=['GET'])
def get_user_by_username(username):
    """
    Get a user's public profile by username
    """
    user = find_user_by_username(username)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Remove private information
    public_user = {
        'username': user['username'],
        'displayName': user['displayName'],
        'bio': user['bio'],
        'profileImage': user.get('profileImage') or get_profile_image(user)
    }
    
    return jsonify(public_user)

# Helper function to validate username format
def is_valid_username(username):
    """
    Validate username format
    - Only alphanumeric characters, underscores, and hyphens
    - 3-20 characters long
    - No spaces
    """
    import re
    pattern = r'^[a-zA-Z0-9_-]{3,20}$'
    return bool(re.match(pattern, username)) 