import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const ORIGINAL_NFT = "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B";
const WALLET = "0xa2eB6bE3bDe7e99a8E68E6252E006cEd620ff02f";

const NFT_ABI = ["function ownerOf(uint256) view returns (address)"];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const nft = new ethers.Contract(ORIGINAL_NFT, NFT_ABI, provider);
  
  console.log("Scanning token IDs 1-1000 for ownership...\n");
  
  const owned: number[] = [];
  
  for (let i = 1; i <= 1000; i++) {
    try {
      const owner = await nft.ownerOf(i);
      if (owner.toLowerCase() === WALLET.toLowerCase()) {
        owned.push(i);
        console.log(`✅ Found token ${i}`);
      }
      
      if (owned.length >= 136) {
        console.log(`\n✅ Found all 136 tokens!`);
        break;
      }
    } catch (e) {
      // Token doesn't exist or not owned
    }
  }
  
  console.log(`\nTotal found: ${owned.length}`);
  console.log("Token IDs:", JSON.stringify(owned.slice(0, 20)) + (owned.length > 20 ? "..." : ""));
}

main().catch(console.error);
