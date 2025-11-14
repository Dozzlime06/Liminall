import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = '0x9B2522719ded681674944DD616ac77A30f4d4915';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const BASE_CHAIN_ID = 8453;

const WITHDRAW_ABI = ['function withdrawUSDC() external'];
const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

function App() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const wallet = wallets[0];

  useEffect(() => {
    if (authenticated && wallet) {
      fetchBalance();
    }
  }, [authenticated, wallet]);

  const fetchBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
      const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
      
      const balance = await usdcContract.balanceOf(CONTRACT_ADDRESS);
      const decimals = await usdcContract.decimals();
      
      setUsdcBalance(ethers.formatUnits(balance, decimals));
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch USDC balance');
    }
  };

  const withdrawUSDC = async () => {
    if (!wallet) return;

    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      await wallet.switchChain(BASE_CHAIN_ID);

      const provider = await wallet.getEthersProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, WITHDRAW_ABI, signer);

      const tx = await contract.withdrawUSDC();
      setTxHash(tx.hash);

      await tx.wait();
      
      await fetchBalance();
      setError('');
    } catch (err) {
      console.error('Withdrawal error:', err);
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user');
      } else if (err.message?.includes('insufficient funds')) {
        setError('Insufficient ETH for gas fees');
      } else {
        setError(err.message || 'Withdrawal failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="app">
        <div className="container">
          <h1>💰 USDC Withdrawal</h1>
          <p className="subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1>💰 USDC Withdrawal</h1>
        <p className="subtitle">Withdraw USDC from your contract on Base</p>

        {!authenticated ? (
          <button className="connect-btn" onClick={login}>
            Connect Wallet
          </button>
        ) : (
          <div className="connected">
            <div className="wallet-info">
              <p className="label">Connected Wallet</p>
              <p className="address">
                {wallet?.address ? (
                  <>
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </>
                ) : (
                  user?.wallet?.address ? (
                    <>
                      {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                    </>
                  ) : (
                    'Loading...'
                  )
                )}
              </p>
              <button className="logout-btn" onClick={logout}>
                Disconnect
              </button>
            </div>

            <div className="balance-card">
              <p className="label">Contract USDC Balance</p>
              <h2 className="balance">
                {parseFloat(usdcBalance).toFixed(2)} USDC
              </h2>
              <button className="refresh-btn" onClick={fetchBalance}>
                🔄 Refresh
              </button>
            </div>

            <button
              className="withdraw-btn"
              onClick={withdrawUSDC}
              disabled={isLoading || parseFloat(usdcBalance) === 0 || !wallet}
            >
              {isLoading ? 'Processing...' : 'Withdraw All USDC'}
            </button>

            {txHash && (
              <div className="success">
                ✅ Transaction submitted!
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on BaseScan
                </a>
              </div>
            )}

            {error && <div className="error">❌ {error}</div>}
          </div>
        )}

        <div className="contract-info">
          <p className="label">Contract Address</p>
          <a
            href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contract-link"
          >
            {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
