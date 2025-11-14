# Liminal Dreams ($LD) Token Claim Contracts

## Overview
Smart contracts for the $LD token claim system on Hyperliquid network.

## Contracts

### 1. LDToken.sol
- **Type**: ERC20 Token
- **Name**: Liminal Dreams
- **Symbol**: $LD
- **Total Supply**: 200,000,000 tokens
- **Features**: 
  - Standard ERC20 functionality
  - Access control for claim manager

### 2. ClaimManager.sol
- **Purpose**: Manages NFT-to-token claims
- **NFT Contract**: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685
- **Treasury Address**: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34
- **Claim Rate**: 25,000 $LD per NFT

**Features**:
- Users exchange NFTs for $LD tokens
- NFTs transferred to treasury address
- Prevents double claims using tokenId tracking
- Supports batch claims (up to 50 NFTs at once)
- ReentrancyGuard protection

## Deployment Steps

### 1. Deploy LDToken
```solidity
constructor() // Deploys with 200M tokens to deployer
```

### 2. Deploy ClaimManager
```solidity
constructor(
  nftContract: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685,
  ldToken: [LDToken address from step 1],
  treasuryAddress: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34
)
```

### 3. Setup
```solidity
// Transfer tokens to ClaimManager
ldToken.transfer(claimManagerAddress, amount)

// Grant claim manager role (optional)
ldToken.grantClaimManagerRole(claimManagerAddress)
```

## User Flow

1. User connects wallet and approves NFT contract
2. User calls `claimTokens([tokenId1, tokenId2, ...])`
3. Contract verifies ownership and claim status
4. NFTs transferred to treasury (0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34)
5. User receives 25,000 $LD per NFT

## Security Features

- ✅ ReentrancyGuard prevents reentrancy attacks
- ✅ TokenId tracking prevents double claims
- ✅ Ownership verification before transfer
- ✅ Batch size limit (50 NFTs max)
- ✅ Emergency withdrawal for owner

## Network
- **Chain**: Hyperliquid
- **Chain ID**: 999
- **RPC**: https://rpc.hyperliquid.xyz/evm
