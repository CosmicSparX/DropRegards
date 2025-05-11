import json
import os
import requests
import base58
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
import base64

def get_solana_client():
    """
    Get a Solana RPC client connection
    """
    class SolanaClient:
        def __init__(self, rpc_url):
            self.rpc_url = rpc_url
            print(f"Initialized Solana client with URL: {rpc_url}")
        
        def get_transaction(self, signature):
            headers = {
                "Content-Type": "application/json"
            }
            data = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTransaction",
                "params": [
                    signature,
                    {"encoding": "json", "maxSupportedTransactionVersion": 0}
                ]
            }
            response = requests.post(self.rpc_url, headers=headers, json=data)
            return response.json()
    
    rpc_url = os.environ.get('SOLANA_RPC_URL', 'https://api.devnet.solana.com')
    return SolanaClient(rpc_url)

def verify_wallet_signature(wallet_address, signature, message):
    """
    Verify that a message was signed by the owner of a wallet
    
    Args:
        wallet_address (str): The wallet address
        signature (str): The signature as a base58 encoded string
        message (str): The original message that was signed
        
    Returns:
        bool: True if signature is valid, False otherwise
    """
    try:
        # Convert wallet address to public key bytes
        public_key_bytes = base58.b58decode(wallet_address)
        
        # Convert signature to bytes
        signature_bytes = base58.b58decode(signature)
        
        # Create a VerifyKey from the public key bytes
        verify_key = VerifyKey(public_key_bytes)
        
        # Verify the signature against the message
        verify_key.verify(message.encode(), signature_bytes)
        
        return True
    except (BadSignatureError, ValueError, Exception) as e:
        print(f"Signature verification error: {str(e)}")
        return False

def verify_transaction(signature, expected_sender, expected_receiver, expected_amount):
    """
    Verify a Solana transaction
    
    Args:
        signature (str): The transaction signature
        expected_sender (str): The expected sender wallet address
        expected_receiver (str): The expected receiver wallet address
        expected_amount (float): The expected SOL amount
        
    Returns:
        bool: True if transaction details match expectations, False otherwise
    """
    try:
        # Get the transaction info from the Solana blockchain
        client = get_solana_client()
        tx_info = client.get_transaction(signature)
        
        # If transaction is not found or failed
        if (not tx_info.get('result') or 
            tx_info.get('result', {}).get('meta', {}).get('err') is not None):
            return False
        
        # Extract transaction details
        transaction = tx_info['result']
        message = transaction.get('transaction', {}).get('message', {})
        meta = transaction.get('meta', {})
        
        # Check if this is a SOL transfer
        if 'postBalances' in meta and 'preBalances' in meta:
            # Get account indexes
            accounts = message.get('accountKeys', [])
            
            # Find sender and receiver
            sender_idx = accounts.index(expected_sender) if expected_sender in accounts else -1
            receiver_idx = accounts.index(expected_receiver) if expected_receiver in accounts else -1
            
            if sender_idx == -1 or receiver_idx == -1:
                return False
            
            # Calculate amount transferred in SOL
            pre_balance_sender = meta['preBalances'][sender_idx]
            post_balance_sender = meta['postBalances'][sender_idx]
            pre_balance_receiver = meta['preBalances'][receiver_idx]
            post_balance_receiver = meta['postBalances'][receiver_idx]
            
            # Convert from lamports to SOL (1 SOL = 10^9 lamports)
            sender_diff = (pre_balance_sender - post_balance_sender) / 1_000_000_000
            receiver_diff = (post_balance_receiver - pre_balance_receiver) / 1_000_000_000
            
            # Allow for a small margin of error due to transaction fees
            fee = meta.get('fee', 0) / 1_000_000_000
            
            # Check if the amount matches (accounting for transaction fee)
            amount_matches = abs(expected_amount - receiver_diff) < 0.0001
            sender_matches = abs(sender_diff - expected_amount - fee) < 0.0001
            
            return amount_matches and sender_matches
        
        return False
    except Exception as e:
        print(f"Transaction verification error: {str(e)}")
        return False 