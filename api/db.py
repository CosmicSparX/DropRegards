import os
import pymongo
from pymongo import MongoClient
import certifi
import logging




# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    
    try:
        # Get MongoDB connection string from environment variable
        mongo_uri = os.getenv('MONGODB_URI')
        print(mongo_uri)
        
        if not mongo_uri:
            # Use a default connection string for local development
            mongo_uri = 'mongodb://localhost:27017/dropregards'
            logger.warning("MONGODB_URI not set, using default: %s", mongo_uri)
        
        # Connect to MongoDB
        logger.info("Connecting to MongoDB at %s", mongo_uri.split('@')[-1])  # Don't log credentials
        client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
        
        # Verify connection by attempting to get server info
        client.server_info()
        
        # Get database name from connection string or use default
        db_name = os.environ.get('MONGODB_DB', 'dropregards')
        
        # Get database
        _db = client[db_name]
        
        # Create indexes for collections
        _create_indexes(_db)
        
        logger.info("MongoDB connection successful to database: %s", db_name)
        return _db
    
    except pymongo.errors.ServerSelectionTimeoutError as e:
        logger.error("MongoDB connection error: Could not connect to server: %s", str(e))
        raise
    except pymongo.errors.ConnectionFailure as e:
        logger.error("MongoDB connection error: Connection failure: %s", str(e))
        raise
    except Exception as e:
        logger.error("MongoDB connection error: %s", str(e))
        raise

def _create_indexes(db):
    """
    Create indexes for collections
    
    Args:
        db (pymongo.database.Database): MongoDB database instance
    """
    try:
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
        logger.info("MongoDB indexes created successfully")
    except Exception as e:
        logger.error("Error creating MongoDB indexes: %s", str(e))
        raise

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
        logger.info("MongoDB connection closed") 