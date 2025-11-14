# Dual NFT Claim System

## Two NFT Contracts, Different Rules

### Original LD NFT Contract: `0x7d5c48a82e13168d84498548fe0a2282b9c1f16b`
- **Rule**: Users KEEP their NFTs
- **Function**: `claimFromOriginalNFT([tokenIds])`
- **What happens**: Get 25,000 $LD per NFT, NFT stays in wallet

### Other NFT Contract: `0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685`
- **Rule**: NFTs swept to treasury
- **Function**: `claimFromOtherNFT([tokenIds])`
- **What happens**: Get 25,000 $LD per NFT, NFT → treasury `0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34`

## User Scenarios

### Scenario 1: Original LD NFT Holder
**User owns 10 NFTs from 0x7d5c...**

1. Connect wallet
2. Call `claimFromOriginalNFT([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])`
3. Receive 250,000 $LD
4. **Still own all 10 NFTs**

### Scenario 2: Other NFT Holder
**User owns 5 NFTs from 0x9125...**

1. Connect wallet
2. Call `claimFromOtherNFT([100, 101, 102, 103, 104])`
3. Receive 125,000 $LD
4. **NFTs transferred to treasury 0x79E50...CE34**

### Scenario 3: Holder of BOTH NFT Types
**User owns 10 original + 5 other NFTs**

1. Call `claimFromOriginalNFT([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])`
   - Get 250,000 $LD
   - Keep all 10 original NFTs
   
2. Call `claimFromOtherNFT([100, 101, 102, 103, 104])`
   - Get 125,000 $LD
   - 5 other NFTs → treasury

**Total**: 375,000 $LD claimed

### Scenario 4: Buy More Later
**User claims, then buys more NFTs**

1. Initial claim from 5 original NFTs → 125,000 $LD
2. Buy 3 more original NFTs
3. Claim again → 75,000 $LD
4. Total: 8 NFTs owned, 200,000 $LD claimed

## Smart Contract Functions

### For Original NFT (No Sweep)
```solidity
function claimFromOriginalNFT(uint256[] tokenIds) {
    // Verify ownership
    // Mark tokenIds as claimed
    // Transfer $LD to user
    // User keeps NFTs
}
```

### For Other NFT (Sweep to Treasury)
```solidity
function claimFromOtherNFT(uint256[] tokenIds) {
    // Verify ownership
    // Mark tokenIds as claimed
    // Transfer NFTs to treasury
    // Transfer $LD to user
}
```

## Key Features

✅ **Dual NFT Support**: Two different NFT contracts  
✅ **Different Rules**: Keep original NFTs, sweep other NFTs  
✅ **Per TokenId Tracking**: Each tokenId claims once  
✅ **Batch Claims**: Up to 100 NFTs per transaction  
✅ **Multiple Claims**: Buy more NFTs, claim again  
✅ **Transparent**: Clear rules for each contract  

## Security Features

- ✅ ReentrancyGuard on both claim functions
- ✅ Separate tracking for each NFT contract
- ✅ Ownership verification before claim
- ✅ No double claims per tokenId
- ✅ Pause/unpause functionality
- ✅ Emergency withdrawal

## Deployment Parameters

```javascript
constructor(
  originalNFT: "0x7d5c48a82e13168d84498548fe0a2282b9c1f16b",
  otherNFT: "0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685",
  ldToken: "[LDToken contract address]",
  treasuryAddress: "0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34"
)
```

## Distribution

| Item | Value |
|------|-------|
| Total Supply | 200,000,000 $LD |
| Per NFT | 25,000 $LD |
| Original NFT Contract | 0x7d5c...1f16b (NO sweep) |
| Other NFT Contract | 0x9125...c685 (SWEEP) |
| Treasury Address | 0x79E5...CE34 |
| Network | Hyperliquid (Chain ID 999) |
