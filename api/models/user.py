from datetime import datetime, UTC
from api.db import get_db
import pymongo
try:
    from bson import ObjectId
except ImportError:
    # Fallback for various pymongo package configurations
    from pymongo.bson.objectid import ObjectId

# User schema:
# {
#   _id: ObjectId,
#   walletAddress: string,
#   username: string,
#   displayName: string,
#   bio: string,
#   profileImage: string,
#   createdAt: datetime,
#   updatedAt: datetime
# }

def create_user(user_data):
    """
    Create a new user in the database
    
    Args:
        user_data (dict): User data including walletAddress, username, etc.
        
    Returns:
        dict: Created user document
    """
    db = get_db()
    user_collection = db.users
    
    # Add timestamps
    now = datetime.now(UTC)
    user_data['createdAt'] = now
    user_data['updatedAt'] = now
    
    # Insert document
    result = user_collection.insert_one(user_data)
    user_data['_id'] = str(result.inserted_id)
    
    return user_data

def update_user(wallet_address, update_data):
    """
    Update a user in the database
    
    Args:
        wallet_address (str): Wallet address of the user to update
        update_data (dict): Fields to update
        
    Returns:
        dict: Updated user document or None if user not found
    """
    db = get_db()
    user_collection = db.users
    
    # Add updated timestamp
    update_data['updatedAt'] = datetime.now(UTC)
    
    # Update document
    result = user_collection.find_one_and_update(
        {'walletAddress': wallet_address},
        {'$set': update_data},
        return_document=pymongo.ReturnDocument.AFTER
    )
    
    if result:
        result['_id'] = str(result['_id'])
    
    return result

def find_user_by_wallet(wallet_address):
    """
    Find a user by wallet address
    
    Args:
        wallet_address (str): Wallet address to search for
        
    Returns:
        dict: User document or None if not found
    """
    db = get_db()
    user_collection = db.users
    user = user_collection.find_one({'walletAddress': wallet_address})
    
    if user:
        user['_id'] = str(user['_id'])
    
    return user

def find_user_by_username(username):
    """
    Find a user by username
    
    Args:
        username (str): Username to search for
        
    Returns:
        dict: User document or None if not found
    """
    db = get_db()
    user_collection = db.users
    user = user_collection.find_one({'username': username})
    
    if user:
        user['_id'] = str(user['_id'])
    
    return user

def username_exists(username):
    """
    Check if a username already exists in the database
    
    Args:
        username (str): Username to check
        
    Returns:
        bool: True if username exists, False otherwise
    """
    db = get_db()
    user_collection = db.users
    return user_collection.count_documents({'username': username}) > 0 