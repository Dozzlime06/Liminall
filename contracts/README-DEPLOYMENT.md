# Deployment Options

## Option 1: Remix (Easiest - No Setup Required) ⭐

1. Go to https://remix.ethereum.org
2. Upload `LDToken.sol` and `ClaimManagerAuto.sol`
3. Install OpenZeppelin contracts:
   - Click "Plugin Manager"
   - Install "OpenZeppelin Contracts"
4. Compile both contracts (Solidity 0.8.20+)
5. Connect MetaMask to Hyperliquid network
6. Deploy LDToken first
7. Deploy ClaimManagerAuto with constructor params
8. Transfer 50M $LD to ClaimManager

**See `DEPLOY-NOW.md` for detailed steps**

---

## Option 2: Hardhat (For Developers)

### Setup
```bash
cd contracts
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

### Configure Private Key
```bash
# Create .env file
echo "PRIVATE_KEY=your_private_key_here" > .env
```

### Deploy
```bash
npx hardhat run scripts/deploy.js --network hyperliquid
```

---

## Option 3: Manual Deployment

If you prefer to deploy using another tool (Foundry, Truffle, etc):

1. Compile `LDToken.sol`
2. Deploy with no constructor params
3. Compile `ClaimManagerAuto.sol`
4. Deploy with these constructor params:
   - `_originalNFT`: 0x7d5c48a82e13168d84498548fe0a2282b9c1f16b
   - `_otherNFT`: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685
   - `_ldToken`: [LDToken address]
   - `_treasuryAddress`: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34
5. Transfer 50M+ $LD to ClaimManager

---

## Network Configuration

Add Hyperliquid to MetaMask:

- **Network Name**: Hyperliquid
- **RPC URL**: https://rpc.hyperliquid.xyz/evm
- **Chain ID**: 999
- **Currency Symbol**: ETH
- **Block Explorer**: https://explorer.hyperliquid.xyz

---

## After Deployment

Update `client/src/lib/contracts.ts`:
```typescript
LD_TOKEN: "[your LDToken address]",
CLAIM_MANAGER: "[your ClaimManager address]",
```

Restart the frontend to see changes.
