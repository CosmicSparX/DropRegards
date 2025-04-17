import json
import os
import hashlib

# Mock Solana client implementation
def get_solana_client():
    """
    Get a mock Solana RPC client instance
    In a real implementation, this would connect to a Solana node
    """
    class MockSolanaClient:
        def __init__(self, rpc_url):
            self.rpc_url = rpc_url
            print(f"Initialized mock Solana client with URL: {rpc_url}")
        
        def get_transaction(self, signature):
            # Return mock transaction data
            return {
                'result': {
                    'meta': {
                        'err': None
                    }
                }
            }
    
    rpc_url = os.environ.get('SOLANA_RPC_URL', 'https://api.devnet.solana.com')
    return MockSolanaClient(rpc_url)

def verify_wallet_signature(wallet_address, signature, message):
    """
    Mock verification that a message was signed by the owner of a wallet
    
    Args:
        wallet_address (str): The wallet address
        signature (str): The signature as a base58 encoded string
        message (str): The original message that was signed
        
    Returns:
        bool: True if signature is valid, False otherwise
    """
    # In a real implementation, this would verify the signature
    # For development, we'll always return True
    print(f"Mock verification of signature for wallet: {wallet_address}")
    return True

def verify_transaction(signature, expected_sender, expected_receiver, expected_amount):
    """
    Mock verification of a Solana transaction
    
    Args:
        signature (str): The transaction signature
        expected_sender (str): The expected sender wallet address
        expected_receiver (str): The expected receiver wallet address
        expected_amount (float): The expected SOL amount
        
    Returns:
        bool: True if transaction details match expectations, False otherwise
    """
    # In a real implementation, this would verify the transaction details
    # For development, we'll always return True
    print(f"Mock verification of transaction: {signature}")
    print(f"  Expected sender: {expected_sender}")
    print(f"  Expected receiver: {expected_receiver}")
    print(f"  Expected amount: {expected_amount} SOL")
    return True

def create_nft(regard_data):
    """
    Mock NFT certificate creation
    
    Args:
        regard_data (dict): Data about the regard, including sender, receiver, amount, message
        
    Returns:
        dict: Information about the created NFT
    """
    # In a real implementation, this would mint an NFT on Solana
    # For development, we'll return mock data
    
    # Create a unique hash based on the regard data
    hash_input = f"{regard_data['sender']['username']}-{regard_data['recipient']['username']}-{regard_data['amount']}-{regard_data['message']}"
    hash_value = hashlib.md5(hash_input.encode()).hexdigest()
    
    design = regard_data['nft']['design'] if 'nft' in regard_data and 'design' in regard_data['nft'] else 'default'
    
    nft_data = {
        'mintAddress': f"mock-mint-address-{hash_value}",
        'image': f"/images/nft-certificate-{design}.jpg",
        'name': f"Certificate from {regard_data['sender']['username']}"
    }
    
    print(f"Mock NFT created: {nft_data['name']}")
    return nft_data 