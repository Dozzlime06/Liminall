import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const OTHER_NFT = "0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685";

const ENUMERABLE_ABI = [
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function supportsInterface(bytes4) view returns (bool)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const nft = new ethers.Contract(OTHER_NFT, ENUMERABLE_ABI, provider);
  
  // ERC721Enumerable interface ID
  const enumerableId = "0x780e9d63";
  
  try {
    const supports = await nft.supportsInterface(enumerableId);
    console.log("✅ Other NFT supports ERC721Enumerable:", supports);
    
    if (supports) {
      console.log("\n✅ CAN USE OPTION B - Auto-sweep will work!");
    } else {
      console.log("\n❌ Cannot use auto-sweep - contract doesn't support enumeration");
    }
  } catch (e) {
    console.log("❌ Contract doesn't support supportsInterface - likely not enumerable");
  }
}

main().catch(console.error);
