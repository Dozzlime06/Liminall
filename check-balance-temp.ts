import { ethers } from "ethers";

const RPC = "https://rpc.hyperliquid.xyz/evm";
const CLAIM_MANAGER = "0xc2B4F51aB1fB944006069505d0c95cEB3F5b8098";
const LD_TOKEN = "0x02c1b88AbaB9bb72F3F67cc91f73Bf4800D419eE";

const ERC20_ABI = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const token = new ethers.Contract(LD_TOKEN, ERC20_ABI, provider);
  
  const balance = await token.balanceOf(CLAIM_MANAGER);
  const decimals = await token.decimals();
  
  const formatted = ethers.utils.formatUnits(balance, decimals);
  
  console.log("ClaimManager $LD Balance:", formatted);
  console.log("Needed for 136 NFTs:", (136 * 25000).toLocaleString(), "$LD");
  console.log("Has enough?", parseFloat(formatted) >= 136 * 25000);
}

main().catch(console.error);
