# USDC Withdrawal Script

## Overview
This project contains a Node.js script to withdraw USDC tokens from a smart contract deployed on Base network. The contract address is `0x9B2522719ded681674944DD616ac77A30f4d4915`.

## Purpose
Allows the contract deployer/owner to extract all USDC tokens held by the contract and transfer them to their wallet address.

## Current State
- Basic withdrawal script with multiple function signature support
- Automatic balance checking
- Transaction confirmation and receipt display
- Error handling for common issues

## Project Structure
```
.
├── withdraw-usdc.js    # Main withdrawal script
├── .env.example        # Template for environment variables
├── .env               # Private key storage (not committed)
├── package.json       # Node.js dependencies
└── README.md          # Documentation
```

## Dependencies
- **ethers.js v6**: For blockchain interaction and wallet management
- **dotenv**: For secure environment variable management
- **Node.js 20**: Runtime environment

## Key Technical Details

### Network Configuration
- **Chain**: Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org

### Contract Addresses
- **Target Contract**: `0x9B2522719ded681674944DD616ac77A30f4d4915`
- **USDC Token**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Withdrawal Functions Attempted
The script automatically tries multiple function signatures:
1. `withdraw(address token, uint256 amount)`
2. `withdrawToken(address token, uint256 amount)`
3. `emergencyWithdraw(address token)`

## Usage
1. Add your private key to `.env` file
2. Run: `node withdraw-usdc.js`
3. The script will handle the withdrawal and display results

## Security Notes
- Private key is stored in `.env` (gitignored)
- Never expose or share your private key
- Verify contract ownership before running
- Check transaction details on BaseScan after execution

## Recent Changes
- 2025-11-12: Initial project setup with USDC withdrawal functionality
