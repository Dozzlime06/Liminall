# USDC Withdrawal Script for Base Network

A simple Node.js script to withdraw USDC tokens from your smart contract on Base network.

## Contract Details
- **Contract Address**: `0x9B2522719ded681674944DD616ac77A30f4d4915`
- **Network**: Base (Chain ID: 8453)
- **Token**: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)

## Setup

1. **Configure your private key**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your deployer wallet's private key:
     ```
     PRIVATE_KEY=your_private_key_here
     ```
   
   ⚠️ **Security Note**: Never share your private key or commit the `.env` file to version control.

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

## Usage

Run the withdrawal script:
```bash
node withdraw-usdc.js
```

The script will:
1. Connect to Base network
2. Check the USDC balance in your contract
3. Call the `withdrawUSDC()` function to withdraw all USDC
4. Display the transaction hash and confirmation

## What the Script Does

The script calls the contract's `withdrawUSDC()` function, which withdraws all USDC tokens held by the contract and transfers them to your wallet address.

## Troubleshooting

If the withdrawal fails:
1. **Verify you're the contract owner**: The script will check if your wallet is the owner
2. **Check contract source code**: Visit [BaseScan](https://basescan.org/address/0x9B2522719ded681674944DD616ac77A30f4d4915) to see the exact withdrawal function name
3. **Ensure sufficient gas**: Make sure your wallet has enough ETH on Base for gas fees
4. **Check USDC balance**: The script shows the contract's USDC balance before attempting withdrawal

## Example Output

```
🔗 Connecting to Base network...
📍 Deployer wallet: 0x1234...5678
✅ Connected to network: base (Chain ID: 8453)

💰 Checking USDC balance...
📊 Contract USDC Balance: 1234.56 USDC
🔐 Contract owner: 0x1234...5678

🚀 Attempting withdrawal...
Trying different withdrawal function signatures...

Trying withdraw()...
✅ Transaction submitted with withdraw()

📝 Transaction Hash: 0xabc...def
⏳ Waiting for confirmation...

✅ Transaction confirmed in block 12345678
💸 Successfully withdrew 1234.56 USDC
🔗 View on BaseScan: https://basescan.org/tx/0xabc...def
```

## Security

- Private keys are stored in `.env` file (not tracked by git)
- The script only attempts to withdraw to the deployer wallet address
- All transactions are signed with your private key locally
- Transaction details are displayed before confirmation

## Requirements

- Node.js v18 or higher
- ethers.js v6
- dotenv
- Internet connection to Base RPC endpoint
