const { ethers } = require('ethers');
const fs = require('fs');
const solc = require('solc');
const path = require('path');

// Find imports for OpenZeppelin
function findImports(importPath) {
  try {
    const fullPath = path.resolve(__dirname, '../node_modules', importPath);
    const contents = fs.readFileSync(fullPath, 'utf8');
    return { contents };
  } catch (error) {
    return { error: 'File not found' };
  }
}

async function compileContract(contractName) {
  console.log(`\n📝 Compiling ${contractName}...`);
  
  const source = fs.readFileSync(`./contracts/${contractName}.sol`, 'utf8');
  
  const input = {
    language: 'Solidity',
    sources: {
      [`${contractName}.sol`]: {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  };
  
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
  
  if (output.errors) {
    const errors = output.errors.filter(e => e.severity === 'error');
    if (errors.length > 0) {
      console.error('❌ Compilation errors:');
      errors.forEach(err => console.error(err.formattedMessage));
      throw new Error('Compilation failed');
    }
  }
  
  const contract = output.contracts[`${contractName}.sol`][contractName];
  console.log(`✅ ${contractName} compiled successfully!`);
  
  return {
    abi: contract.abi,
    bytecode: '0x' + contract.evm.bytecode.object
  };
}

async function main() {
  console.log("🚀 Deploying Liminal Dreams $LD Token System...\n");
  console.log("════════════════════════════════════════\n");
  
  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider("https://rpc.hyperliquid.xyz/evm");
  
  // Handle private key format (with or without 0x prefix)
  let privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in environment");
  }
  // Remove any whitespace
  privateKey = privateKey.replace(/\s/g, '');
  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("📝 Deployer wallet:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.utils.formatEther(balance), "ETH\n");
  
  // Step 1: Compile and Deploy LDToken
  console.log("════════════════════════════════════════");
  console.log("STEP 1: Deploy LDToken");
  console.log("════════════════════════════════════════");
  
  const ldToken = await compileContract('LDToken');
  const LDTokenFactory = new ethers.ContractFactory(ldToken.abi, ldToken.bytecode, wallet);
  
  console.log("\n🚀 Deploying LDToken...");
  const ldTokenContract = await LDTokenFactory.deploy();
  await ldTokenContract.deployed();
  
  console.log("✅ LDToken deployed!");
  console.log("   Address:", ldTokenContract.address);
  console.log("   Supply: 200,000,000 $LD");
  
  // Step 2: Compile and Deploy ClaimManagerAuto
  console.log("\n════════════════════════════════════════");
  console.log("STEP 2: Deploy ClaimManagerAuto");
  console.log("════════════════════════════════════════");
  
  const claimManager = await compileContract('ClaimManagerAuto');
  const ClaimManagerFactory = new ethers.ContractFactory(
    claimManager.abi,
    claimManager.bytecode,
    wallet
  );
  
  // Use checksummed addresses (convert to lowercase first to avoid checksum errors)
  const originalNFT = ethers.utils.getAddress("0x7d5c48a82e13168d84498548fe0a2282b9c1f16b".toLowerCase());
  const otherNFT = ethers.utils.getAddress("0x9125e2d6827a00b0f8330d6ef7bef07730bac685".toLowerCase());
  const treasury = ethers.utils.getAddress("0x79e50cd04539aacdfe7cf6f8b55a381bdfcace34".toLowerCase());
  
  console.log("\n🚀 Deploying ClaimManagerAuto...");
  console.log("   Original NFT:", originalNFT);
  console.log("   Other NFT:", otherNFT);
  console.log("   LD Token:", ldTokenContract.address);
  console.log("   Treasury:", treasury);
  
  const claimManagerContract = await ClaimManagerFactory.deploy(
    originalNFT,
    otherNFT,
    ldTokenContract.address,
    treasury
  );
  await claimManagerContract.deployed();
  
  console.log("\n✅ ClaimManagerAuto deployed!");
  console.log("   Address:", claimManagerContract.address);
  
  // Step 3: Fund ClaimManager
  console.log("\n════════════════════════════════════════");
  console.log("STEP 3: Fund ClaimManager");
  console.log("════════════════════════════════════════");
  
  const fundAmount = ethers.utils.parseEther("50000000"); // 50M tokens
  console.log("\n💰 Transferring 50,000,000 $LD to ClaimManager...");
  
  const transferTx = await ldTokenContract.transfer(claimManagerContract.address, fundAmount);
  await transferTx.wait();
  
  console.log("✅ ClaimManager funded!");
  
  // Final Summary
  console.log("\n════════════════════════════════════════");
  console.log("✅ DEPLOYMENT COMPLETE!");
  console.log("════════════════════════════════════════\n");
  
  console.log("📋 Contract Addresses:");
  console.log("   LDToken:", ldTokenContract.address);
  console.log("   ClaimManager:", claimManagerContract.address);
  
  console.log("\n📋 NFT Contracts:");
  console.log("   Original LD NFT:", originalNFT);
  console.log("   Other NFT:", otherNFT);
  
  console.log("\n📋 Treasury:");
  console.log("   Address:", treasury);
  
  console.log("\n🔧 Next Steps:");
  console.log("   1. Update client/src/lib/contracts.ts:");
  console.log(`      LD_TOKEN: "${ldTokenContract.address}",`);
  console.log(`      CLAIM_MANAGER: "${claimManagerContract.address}",`);
  console.log("   2. Test claiming with NFT holder wallet");
  console.log("\n════════════════════════════════════════\n");
  
  // Save addresses
  const addresses = {
    ldToken: ldTokenContract.address,
    claimManager: claimManagerContract.address,
    originalNFT: originalNFT,
    otherNFT: otherNFT,
    treasury: treasury,
    network: "Hyperliquid",
    chainId: 999
  };
  
  fs.writeFileSync(
    './contracts/deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-addresses.json\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
