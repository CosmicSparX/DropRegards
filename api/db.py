import os
import pymongo
from pymongo import MongoClient
import certifi

# Singleton pattern for database connection
_db = None

def get_db():
    """
    Get a MongoDB database connection
    Uses singleton pattern to reuse the same connection
    
    Returns:
        pymongo.database.Database: MongoDB database instance
    """
    global _db
    if _db is not None:
        return _db
    
    # Get MongoDB connection string from environment variable
    mongo_uri = os.environ.get('MONGODB_URI')
    
    if not mongo_uri:
        # Use a default connection string for local development
        mongo_uri = 'mongodb://localhost:27017/dropregards'
    
    # Connect to MongoDB
    client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
    
    # Get database name from connection string or use default
    db_name = os.environ.get('MONGODB_DB', 'dropregards')
    
    # Get database
    _db = client[db_name]
    
    # Create indexes for collections
    _create_indexes(_db)
    
    return _db

def _create_indexes(db):
    """
    Create indexes for collections
    
    Args:
        db (pymongo.database.Database): MongoDB database instance
    """
    # Users collection indexes
    db.users.create_index('walletAddress', unique=True)
    db.users.create_index('username', unique=True)
    
    # Regards collection indexes
    db.regards.create_index('sender.walletAddress')
    db.regards.create_index('recipient.walletAddress')
    db.regards.create_index('transactionSignature', unique=True)
    db.regards.create_index('createdAt')
    
    # Create compound indexes for common queries
    db.regards.create_index([
        ('recipient.walletAddress', pymongo.ASCENDING),
        ('createdAt', pymongo.DESCENDING)
    ])

def close_db_connection():
    """
    Close the MongoDB connection
    Should be called when the application is shutting down
    """
    global _db
    if _db is not None:
        client = _db.client
        client.close()
        _db = None 