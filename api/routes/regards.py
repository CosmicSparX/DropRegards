from flask import Blueprint, request, jsonify
from api.middleware.auth import token_required
from api.models.regard import create_regard, get_regards_by_recipient, get_regard_stats

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
        includeNft: boolean,
        nftDesign: string (optional),
        transactionSignature: string
    }
    """
    data = request.json
    sender_wallet = current_user['wallet_address']
    
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
    
    # TODO: Verify the transaction on Solana blockchain
    # is_valid = verify_transaction(data['transactionSignature'], sender_wallet, recipient_wallet, amount)
    # if not is_valid:
    #     return jsonify({"error": "Invalid transaction"}), 400
    
    # Create regard object
    regard_data = {
        'sender': {
            'walletAddress': sender_wallet,
            # TODO: Get sender username from database
            'username': 'sender_username'
        },
        'recipient': {
            # TODO: Get recipient wallet address from database using the username
            'walletAddress': 'recipient_wallet_address',
            'username': data['recipient']
        },
        'amount': amount,
        'message': data['message'],
        'includesNft': data.get('includeNft', False),
        'transactionSignature': data['transactionSignature'],
        'status': 'completed',
        'createdAt': None  # Will be set by the database
    }
    
    # Handle NFT if included
    if regard_data['includesNft']:
        regard_data['nft'] = {
            'design': data.get('nftDesign', 'default'),
            # These fields will be populated after NFT creation
            'mintAddress': None,
            'image': None,
            'name': None
        }
        
        # TODO: Create NFT using Metaplex
        # nft_result = create_nft(regard_data)
        # regard_data['nft']['mintAddress'] = nft_result['mintAddress']
        # regard_data['nft']['image'] = nft_result['image']
        # regard_data['nft']['name'] = nft_result['name']
    
    # TODO: Save regard to database
    # regard = create_regard(regard_data)
    
    return jsonify({
        "message": "Regard sent successfully",
        "regard": regard_data
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
    wallet_address = current_user['wallet_address']
    limit = request.args.get('limit', 10, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    # TODO: Fetch regards from database
    # regards = get_regards_by_recipient(wallet_address, limit, offset)
    
    # Mock data for now
    regards = [
        {
            'id': '1',
            'sender': {
                'walletAddress': 'sender1_wallet',
                'username': 'alice'
            },
            'amount': 0.5,
            'message': 'Thanks for all your help!',
            'includesNft': True,
            'nft': {
                'design': 'gratitude',
                'image': '/images/nft-certificate-1.jpg',
                'name': 'Certificate of Appreciation'
            },
            'timestamp': '2023-09-01T12:00:00Z'
        },
        {
            'id': '2',
            'sender': {
                'walletAddress': 'sender2_wallet',
                'username': 'bob'
            },
            'amount': 0.25,
            'message': 'Great collaboration!',
            'includesNft': False,
            'timestamp': '2023-09-02T14:30:00Z'
        }
    ]
    
    return jsonify(regards)

# Get user stats
@regards_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    """
    Get statistics for the current user's received regards
    """
    wallet_address = current_user['wallet_address']
    
    # TODO: Calculate stats from database
    # stats = get_regard_stats(wallet_address)
    
    # Mock data for now
    stats = {
        'totalSol': 0.75,
        'totalRegards': 2,
        'totalNfts': 1,
        'uniqueSenders': 2
    }
    
    return jsonify(stats)

# Get public stats for a user by username
@regards_bp.route('/public-stats/<username>', methods=['GET'])
def get_public_stats(username):
    """
    Get public statistics for a user by username
    """
    # TODO: Look up user by username and get their wallet address
    # user = find_user_by_username(username)
    # if not user:
    #     return jsonify({"error": "User not found"}), 404
    # wallet_address = user['walletAddress']
    
    # TODO: Calculate stats from database
    # stats = get_regard_stats(wallet_address)
    
    # Mock data for now
    stats = {
        'totalRegards': 2,
        'totalNfts': 1,
        'uniqueSenders': 2
    }
    
    return jsonify(stats) 