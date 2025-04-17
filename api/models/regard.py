from datetime import datetime
from api.db import get_db
import pymongo

# Regard schema:
# {
#   _id: ObjectId,
#   sender: {
#     walletAddress: string,
#     username: string
#   },
#   recipient: {
#     walletAddress: string,
#     username: string
#   },
#   amount: number,
#   message: string,
#   includesNft: boolean,
#   nft: {
#     design: string,
#     mintAddress: string,
#     image: string,
#     name: string
#   },
#   transactionSignature: string,
#   status: string, // "pending", "completed", "failed"
#   createdAt: datetime
# }

def create_regard(regard_data):
    """
    Create a new regard in the database
    
    Args:
        regard_data (dict): Regard data including sender, recipient, amount, message, etc.
        
    Returns:
        dict: Created regard document
    """
    # This is a placeholder - in production, replace with actual database implementation
    
    # Example MongoDB implementation:
    # db = get_db()
    # regard_collection = db.regards
    
    # # Add timestamp
    # regard_data['createdAt'] = datetime.utcnow()
    
    # # Insert document
    # result = regard_collection.insert_one(regard_data)
    # regard_data['_id'] = result.inserted_id
    
    # return regard_data
    
    # Placeholder implementation
    regard_data['_id'] = 'mock-regard-id'
    regard_data['createdAt'] = datetime.utcnow()
    return regard_data

def get_regards_by_recipient(wallet_address, limit=10, offset=0):
    """
    Get regards received by a user
    
    Args:
        wallet_address (str): Recipient wallet address
        limit (int): Maximum number of records to return
        offset (int): Number of records to skip
        
    Returns:
        list: List of regard documents
    """
    # This is a placeholder - in production, replace with actual database implementation
    
    # Example MongoDB implementation:
    # db = get_db()
    # regard_collection = db.regards
    # 
    # cursor = regard_collection.find(
    #     {'recipient.walletAddress': wallet_address, 'status': 'completed'}
    # ).sort('createdAt', pymongo.DESCENDING).skip(offset).limit(limit)
    # 
    # return list(cursor)
    
    # Placeholder implementation
    return [
        {
            '_id': 'mock-regard-id-1',
            'sender': {
                'walletAddress': 'sender1_wallet',
                'username': 'alice'
            },
            'recipient': {
                'walletAddress': wallet_address,
                'username': 'recipient_username'
            },
            'amount': 0.5,
            'message': 'Thanks for all your help!',
            'includesNft': True,
            'nft': {
                'design': 'gratitude',
                'mintAddress': 'nft1_mint_address',
                'image': '/images/nft-certificate-1.jpg',
                'name': 'Certificate of Appreciation'
            },
            'transactionSignature': 'tx_signature_1',
            'status': 'completed',
            'createdAt': datetime.utcnow()
        },
        {
            '_id': 'mock-regard-id-2',
            'sender': {
                'walletAddress': 'sender2_wallet',
                'username': 'bob'
            },
            'recipient': {
                'walletAddress': wallet_address,
                'username': 'recipient_username'
            },
            'amount': 0.25,
            'message': 'Great collaboration!',
            'includesNft': False,
            'transactionSignature': 'tx_signature_2',
            'status': 'completed',
            'createdAt': datetime.utcnow()
        }
    ]

def get_regard_stats(wallet_address):
    """
    Get statistics for regards received by a user
    
    Args:
        wallet_address (str): Recipient wallet address
        
    Returns:
        dict: Statistics including totalSol, totalRegards, totalNfts, uniqueSenders
    """
    # This is a placeholder - in production, replace with actual database implementation
    
    # Example MongoDB implementation:
    # db = get_db()
    # regard_collection = db.regards
    
    # Pipeline for MongoDB aggregation
    # pipeline = [
    #     {'$match': {'recipient.walletAddress': wallet_address, 'status': 'completed'}},
    #     {'$group': {
    #         '_id': None,
    #         'totalSol': {'$sum': '$amount'},
    #         'totalRegards': {'$sum': 1},
    #         'totalNfts': {'$sum': {'$cond': ['$includesNft', 1, 0]}},
    #         'uniqueSenders': {'$addToSet': '$sender.walletAddress'}
    #     }},
    #     {'$project': {
    #         '_id': 0,
    #         'totalSol': 1,
    #         'totalRegards': 1,
    #         'totalNfts': 1,
    #         'uniqueSenders': {'$size': '$uniqueSenders'}
    #     }}
    # ]
    
    # result = list(regard_collection.aggregate(pipeline))
    # return result[0] if result else {
    #     'totalSol': 0,
    #     'totalRegards': 0,
    #     'totalNfts': 0,
    #     'uniqueSenders': 0
    # }
    
    # Placeholder implementation
    return {
        'totalSol': 0.75,
        'totalRegards': 2,
        'totalNfts': 1,
        'uniqueSenders': 2
    }

def get_regard_by_id(regard_id):
    """
    Get a regard by ID
    
    Args:
        regard_id (str): Regard ID
        
    Returns:
        dict: Regard document or None if not found
    """
    # This is a placeholder - in production, replace with actual database implementation
    
    # Example MongoDB implementation:
    # db = get_db()
    # regard_collection = db.regards
    # return regard_collection.find_one({'_id': ObjectId(regard_id)})
    
    # Placeholder implementation
    return {
        '_id': regard_id,
        'sender': {
            'walletAddress': 'sender_wallet',
            'username': 'sender_username'
        },
        'recipient': {
            'walletAddress': 'recipient_wallet',
            'username': 'recipient_username'
        },
        'amount': 0.5,
        'message': 'Thank you message',
        'includesNft': True,
        'nft': {
            'design': 'gratitude',
            'mintAddress': 'nft_mint_address',
            'image': '/images/nft-certificate-1.jpg',
            'name': 'Certificate of Appreciation'
        },
        'transactionSignature': 'tx_signature',
        'status': 'completed',
        'createdAt': datetime.utcnow()
    } 