from datetime import datetime, UTC
from api.db import get_db
import pymongo
try:
    from bson import ObjectId
except ImportError:
    # Fallback for various pymongo package configurations
    from pymongo.bson.objectid import ObjectId

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
    db = get_db()
    regard_collection = db.regards
    
    # Add timestamp
    regard_data['createdAt'] = datetime.now(UTC)
    
    # Insert document
    result = regard_collection.insert_one(regard_data)
    regard_data['_id'] = str(result.inserted_id)
    
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
    db = get_db()
    regard_collection = db.regards
    
    cursor = regard_collection.find(
        {'recipient.walletAddress': wallet_address, 'status': 'completed'}
    ).sort('createdAt', pymongo.DESCENDING).skip(offset).limit(limit)
    
    result = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        result.append(doc)
    
    return result

def get_regard_stats(wallet_address):
    """
    Get statistics for regards received by a user
    
    Args:
        wallet_address (str): Recipient wallet address
        
    Returns:
        dict: Statistics including totalSol, totalRegards, uniqueSenders
    """
    db = get_db()
    regard_collection = db.regards
    
    # Pipeline for MongoDB aggregation
    pipeline = [
        {'$match': {'recipient.walletAddress': wallet_address, 'status': 'completed'}},
        {'$group': {
            '_id': None,
            'totalSol': {'$sum': '$amount'},
            'totalRegards': {'$sum': 1},
            'uniqueSenders': {'$addToSet': '$sender.walletAddress'}
        }},
        {'$project': {
            '_id': 0,
            'totalSol': 1,
            'totalRegards': 1,
            'uniqueSenders': {'$size': '$uniqueSenders'}
        }}
    ]
    
    result = list(regard_collection.aggregate(pipeline))
    return result[0] if result else {
        'totalSol': 0,
        'totalRegards': 0,
        'uniqueSenders': 0
    }

def get_regard_by_id(regard_id):
    """
    Get a regard by ID
    
    Args:
        regard_id (str): Regard ID
        
    Returns:
        dict: Regard document or None if not found
    """
    db = get_db()
    regard_collection = db.regards
    
    regard = regard_collection.find_one({'_id': ObjectId(regard_id)})
    if regard:
        regard['_id'] = str(regard['_id'])
    
    return regard 