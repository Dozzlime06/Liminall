# Auto-Sweep Claim System - ONE Signature! ⚡

## The Simplest User Experience

User signs **ONCE** → Everything happens automatically!

## How It Works

### User Journey
1. User connects wallet
2. UI auto-detects ALL NFTs from both contracts
3. User clicks "Claim Tokens" (ONE button)
4. User signs **ONE transaction**
5. ✅ Contract 1 NFTs → User keeps + gets tokens
6. ✅ Contract 2 NFTs → Auto-swept to treasury + gets tokens
7. Done!

## Example Scenarios

### Scenario 1: User with ONLY Contract 1 NFTs
```
User owns:
- 10 NFTs from Contract 1 (0x7d5c...1f16b)
- 0 NFTs from Contract 2

ONE CLICK → ONE SIGNATURE:
✅ Claim 10 Contract 1 NFTs
✅ Keep all 10 NFTs
✅ Receive 250,000 $LD
```

### Scenario 2: User with ONLY Contract 2 NFTs
```
User owns:
- 0 NFTs from Contract 1
- 5 NFTs from Contract 2 (0x9125...c685)

ONE CLICK → ONE SIGNATURE:
✅ Claim 5 Contract 2 NFTs
✅ Auto-sweep to treasury (0x79E5...CE34)
✅ Receive 125,000 $LD
```

### Scenario 3: User with BOTH NFT Types ⭐
```
User owns:
- 10 NFTs from Contract 1 (0x7d5c...1f16b)
- 5 NFTs from Contract 2 (0x9125...c685)

ONE CLICK → ONE SIGNATURE:
✅ Claim 10 Contract 1 NFTs → Keep them
✅ Claim 5 Contract 2 NFTs → Auto-sweep to treasury
✅ Receive 375,000 $LD (15 × 25,000)

All in ONE transaction!
```

### Scenario 4: Snapshot Holder (195 NFTs)
```
Wallet: 0x486c...a435
Owns: 195 Contract 1 NFTs

ONE CLICK → ONE SIGNATURE:
✅ Claim all 195 NFTs
✅ Keep all NFTs
✅ Receive 4,875,000 $LD
```

## Smart Contract Function

```solidity
function claimTokens(
    uint256[] originalTokenIds,  // Contract 1 - keep NFTs
    uint256[] otherTokenIds      // Contract 2 - sweep to treasury
) {
    // Process Contract 1 NFTs (no transfer)
    for each originalTokenId:
        - Verify ownership
        - Mark as claimed
        - Add 25,000 $LD to total
        - User keeps NFT
    
    // Process Contract 2 NFTs (auto-sweep)
    for each otherTokenId:
        - Verify ownership
        - Mark as claimed
        - Transfer NFT to treasury
        - Add 25,000 $LD to total
    
    // Send all tokens at once
    Transfer total $LD to user
}
```

## Frontend Flow

```javascript
// 1. Detect user's NFTs (happens automatically)
const { originalTokenIds, otherTokenIds, totalClaimable } = 
    await claimManager.getUserClaimableNFTs(userAddress);

// 2. Show user what they'll get
console.log(`You will receive ${totalClaimable} $LD`);

// 3. ONE button click → ONE signature
await claimManager.claimTokens(originalTokenIds, otherTokenIds);

// Done! User has their tokens
```

## What User Sees

```
╔═══════════════════════════════════╗
║   💰 Claim $LD Tokens             ║
║                                   ║
║   Your Liminal Dreams NFTs: 10    ║
║   Total Claimable: 250,000 $LD    ║
║                                   ║
║   ┌─────────────────────────────┐ ║
║   │   [Claim Tokens]            │ ║ ← ONE BUTTON
║   └─────────────────────────────┘ ║
║                                   ║
║   ✅ You'll keep your NFTs        ║
╚═══════════════════════════════════╝
```

## What User DOESN'T See

- Contract 2 mention (completely hidden)
- Sweep mechanism details
- Treasury address
- Two separate transactions
- Technical complexity

## Key Benefits

✅ **ONE signature** - Simplest possible UX  
✅ **Auto-sweep** - Contract 2 handled automatically  
✅ **Batch processing** - All NFTs in one transaction  
✅ **Hidden complexity** - User sees simple claim  
✅ **Gas efficient** - Single transaction for everything  

## Technical Details

| Feature | Value |
|---------|-------|
| Signatures Required | 1 (just the claim tx) |
| Transactions | 1 |
| Contract 1 Action | Claim + keep NFTs |
| Contract 2 Action | Claim + auto-sweep |
| Tokens per NFT | 25,000 $LD |
| Max NFTs per claim | ~200 (gas limit dependent) |

## Deployment

```javascript
constructor(
    originalNFT: "0x7d5c48a82e13168d84498548fe0a2282b9c1f16b",
    otherNFT: "0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685",
    ldToken: "[LDToken address]",
    treasuryAddress: "0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34"
)
```

## Security

- ✅ ReentrancyGuard on claim function
- ✅ Ownership verification before processing
- ✅ Double-claim prevention per tokenId
- ✅ Separate tracking for each NFT contract
- ✅ Emergency withdrawal for owner

---

**Perfect for users:** Click once, sign once, get tokens! 🎉
