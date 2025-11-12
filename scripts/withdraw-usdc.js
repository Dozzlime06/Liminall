require('dotenv').config();
const { ethers } = require('ethers');

const BASE_RPC_URL = 'https://mainnet.base.org';
const BASE_CHAIN_ID = 8453;
const CONTRACT_ADDRESS = '0x9B2522719ded681674944DD616ac77A30f4d4915';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

const WITHDRAW_ABI = [
  'function withdrawUSDC() external'
];

async function withdrawUSDC() {
  try {
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY not found in .env file');
    }

    console.log('🔗 Connecting to Base network...');
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log(`📍 Deployer wallet: ${wallet.address}`);
    
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, WITHDRAW_ABI, wallet);

    console.log('\n💰 Checking USDC balance...');
    const balance = await usdcContract.balanceOf(CONTRACT_ADDRESS);
    const decimals = await usdcContract.decimals();
    const symbol = await usdcContract.symbol();
    
    const formattedBalance = ethers.formatUnits(balance, decimals);
    console.log(`📊 Contract USDC Balance: ${formattedBalance} ${symbol}`);

    if (balance === 0n) {
      console.log('⚠️  No USDC to withdraw');
      return;
    }

    console.log('\n🚀 Attempting USDC withdrawal...');
    console.log(`Calling withdrawUSDC() function...`);

    const tx = await contract.withdrawUSDC();

    console.log(`\n📝 Transaction Hash: ${tx.hash}`);
    console.log('⏳ Waiting for confirmation...');
    
    const receipt = await tx.wait();
    
    console.log(`\n✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`💸 Successfully withdrew ${formattedBalance} ${symbol}`);
    console.log(`🔗 View on BaseScan: https://basescan.org/tx/${tx.hash}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  }
}

withdrawUSDC();
