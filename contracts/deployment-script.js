// Deployment script for Liminal Dreams Hybrid Claim System
// Network: Hyperliquid (Chain ID 999)

const deploymentConfig = {
  network: {
    name: "Hyperliquid",
    chainId: 999,
    rpc: "https://rpc.hyperliquid.xyz/evm"
  },
  
  contracts: {
    nftContract: "0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685",
    treasuryAddress: "0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34"
  },
  
  snapshot: [
    { address: "0x486c331bdfb1db8803e315bac67922d7e023a435", nftCount: 195 },
    { address: "0xa2eb6be3bde7e99a8e68e6252e006ced620ff02f", nftCount: 136 },
    { address: "0x9999918a1f51ca6f13ab5433c6c6af9670b33999", nftCount: 120 },
    { address: "0xebe6cc6820a76705b6654fdd1254256dcd54f1df", nftCount: 100 },
    { address: "0x36ebd79fd8f5cec6b4914fa0d37e6aa2b2ed4815", nftCount: 30 },
    { address: "0x010e1f4890d3905053ce0cbec8792345ea54808d", nftCount: 10 },
    { address: "0x9030b7e27f89bf6738946dae88c803a7faabf066", nftCount: 10 },
    { address: "0xa9b38ae5b53272306476dcd8ace28b1bc7b88c07", nftCount: 6 },
    { address: "0x1cdbdb52c21f511d939e6a0b286511f073d45419", nftCount: 5 },
    { address: "0x5d856f28ecc4385eca4adcd64c40fc69ba602a39", nftCount: 4 },
    { address: "0x9babe3fa7167a493497c2b3345bb2ee7e7fbffbc", nftCount: 2 },
    { address: "0x741e9a0eec918d60c2d208b0b2cb579b239a6b4f", nftCount: 1 },
    { address: "0x9faeeb684b98e051d221811105fcc2631c90cbef", nftCount: 1 }
  ],
  
  tokensPerNFT: 25000,
  totalSupply: 200000000
};

// Step-by-step deployment instructions
console.log(`
====================================
DEPLOYMENT INSTRUCTIONS
====================================

1. Deploy LDToken.sol
   - Total Supply: ${deploymentConfig.totalSupply} $LD
   - You will receive all tokens

2. Deploy ClaimManagerHybrid.sol
   Constructor parameters:
   - nftContract: ${deploymentConfig.contracts.nftContract}
   - ldToken: [LDToken address from step 1]
   - treasuryAddress: ${deploymentConfig.contracts.treasuryAddress}

3. Set Snapshot Data
   Call: setSnapshotAllocations(addresses[], nftCounts[])
   
   Addresses:
   ${deploymentConfig.snapshot.map(s => `  "${s.address}"`).join(',\n')}
   
   NFT Counts:
   ${deploymentConfig.snapshot.map(s => `  ${s.nftCount}`).join(',\n')}

4. Finalize Snapshot
   Call: finalizeSnapshot()

5. Fund ClaimManager
   Transfer 15,500,000 $LD to ClaimManager address

6. Update Frontend
   - Add ClaimManager address to client/src/lib/contracts.ts
   - Add LDToken address

====================================
USERS CAN NOW CLAIM!
====================================

How it works:
✅ Snapshot users claim their allocation
✅ If they hold NFTs → Auto-swept to treasury
✅ If no NFTs → Still get tokens based on snapshot
✅ One claim per address

Total to distribute: 15,500,000 $LD
Remaining for future: 184,500,000 $LD
`);

module.exports = deploymentConfig;
