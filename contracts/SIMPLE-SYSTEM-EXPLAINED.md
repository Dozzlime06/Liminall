# Simple Claim System - Users Keep NFTs

## System Overview

Users claim 25,000 $LD per NFT they own from contract `0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685` and **KEEP their NFTs**.

## How It Works

### User Claims Tokens
1. User owns NFTs from contract 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685
2. User connects wallet
3. User selects which NFT tokenIds to claim for
4. User clicks "Claim Tokens"
5. Contract verifies ownership
6. **User receives 25,000 $LD per NFT**
7. **User KEEPS their NFTs** (no transfer)
8. TokenIds marked as claimed (can't claim twice)

## User Scenarios

### Scenario 1: Original Holder (from snapshot)
**Example**: Wallet holds 10 NFTs

1. User connects wallet
2. Sees 10 claimable NFTs
3. Clicks "Claim All" or selects specific tokenIds
4. Receives 250,000 $LD
5. **Still owns all 10 NFTs**

### Scenario 2: New Minter
**Example**: User just minted 5 new NFTs

1. User mints 5 NFTs
2. User connects wallet
3. Sees 5 claimable NFTs
4. Claims → Receives 125,000 $LD
5. **Still owns all 5 NFTs**

### Scenario 3: Secondary Buyer
**Example**: User bought 3 NFTs from marketplace

1. User buys 3 NFTs
2. User connects wallet
3. Sees 3 claimable NFTs
4. Claims → Receives 75,000 $LD
5. **Still owns all 3 NFTs**

### Scenario 4: Multiple Claims Over Time
**Example**: User claims, then buys more NFTs

1. User owns 5 NFTs → Claims 125,000 $LD
2. User buys 3 more NFTs
3. User claims for the 3 new NFTs → Receives 75,000 $LD
4. **Total: 8 NFTs owned, 200,000 $LD claimed**

## Key Features

✅ **Keep Your NFTs**: No NFT transfer needed  
✅ **Claim Per TokenId**: Each NFT tokenId can claim once  
✅ **Works for Everyone**: Snapshot holders, new minters, buyers  
✅ **Batch Claims**: Claim up to 100 NFTs at once  
✅ **Multiple Sessions**: Buy more NFTs, claim again  

## Smart Contract Logic

```solidity
function claimTokens(uint256[] tokenIds) {
    for each tokenId:
        1. Check if tokenId already claimed
        2. Verify msg.sender owns this tokenId
        3. Mark tokenId as claimed
        4. Add 25,000 $LD to total
    
    Transfer total $LD to user
    User keeps all NFTs
}
```

## Security Features

- ✅ ReentrancyGuard protection
- ✅ TokenId-based claim tracking (no double claims)
- ✅ Ownership verification
- ✅ Batch size limit (100 NFTs max)
- ✅ Owner can pause/unpause claiming
- ✅ Emergency withdrawal function

## Distribution Summary

| Category | Amount |
|----------|--------|
| Total Supply | 200,000,000 $LD |
| Available for Claims | 200,000,000 $LD |
| Per NFT | 25,000 $LD |
| Max NFTs per claim | 100 |

## Benefits

### For Users:
- Keep valuable NFTs
- Get $LD tokens as bonus
- Can sell NFTs later at higher value
- Claim new NFTs anytime

### For Project:
- NFTs stay in circulation
- Higher trading volume
- Community keeps growing
- Fair distribution to all holders

## Important Notes

- Only NFTs from `0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685` are eligible
- Each tokenId can only claim once (even if sold to new owner)
- Users must own the NFT at claim time
- No time limit for claiming
