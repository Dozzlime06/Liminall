import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const RPC_URL = "https://rpc.hyperliquid.xyz/evm";
const CHAIN_ID = 999;

// Contract addresses
const ORIGINAL_NFT = "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B";
const OTHER_NFT = "0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685";
const LD_TOKEN = "0x02c1b88AbaB9bb72F3F67cc91f73Bf4800D419eE";
const TREASURY = "0x79E50cD04539AacDfE7cF6f8B55a381BdfcACE34";

async function main() {
  console.log("🚀 Deploying ClaimManagerBalance to Hyperliquid...\n");

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in environment");
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("📍 Deployer address:", wallet.address);
  
  const balance = await wallet.getBalance();
  console.log("💰 Balance:", ethers.utils.formatEther(balance), "HYPE\n");

  // Read contract
  const contractPath = path.join(process.cwd(), "contracts", "ClaimManagerBalance.sol");
  const source = fs.readFileSync(contractPath, "utf8");

  // Compile
  console.log("⚙️  Compiling contract...");
  const solc = require("solc");
  
  const input = {
    language: "Solidity",
    sources: {
      "ClaimManagerBalance.sol": { content: source },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
    const errors = output.errors.filter((e: any) => e.severity === "error");
    if (errors.length > 0) {
      console.error("❌ Compilation errors:");
      errors.forEach((err: any) => console.error(err.formattedMessage));
      process.exit(1);
    }
  }

  const contract = output.contracts["ClaimManagerBalance.sol"]["ClaimManagerBalance"];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  console.log("✅ Contract compiled\n");

  // Deploy
  console.log("📤 Deploying contract...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  const claimManager = await factory.deploy(
    ORIGINAL_NFT,
    OTHER_NFT,
    LD_TOKEN,
    TREASURY
  );

  console.log("⏳ Waiting for deployment...");
  await claimManager.deployed();

  console.log("\n✅ Contract deployed!");
  console.log("📍 ClaimManagerBalance:", claimManager.address);
  console.log("🔗 Explorer:", `https://explorer.hyperliquid.xyz/address/${claimManager.address}\n`);

  // Update deployed addresses
  const addresses = {
    ldToken: LD_TOKEN,
    claimManagerBalance: claimManager.address,
    claimManagerOld: "0xc2B4F51aB1fB944006069505d0c95cEB3F5b8098",
    originalNFT: ORIGINAL_NFT,
    otherNFT: OTHER_NFT,
    treasury: TREASURY,
    network: "Hyperliquid",
    chainId: CHAIN_ID,
  };

  const addressPath = path.join(process.cwd(), "contracts", "deployed-addresses.json");
  fs.writeFileSync(addressPath, JSON.stringify(addresses, null, 2));
  console.log("✅ Updated deployed-addresses.json\n");

  console.log("🎯 Next steps:");
  console.log("1. Fund contract with $LD tokens");
  console.log("2. Update frontend to use new contract address");
  console.log("3. Test claim flow");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
