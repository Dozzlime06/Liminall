import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const ORIGINAL_NFT = "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B";
const WALLET = "0xa2eB6bE3bDe7e99a8E68E6252E006cEd620ff02f";

const NFT_ABI = ["function ownerOf(uint256) view returns (address)"];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const nft = new ethers.Contract(ORIGINAL_NFT, NFT_ABI, provider);
  
  console.log("Fast scanning starting from token 40...\n");
  
  const owned: number[] = [];
  const batchSize = 10;
  
  for (let i = 40; i <= 300; i++) {
    try {
      const owner = await nft.ownerOf(i);
      if (owner.toLowerCase() === WALLET.toLowerCase()) {
        owned.push(i);
      }
      
      if (owned.length >= 136) {
        console.log(`✅ Found all 136 tokens!`);
        break;
      }
      
      if (i % 20 === 0) {
        console.log(`Scanned up to ${i}, found ${owned.length} so far...`);
      }
    } catch (e) {
      // Not owned or doesn't exist
    }
  }
  
  console.log(`\n✅ Total: ${owned.length} tokens`);
  console.log("\nToken IDs:");
  console.log(JSON.stringify(owned));
}

main().catch(console.error);
