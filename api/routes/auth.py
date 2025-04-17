from flask import Blueprint, request, jsonify
import jwt
import os
from datetime import datetime, timedelta
from api.utils.solana import verify_wallet_signature
from api.models.user import find_user_by_wallet

# Initialize blueprint
auth_bp = Blueprint('auth', __name__)

# Generate a nonce for the wallet to sign
@auth_bp.route('/nonce', methods=['POST'])
def generate_nonce():
    """
    Generate a unique nonce for wallet signature verification
    Request body: { walletAddress: string }
    """
    wallet_address = request.json.get('walletAddress')
    if not wallet_address:
        return jsonify({"error": "Wallet address is required"}), 400
    
    # In a real implementation, store this nonce in a database with an expiry
    # For simplicity, we're using a timestamp-based nonce
    nonce = f"Sign this message to authenticate with DropRegards: {datetime.now().timestamp()}"
    
    return jsonify({
        "nonce": nonce
    })

# Verify wallet signature and authenticate user
@auth_bp.route('/verify-signature', methods=['POST'])
def verify_signature():
    """
    Verify the wallet signature and authenticate the user
    Request body: {
        walletAddress: string,
        signature: string,
        nonce: string
    }
    """
    data = request.json
    wallet_address = data.get('walletAddress')
    signature = data.get('signature')
    nonce = data.get('nonce')
    
    if not all([wallet_address, signature, nonce]):
        return jsonify({"error": "Wallet address, signature, and nonce are required"}), 400
    
    # TODO: Implement actual signature verification
    # is_valid = verify_wallet_signature(wallet_address, signature, nonce)
    is_valid = True  # Placeholder for now
    
    if not is_valid:
        return jsonify({"error": "Invalid signature"}), 401
    
    # Find or create user
    # TODO: Implement user lookup or creation
    # user = find_user_by_wallet(wallet_address)
    
    # Generate JWT token
    # In production, use a secure secret key
    secret_key = os.environ.get('JWT_SECRET_KEY', 'dev_secret_key')
    token = jwt.encode({
        'sub': wallet_address,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=1)
    }, secret_key, algorithm='HS256')
    
    return jsonify({
        "token": token,
        "walletAddress": wallet_address
    })

# Logout route
@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout user (client-side should clear token)
    """
    return jsonify({"message": "Logged out successfully"}) 