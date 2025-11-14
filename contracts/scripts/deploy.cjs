const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Liminal Dreams $LD Token System...\n");
  
  // Step 1: Deploy LDToken
  console.log("📝 Step 1: Deploying LDToken...");
  const LDToken = await hre.ethers.getContractFactory("LDToken");
  const ldToken = await LDToken.deploy();
  await ldToken.waitForDeployment();
  const ldTokenAddress = await ldToken.getAddress();
  console.log("✅ LDToken deployed to:", ldTokenAddress);
  console.log("   Total Supply: 200,000,000 $LD\n");
  
  // Step 2: Deploy ClaimManagerAuto
  console.log("📝 Step 2: Deploying ClaimManagerAuto...");
  const ClaimManagerAuto = await hre.ethers.getContractFactory("ClaimManagerAuto");
  const claimManager = await ClaimManagerAuto.deploy(
    "0x7d5c48a82e13168d84498548fe0a2282b9c1f16b", // originalNFT
    "0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685", // otherNFT
    ldTokenAddress,                                // ldToken
    "0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34"  // treasuryAddress
  );
  await claimManager.waitForDeployment();
  const claimManagerAddress = await claimManager.getAddress();
  console.log("✅ ClaimManagerAuto deployed to:", claimManagerAddress);
  console.log("\n");
  
  // Step 3: Fund ClaimManager
  console.log("📝 Step 3: Funding ClaimManager with 50M $LD...");
  const amount = hre.ethers.parseEther("50000000"); // 50M tokens
  const transferTx = await ldToken.transfer(claimManagerAddress, amount);
  await transferTx.wait();
  console.log("✅ ClaimManager funded with 50,000,000 $LD\n");
  
  // Summary
  console.log("════════════════════════════════════════");
  console.log("✅ DEPLOYMENT COMPLETE!");
  console.log("════════════════════════════════════════\n");
  console.log("📋 Contract Addresses:");
  console.log("   LDToken:", ldTokenAddress);
  console.log("   ClaimManager:", claimManagerAddress);
  console.log("\n📋 NFT Contracts:");
  console.log("   Original LD NFT: 0x7d5c48a82e13168d84498548fe0a2282b9c1f16b");
  console.log("   Other NFT: 0x9125E2d6827a00B0F8330D6ef7BEF07730Bac685");
  console.log("\n📋 Treasury:");
  console.log("   Address: 0x79E50cD04539AacDfE7cF6f8B55a381BdfcaCE34");
  console.log("\n🔧 Next Steps:");
  console.log("   1. Update client/src/lib/contracts.ts with addresses above");
  console.log("   2. Add $LD token to MetaMask");
  console.log("   3. Test claiming with NFT holder wallet");
  console.log("\n════════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
