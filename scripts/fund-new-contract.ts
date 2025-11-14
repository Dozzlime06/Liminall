import { ethers } from "ethers";

const RPC_URL = "https://rpc.hyperliquid.xyz/evm";
const LD_TOKEN = "0x02c1b88AbaB9bb72F3F67cc91f73Bf4800D419eE";
const NEW_CLAIM_MANAGER = "0x4e2985C7c328015c1c1340756593903e0352f23e";
const AMOUNT = "50000000"; // 50M tokens

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function main() {
  console.log("💰 Funding ClaimManagerBalance with $LD tokens...\n");

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found");
  }

  const cleanedKey = privateKey.replace(/\s+/g, '');
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(cleanedKey, provider);

  console.log("📍 From:", wallet.address);
  console.log("📍 To:", NEW_CLAIM_MANAGER);

  const token = new ethers.Contract(LD_TOKEN, ERC20_ABI, wallet);
  const decimals = await token.decimals();
  const amount = ethers.utils.parseUnits(AMOUNT, decimals);

  console.log(`💸 Amount: ${AMOUNT} $LD\n`);

  // Check balance
  const balance = await token.balanceOf(wallet.address);
  console.log("Current balance:", ethers.utils.formatUnits(balance, decimals), "$LD");

  if (balance.lt(amount)) {
    console.log("❌ Insufficient balance!");
    process.exit(1);
  }

  // Transfer
  console.log("\n📤 Sending tokens...");
  const tx = await token.transfer(NEW_CLAIM_MANAGER, amount);
  console.log("⏳ Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("✅ Tokens transferred!");

  // Verify
  const contractBalance = await token.balanceOf(NEW_CLAIM_MANAGER);
  console.log("\n💰 Contract balance:", ethers.utils.formatUnits(contractBalance, decimals), "$LD");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
