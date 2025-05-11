from flask import Blueprint, request, jsonify
from api.middleware.auth import token_required
from api.models.regard import create_regard, get_regards_by_recipient, get_regard_stats
from api.models.user import find_user_by_username
from api.utils.solana import verify_transaction
from api.utils.profile import get_profile_image

# Initialize blueprint
regards_bp = Blueprint('regards', __name__)

# Send a regard (SOL + message)
@regards_bp.route('/send', methods=['POST'])
@token_required
def send_regard(current_user):
    """
    Send SOL with a message to another user
    Request body: {
        recipient: string (username),
        amount: number,
        message: string,
        transactionSignature: string
    }
    """
    data = request.json
    sender_wallet = current_user.get('walletAddress')
    sender_username = current_user.get('username')
    
    # Validate required fields
    required_fields = ['recipient', 'amount', 'message', 'transactionSignature']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400
    
    # Validate amount
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({"error": "Amount must be greater than 0"}), 400
    except ValueError:
        return jsonify({"error": "Invalid amount format"}), 400
    
    # Get recipient user
    recipient_user = find_user_by_username(data['recipient'])
    if not recipient_user:
        return jsonify({"error": "Recipient not found"}), 404
    
    recipient_wallet = recipient_user.get('walletAddress')
    
    # Verify the transaction on Solana blockchain
    is_valid = verify_transaction(
        data['transactionSignature'], 
        sender_wallet, 
        recipient_wallet, 
        amount
    )
    
    if not is_valid:
        return jsonify({"error": "Invalid transaction"}), 400
    
    # Create regard object
    regard_data = {
        'sender': {
            'walletAddress': sender_wallet,
            'username': sender_username
        },
        'recipient': {
            'walletAddress': recipient_wallet,
            'username': data['recipient']
        },
        'amount': amount,
        'message': data['message'],
        'transactionSignature': data['transactionSignature'],
        'status': 'completed'
    }
    
    # Save regard to database
    regard = create_regard(regard_data)
    
    return jsonify({
        "message": "Regard sent successfully",
        "regard": regard
    }), 201

# Get list of regards for current user
@regards_bp.route('/list', methods=['GET'])
@token_required
def get_user_regards(current_user):
    """
    Get all regards received by the current user
    Query parameters:
    - limit: number (default 10)
    - offset: number (default 0)
    """
    wallet_address = current_user.get('walletAddress')
    limit = request.args.get('limit', 10, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    # Fetch regards from database
    regards = get_regards_by_recipient(wallet_address, limit, offset)
    
    # Add placeholder images for any senders without profile images
    for regard in regards:
        # Add sender information if needed
        if 'sender' in regard and 'username' in regard['sender'] and 'profileImage' not in regard['sender']:
            # Get full user info for the sender
            sender = find_user_by_username(regard['sender']['username'])
            if sender:
                regard['sender']['profileImage'] = sender.get('profileImage') or get_profile_image(sender)
            else:
                regard['sender']['profileImage'] = get_profile_image({'username': regard['sender']['username']})
    
    return jsonify(regards)

# Get user stats
@regards_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    """
    Get statistics for the current user's received regards
    """
    wallet_address = current_user.get('walletAddress')
    
    # Calculate stats from database
    stats = get_regard_stats(wallet_address)
    
    return jsonify(stats)

# Get public stats for a user by username
@regards_bp.route('/public-stats/<username>', methods=['GET'])
def get_public_stats(username):
    """
    Get public statistics for a user by username
    """
    # Look up user by username and get their wallet address
    user = find_user_by_username(username)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    wallet_address = user.get('walletAddress')
    
    # Calculate stats from database
    stats = get_regard_stats(wallet_address)
    
    # Remove totalSol for privacy in public stats
    if 'totalSol' in stats:
        del stats['totalSol']
    
    return jsonify(stats) 