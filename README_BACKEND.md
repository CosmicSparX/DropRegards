# DropRegards Backend API

This is the backend API for DropRegards, a platform for sending SOL with personalized messages and NFT certificates.

## Technology Stack

- **Framework**: Flask
- **Database**: MongoDB
- **Authentication**: JWT tokens with Solana wallet signature verification
- **Blockchain Integration**: Solana Web3.js for wallet interactions and transactions
- **NFT Support**: Metaplex for NFT creation

## Project Structure

```
api/
├── __init__.py                  # Package initializer
├── index.py                     # Main entry point
├── db.py                        # Database connection handling
├── routes/                      # API route definitions
│   ├── __init__.py
│   ├── auth.py                  # Authentication routes
│   ├── users.py                 # User profile routes
│   ├── regards.py               # Regards/transactions routes
│   └── nft.py                   # NFT-related routes
├── models/                      # Database models
│   ├── __init__.py
│   ├── user.py                  # User model
│   └── regard.py                # Regard model
├── middleware/                  # Middleware components
│   ├── __init__.py
│   └── auth.py                  # Authentication middleware
└── utils/                       # Utility functions
    ├── __init__.py
    └── solana.py                # Solana blockchain utilities
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- MongoDB (local instance or MongoDB Atlas)
- Solana wallet for testing

### Local Development

1. Clone the repository:

   ```
   git clone https://github.com/your-username/dropregards.git
   cd dropregards
   ```

2. Create and activate a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Set environment variables:

   ```
   # For development
   export FLASK_APP=api/index.py
   export FLASK_ENV=development
   export JWT_SECRET_KEY=your_jwt_secret
   export MONGODB_URI=your_mongodb_uri
   export SOLANA_RPC_URL=https://api.devnet.solana.com

   # On Windows
   set FLASK_APP=api/index.py
   set FLASK_ENV=development
   set JWT_SECRET_KEY=your_jwt_secret
   set MONGODB_URI=your_mongodb_uri
   set SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

   You can also create a `.env` file in the project root with these variables.

5. Run the development server:
   ```
   flask run
   ```

### Deployment on Vercel

1. Install Vercel CLI:

   ```
   npm install -g vercel
   ```

2. Login to Vercel:

   ```
   vercel login
   ```

3. Deploy:

   ```
   vercel
   ```

4. Set environment variables on Vercel:
   ```
   vercel env add JWT_SECRET_KEY
   vercel env add MONGODB_URI
   vercel env add SOLANA_RPC_URL
   ```

## API Documentation

### Authentication

- **POST /api/auth/nonce**: Generate a nonce for wallet signature
- **POST /api/auth/verify-signature**: Verify wallet signature and authenticate
- **POST /api/auth/logout**: Logout user

### Users

- **GET /api/users/check-username**: Check if username is available
- **POST /api/users/profile**: Create new user profile
- **GET /api/users/profile**: Get current user's profile
- **PUT /api/users/profile**: Update user profile
- **GET /api/users/username/{username}**: Get user by username

### Regards

- **POST /api/regards/send**: Send SOL with a message
- **GET /api/regards/list**: Get list of regards for current user
- **GET /api/regards/stats**: Get statistics for current user
- **GET /api/regards/public-stats/{username}**: Get public stats for a user

### NFTs

- **GET /api/nft/templates**: Get available NFT certificate templates
- **POST /api/nft/metadata**: Generate metadata for NFT certificate
- **GET /api/nft/collection**: Get NFT collection for current user

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  walletAddress: String,
  username: String,
  displayName: String,
  bio: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Regards Collection

```javascript
{
  _id: ObjectId,
  sender: {
    walletAddress: String,
    username: String
  },
  recipient: {
    walletAddress: String,
    username: String
  },
  amount: Number,
  message: String,
  includesNft: Boolean,
  nft: {
    design: String,
    mintAddress: String,
    image: String,
    name: String
  },
  transactionSignature: String,
  status: String, // "pending", "completed", "failed"
  createdAt: Date
}
```

## Implementing Your Own Logic

The current implementation contains placeholders for database operations and blockchain interactions. To implement your own logic:

1. Replace placeholder implementations in model files with actual database operations.
2. Implement the actual Solana transaction verification in `utils/solana.py`.
3. Add real NFT creation logic using Metaplex.

## Security Considerations

- Never store private keys on the server.
- Always verify transactions on the blockchain.
- Implement rate limiting to prevent abuse.
- Use secure environment variables for sensitive configuration.
- Validate all user inputs thoroughly.
