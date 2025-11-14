# Liminal Dreams $LD Token - Deployment Guide

## Smart Contracts

### 1. LDToken.sol
- ERC20 token with 200M supply
- Symbol: $LD
- Name: Liminal Dreams

### 2. ClaimManagerDual.sol
- Handles claims from TWO NFT contracts
- Only Contract 1 visible in frontend UI

## NFT Contract Configuration

### Contract 1: Original LD NFT (PUBLIC - Shown in UI)
- **Address**: `0x7d5c48a82e13168d84498548fe0a2282b9c1f16b`
- **Rule**: Users KEEP their NFTs
- **Function**: `claimFromOriginalNFT([tokenIds])`
- **Frontend**: Primary claim button

### Contract 2: Other NFT (HIDDEN - Backend only)
- **Address**: `0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685`
- **Rule**: NFTs swept to treasury `0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34`
- **Function**: `claimFromOtherNFT([tokenIds])`
- **Frontend**: Not exposed in UI (admin/backend use only)

## Deployment Steps

1. **Deploy LDToken.sol**
   ```
   No constructor parameters
   → You receive 200,000,000 $LD tokens
   ```

2. **Deploy ClaimManagerDual.sol**
   ```
   Constructor:
   - originalNFT: 0x7d5c48a82e13168d84498548fe0a2282b9c1f16b
   - otherNFT: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685
   - ldToken: [LDToken address from step 1]
   - treasuryAddress: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34
   ```

3. **Fund ClaimManager**
   ```
   Transfer 50M - 100M $LD to ClaimManager address
   ```

4. **Update Frontend**
   ```
   Add to client/src/lib/contracts.ts:
   - LDToken address
   - ClaimManager address
   - Only expose claimFromOriginalNFT() function
   ```

## Frontend Implementation

### User Flow (Simple)
1. User connects wallet
2. System checks if they own NFTs from `0x7d5c...1f16b`
3. Shows claimable amount
4. User clicks "Claim $LD Tokens"
5. Calls `claimFromOriginalNFT([tokenIds])`
6. User receives tokens + keeps NFTs

### What Users See
```
╔════════════════════════════════╗
║   Claim $LD Tokens             ║
║                                ║
║   Your NFTs: 10                ║
║   Claimable: 250,000 $LD       ║
║                                ║
║   [Claim Tokens] ← Single btn  ║
╚════════════════════════════════╝
```

### What Users DON'T See
- Contract 2 (Other NFT) functionality
- Sweep mechanism
- Treasury address
- Technical complexity

## Admin/Backend Use Only

If you need to manually process Contract 2 (Other NFT) claims:

```javascript
// Only for admin/backend scripts
await claimManager.claimFromOtherNFT([tokenIds])
// This will sweep NFTs to treasury
```

## Network Details

- **Network**: Hyperliquid
- **Chain ID**: 999
- **RPC**: https://rpc.hyperliquid.xyz/evm

## Security Notes

- Contract 2 function exists but not exposed in UI
- Only Contract 1 is user-facing
- Both contracts tracked separately (no conflicts)
- Each tokenId can only claim once per contract
- ReentrancyGuard on all claim functions

## Token Distribution

| Allocation | Amount |
|------------|--------|
| Total Supply | 200,000,000 $LD |
| ClaimManager Fund | 50M - 100M $LD |
| Reserve | Remaining |
| Per NFT | 25,000 $LD |
