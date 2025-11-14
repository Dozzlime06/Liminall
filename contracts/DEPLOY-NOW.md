# Deploy Liminal Dreams $LD Token - Step by Step

## ⚡ Quick Deploy Guide

### Network Details
- **Network**: Hyperliquid
- **Chain ID**: 999
- **RPC URL**: https://rpc.hyperliquid.xyz/evm
- **Currency**: ETH

---

## 📝 Step 1: Deploy LDToken

### Contract: `LDToken.sol`

**Constructor Parameters:** NONE

**What you get:**
- 200,000,000 $LD tokens sent to your wallet

**Deployment Options:**

#### Option A: Using Remix (Easiest)
1. Go to https://remix.ethereum.org
2. Create new file: `LDToken.sol`
3. Copy code from `contracts/LDToken.sol`
4. Compile with Solidity 0.8.20+
5. Deploy tab → Select "Injected Provider - MetaMask"
6. Make sure MetaMask is on Hyperliquid (Chain ID 999)
7. Click Deploy
8. **Save the deployed address!**

#### Option B: Using Hardhat
```bash
npx hardhat run scripts/deploy-token.js --network hyperliquid
```

---

## 📝 Step 2: Deploy ClaimManagerAuto

### Contract: `ClaimManagerAuto.sol`

**Constructor Parameters:**
```
_originalNFT: 0x7d5c48a82e13168d84498548fe0a2282b9c1f16b
_otherNFT: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685
_ldToken: [PASTE LDToken address from Step 1]
_treasuryAddress: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34
```

**Using Remix:**
1. Create new file: `ClaimManagerAuto.sol`
2. Copy code from `contracts/ClaimManagerAuto.sol`
3. Compile with Solidity 0.8.20+
4. Deploy with constructor parameters above
5. **Save the deployed address!**

---

## 📝 Step 3: Fund ClaimManager

Transfer $LD tokens to ClaimManager so users can claim:

**Recommended amount:** 50,000,000 - 100,000,000 $LD

**How to transfer:**
1. Go to LDToken contract on block explorer
2. Call `transfer` function:
   - `to`: [ClaimManager address from Step 2]
   - `amount`: 50000000000000000000000000 (50M with 18 decimals)
3. Confirm transaction

---

## 📝 Step 4: Add to MetaMask (Users)

**Token Contract:** [LDToken address]
- **Symbol:** LD
- **Decimals:** 18

---

## 📝 Step 5: Update Frontend

Edit `client/src/lib/contracts.ts`:

```typescript
export const CONTRACTS = {
  CHAIN_ID: 999,
  RPC_URL: "https://rpc.hyperliquid.xyz/evm",
  
  ORIGINAL_LD_NFT: "0x7d5c48a82e13168d84498548fe0a2282b9c1f16b",
  
  // ADD THESE:
  LD_TOKEN: "[LDToken address from Step 1]",
  CLAIM_MANAGER: "[ClaimManager address from Step 2]",
  
  TOKENS_PER_NFT: 25000,
  MAX_BATCH_CLAIM: 100,
};
```

---

## ✅ Testing Checklist

After deployment, test:

1. ☐ Can view LDToken balance in wallet
2. ☐ ClaimManager has received $LD tokens
3. ☐ Call `getUserClaimableNFTs` to see if it detects NFTs
4. ☐ Test claim with a wallet that has NFTs
5. ☐ Verify tokens received after claim
6. ☐ Verify Contract 2 NFTs swept to treasury

---

## 🔧 Troubleshooting

**Issue: "Invalid NFT contract"**
- Check NFT addresses are correct

**Issue: "Token transfer failed"**
- Make sure ClaimManager has enough $LD tokens

**Issue: "Not the NFT owner"**
- Wallet must own the NFT at claim time

**Issue: "Already claimed"**
- Each tokenId can only claim once

---

## 📊 Contract Addresses to Track

After deployment, save these:

```
LDToken: ___________________________
ClaimManager: ______________________
Original NFT: 0x7d5c48a82e13168d84498548fe0a2282b9c1f16b
Other NFT: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685
Treasury: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34
```
