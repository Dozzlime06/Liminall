import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const ORIGINAL_NFT = "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B";
const WALLET = "0xa2eB6bE3bDe7e99a8E68E6252E006cEd620ff02f";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  
  // ERC721 Transfer event signature
  const transferTopic = ethers.utils.id("Transfer(address,address,uint256)");
  const walletTopic = ethers.utils.hexZeroPad(WALLET, 32);
  
  console.log("Fetching Transfer events...\n");
  
  const logs = await provider.getLogs({
    address: ORIGINAL_NFT,
    topics: [transferTopic, null, walletTopic], // To wallet
    fromBlock: 0,
    toBlock: 'latest'
  });
  
  const tokenIds = new Set<number>();
  
  for (const log of logs) {
    const tokenId = ethers.BigNumber.from(log.topics[3]).toNumber();
    tokenIds.add(tokenId);
  }
  
  const ownedTokens = Array.from(tokenIds).sort((a, b) => a - b);
  
  console.log(`✅ Found ${ownedTokens.length} tokens from Transfer events`);
  console.log("\nToken IDs:");
  console.log(JSON.stringify(ownedTokens));
}

main().catch(console.error);
