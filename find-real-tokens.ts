import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const ORIGINAL_NFT = "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B";
const WALLET = "0xa2eB6bE3bDe7e99a8E68E6252E006cEd620ff02f";

const NFT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function tokenOfOwnerByIndex(address, uint256) view returns (uint256)"
];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const nft = new ethers.Contract(ORIGINAL_NFT, NFT_ABI, provider);
  
  const balance = await nft.balanceOf(WALLET);
  console.log(`Wallet owns ${balance} Original NFTs\n`);
  
  console.log("First 10 actual token IDs owned:");
  for (let i = 0; i < Math.min(10, balance.toNumber()); i++) {
    const tokenId = await nft.tokenOfOwnerByIndex(WALLET, i);
    console.log(`  Index ${i}: Token ID ${tokenId}`);
  }
}

main().catch(console.error);
