# Hybrid Claim System - How It Works

## System Overview

The Liminal Dreams claim system uses a **snapshot-based hybrid approach** that automatically sweeps NFTs when present.

## User Scenarios

### Scenario 1: Snapshot User WITH NFTs
**Example**: Wallet holds 10 NFTs from snapshot

1. User connects wallet
2. Clicks "Claim From Snapshot"
3. **Auto-sweep happens**: All NFTs transferred to treasury (0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34)
4. User receives 250,000 $LD (10 × 25,000)
5. NFTs now in treasury, user has tokens

### Scenario 2: Snapshot User WITHOUT NFTs
**Example**: User had 10 NFTs in snapshot but sold them

1. User connects wallet
2. Clicks "Claim From Snapshot"
3. **No NFT sweep** (user doesn't have NFTs anymore)
4. User receives 250,000 $LD (10 × 25,000)
5. User gets tokens based on snapshot allocation

### Scenario 3: NEW Minter (Not in Snapshot)
**Example**: User mints 5 new NFTs after launch

1. User mints NFTs from your contract
2. User connects wallet
3. Clicks "Swap NFTs for Tokens"
4. Selects NFT tokenIds to swap (max 50)
5. NFTs transferred to treasury
6. User receives 125,000 $LD (5 × 25,000)

### Scenario 4: Future Buyer (Not in Snapshot)
**Example**: User buys 3 NFTs from secondary market

1. User buys NFTs from OpenSea/marketplace
2. User connects wallet
3. Clicks "Swap NFTs for Tokens"
4. NFTs transferred to treasury
5. User receives 75,000 $LD (3 × 25,000)

## Key Features

✅ **Snapshot-based**: Claim based on past ownership  
✅ **Auto-sweep**: NFTs automatically transferred if user still holds them  
✅ **Transparent**: User sees their allocation before claiming  
✅ **One-time claim**: Each address can only claim once  
✅ **Flexible**: Works whether user still has NFTs or not  

## Smart Contract Logic

```solidity
function claimTokens() {
    // 1. Check if address is in snapshot
    require(snapshotAllocations[msg.sender] > 0);
    
    // 2. Check if already claimed
    require(!hasClaimed[msg.sender]);
    
    // 3. Calculate base allocation from snapshot
    uint256 tokens = snapshotAllocations[msg.sender] * 25000;
    
    // 4. Check if user has NFTs
    if (nftContract.balanceOf(msg.sender) > 0) {
        // Auto-sweep all NFTs to treasury
        transferNFTsToTreasury();
    }
    
    // 5. Send tokens to user
    ldToken.transfer(msg.sender, tokens);
    
    // 6. Mark as claimed
    hasClaimed[msg.sender] = true;
}
```

## Benefits for Users

### For Current Holders (with NFTs):
- Get tokens + NFTs go to treasury
- No separate transaction needed
- Gas-efficient (one transaction)

### For Past Holders (sold NFTs):
- Still get tokens based on snapshot
- Reward for early support
- Fair distribution

## Treasury Benefits

- Collects NFTs from active holders
- Can burn or hold for liquidity
- Transparent on-chain tracking

## Distribution Summary

| Category | Amount |
|----------|--------|
| Total Supply | 200,000,000 $LD |
| Snapshot Distribution | 15,500,000 $LD |
| Reserved for Future | 184,500,000 $LD |
| Eligible Wallets | 13 addresses |
| Total NFTs (snapshot) | 620 NFTs |

## Security Features

- ✅ ReentrancyGuard protection
- ✅ One claim per address
- ✅ Owner-only snapshot management
- ✅ Snapshot finalization lock
- ✅ Emergency withdrawal function
