from flask import Blueprint, request, jsonify
from api.middleware.auth import token_required

# Initialize blueprint
nft_bp = Blueprint('nft', __name__)

# Get available NFT templates
@nft_bp.route('/templates', methods=['GET'])
def get_templates():
    """
    Get list of available NFT certificate templates
    """
    # Mock data for now - in production, these would be fetched from a database
    templates = [
        {
            'id': 'gratitude',
            'name': 'Certificate of Gratitude',
            'description': 'A beautiful certificate expressing gratitude',
            'previewImage': '/images/nft-certificate-1.jpg'
        },
        {
            'id': 'star',
            'name': 'Star Performer',
            'description': 'Recognize outstanding achievement',
            'previewImage': '/images/nft-certificate-2.jpg'
        },
        {
            'id': 'collaboration',
            'name': 'Collaboration Award',
            'description': 'Celebrate successful teamwork',
            'previewImage': '/images/nft-certificate-3.jpg'
        }
    ]
    
    return jsonify(templates)

# Generate NFT metadata
@nft_bp.route('/metadata', methods=['POST'])
@token_required
def generate_metadata(current_user):
    """
    Generate metadata for NFT certificate
    Request body: {
        templateId: string,
        recipient: string (username),
        message: string,
        amount: number
    }
    """
    data = request.json
    required_fields = ['templateId', 'recipient', 'message', 'amount']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400
    
    # Mock metadata generation - in production, this would be more sophisticated
    metadata = {
        'name': f"{data['templateId'].capitalize()} Certificate for {data['recipient']}",
        'description': f"Awarded for receiving {data['amount']} SOL with the message: \"{data['message']}\"",
        'image': f"/images/nft-certificate-{data['templateId']}.jpg",
        'attributes': [
            {
                'trait_type': 'Template',
                'value': data['templateId']
            },
            {
                'trait_type': 'Amount',
                'value': data['amount']
            },
            {
                'trait_type': 'Sender',
                'value': current_user['wallet_address'][:6] + '...' + current_user['wallet_address'][-4:]
            },
            {
                'trait_type': 'Date',
                'value': 'Current Date'  # Would use actual date in production
            }
        ]
    }
    
    return jsonify(metadata)

# Get NFT collection for a user
@nft_bp.route('/collection', methods=['GET'])
@token_required
def get_collection(current_user):
    """
    Get all NFT certificates owned by the current user
    """
    wallet_address = current_user['wallet_address']
    
    # TODO: Fetch NFTs from blockchain and/or database
    # nfts = get_user_nfts(wallet_address)
    
    # Mock data for now
    nfts = [
        {
            'mintAddress': 'NFT1MintAddress',
            'name': 'Certificate of Gratitude',
            'image': '/images/nft-certificate-1.jpg',
            'sender': 'alice',
            'message': 'Thanks for all your help!',
            'amount': 0.5,
            'date': '2023-09-01T12:00:00Z'
        },
        {
            'mintAddress': 'NFT2MintAddress',
            'name': 'Star Performer',
            'image': '/images/nft-certificate-2.jpg',
            'sender': 'carol',
            'message': 'Your code review saved us from a major bug!',
            'amount': 1.0,
            'date': '2023-09-03T15:45:00Z'
        }
    ]
    
    return jsonify(nfts) 