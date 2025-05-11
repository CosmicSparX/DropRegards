# DropRegards

A platform for sending SOL with personalized messages and NFT certificates.

## Overview

DropRegards allows users to:

- Send SOL to other users along with personalized messages
- Create beautiful NFT certificates for special transactions
- Build a collection of received certificates
- Create and manage a user profile

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Solana Wallet Adapter
- **Backend**: Flask, MongoDB, JWT authentication
- **Blockchain**: Solana

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.8+
- MongoDB (local instance or MongoDB Atlas)
- Solana wallet (Phantom, Solflare, etc.)

### Setup and Installation

#### Backend Setup

1. Set up the Python virtual environment:

```bash
# On Windows
.\setup_venv.bat
# or with PowerShell
.\setup_venv.ps1

# On Unix
python -m venv venv
source venv/bin/activate
pip install -r api/requirements.txt
```

2. Ensure MongoDB is running (install locally or use MongoDB Atlas)

3. Update the `.env` file with your configuration:

```
# Flask Configuration
FLASK_APP=api.index
FLASK_ENV=development

# Security
JWT_SECRET_KEY=your_jwt_secret  # change this for security

# Python Path Configuration
PYTHONPATH=.

# Database
MONGODB_URI=mongodb://localhost:27017/dropregards  # update with your MongoDB URI

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com

# CORS
CORS_ORIGIN=*
```

4. Start the backend server:

```bash
# On Windows
.\run_backend.bat
# or with PowerShell
.\run_backend.ps1

# On Unix
export FLASK_APP=api.index
export FLASK_ENV=development
python -m flask run --host=0.0.0.0 --port=5000 --debug
```

The backend API will be available at `http://localhost:5000/api`.

#### Frontend Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

1. Start both backend and frontend servers
2. Connect your Solana wallet to the application
3. Create a user profile if you're a new user
4. Start sending and receiving regards!

## Troubleshooting

If you encounter errors related to MongoDB or bson modules:

- Make sure MongoDB is running
- Try using pymongo version 4.4.1 (`pip install pymongo==4.4.1`)
- Ensure your PYTHONPATH includes the project root directory

## API Documentation

The REST API is documented in [README_BACKEND.md](README_BACKEND.md).
