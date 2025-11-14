import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const CLAIM_MANAGER = "0xc2B4F51aB1fB944006069505d0c95cEB3F5b8098";
const ORIGINAL_NFT = "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B";
const WALLET = "0xa2eB6bE3bDe7e99a8E68E6252E006cEd620ff02f";

const CLAIM_ABI = [
  "function originalNFTClaimed(uint256) view returns (bool)",
  "function otherNFTClaimed(uint256) view returns (bool)"
];

const NFT_ABI = ["function ownerOf(uint256) view returns (address)"];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const claim = new ethers.Contract(CLAIM_MANAGER, CLAIM_ABI, provider);
  const nft = new ethers.Contract(ORIGINAL_NFT, NFT_ABI, provider);
  
  console.log("Checking first 10 token IDs...\n");
  
  for (let i = 0; i < 10; i++) {
    const claimed = await claim.originalNFTClaimed(i);
    const owner = await nft.ownerOf(i);
    const isOwner = owner.toLowerCase() === WALLET.toLowerCase();
    
    console.log(`Token ${i}: ${claimed ? "CLAIMED" : "Available"}, Owner: ${owner.slice(0,8)}..., You own it: ${isOwner}`);
  }
}

main().catch(console.error);
