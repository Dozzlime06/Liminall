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
  'function withdraw(address token, uint256 amount) external',
  'function withdrawToken(address token, uint256 amount) external',
  'function emergencyWithdraw(address token) external',
  'function owner() view returns (address)'
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

    try {
      const owner = await contract.owner();
      console.log(`🔐 Contract owner: ${owner}`);
      if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
        console.log('⚠️  Warning: Your wallet is not the contract owner');
      }
    } catch (e) {
      console.log('ℹ️  Could not verify contract ownership (owner() function may not exist)');
    }

    console.log('\n🚀 Attempting withdrawal...');
    console.log(`Trying different withdrawal function signatures...`);

    let tx;
    let success = false;

    const withdrawFunctions = [
      { name: 'withdraw', fn: () => contract.withdraw(USDC_ADDRESS, balance) },
      { name: 'withdrawToken', fn: () => contract.withdrawToken(USDC_ADDRESS, balance) },
      { name: 'emergencyWithdraw', fn: () => contract.emergencyWithdraw(USDC_ADDRESS) }
    ];

    for (const { name, fn } of withdrawFunctions) {
      try {
        console.log(`\nTrying ${name}()...`);
        tx = await fn();
        console.log(`✅ Transaction submitted with ${name}()`);
        success = true;
        break;
      } catch (error) {
        console.log(`❌ ${name}() failed: ${error.message.split('\n')[0]}`);
      }
    }

    if (!success) {
      console.log('\n❌ All withdrawal methods failed.');
      console.log('\nℹ️  This could mean:');
      console.log('   - The contract uses a different withdrawal function name');
      console.log('   - Only the owner can withdraw (and you may not be the owner)');
      console.log('   - The contract has specific withdrawal restrictions');
      console.log('\n💡 Tip: Check the contract source code on BaseScan to see the exact withdrawal function');
      return;
    }

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
