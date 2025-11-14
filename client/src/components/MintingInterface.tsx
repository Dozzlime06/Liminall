import { useState, useEffect } from 'react';
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Loader2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import contractAbi from '../abi/contractAbi.json';
import seadropAbi from '../abi/seadropAbi.json';
import { client, hyperliquid } from '@/lib/thirdweb-client';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';
const SEADROP_ADDRESS = '0x00005EA00Ac477B1030CE78506496e8C2dE24bf5';
const OPENSEA_FEE_RECIPIENT = '0x0000a26b00c1F0DF003000390027140000fAa719';
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://rpc.hyperliquid.xyz/evm';

export default function MintingInterface() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending: isSending } = useSendTransaction();
  const { toast } = useToast();

  const [mintQuantity, setMintQuantity] = useState(1);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(10000);
  const [mintPrice, setMintPrice] = useState<string | null>(null);
  const [maxMintAmount, setMaxMintAmount] = useState<number | null>(null);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchContractData = async () => {
      console.log('🔍 Fetching contract data...');
      console.log('📍 NFT Contract:', CONTRACT_ADDRESS);
      console.log('📍 SeaDrop Contract:', SEADROP_ADDRESS);
      console.log('🌐 RPC URL:', RPC_URL);
      
      try {
        const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, rpcProvider);
        const seadrop = new ethers.Contract(SEADROP_ADDRESS, seadropAbi, rpcProvider);

        console.log('📡 Fetching NFT supply data...');
        
        const total = await nftContract.totalSupply().catch((e: any) => {
          console.error('❌ totalSupply failed:', e);
          return ethers.BigNumber.from(0);
        });
        
        const max = await nftContract.maxSupply().catch((e: any) => {
          console.error('❌ maxSupply failed:', e);
          return ethers.BigNumber.from(10000);
        });

        console.log('📡 Fetching SeaDrop public drop settings...');
        
        let price: ethers.BigNumber | null = null;
        let maxMint: ethers.BigNumber | null = null;
        
        try {
          const publicDrop = await seadrop.getPublicDrop(CONTRACT_ADDRESS);
          console.log('✅ SeaDrop Public Drop Data:', publicDrop);
          
          price = publicDrop.mintPrice;
          maxMint = ethers.BigNumber.from(publicDrop.maxTotalMintableByWallet);
          
          console.log('✅ Mint Price from SeaDrop:', ethers.utils.formatEther(price), 'HYPE');
          console.log('✅ Max Mint Amount from SeaDrop:', maxMint.toString());
        } catch (e: any) {
          console.warn('⚠️ SeaDrop data not available, using fallback values');
          price = ethers.utils.parseEther('0.025');
          maxMint = ethers.BigNumber.from(1000);
        }

        console.log('✅ Contract data received:');
        console.log('  Total Supply:', total.toString());
        console.log('  Max Supply:', max.toString());
        console.log('  Mint Price (wei):', price?.toString() || 'Not set');
        console.log('  Max Mint Amount:', maxMint?.toString() || 'Not set');

        setTotalSupply(total.toNumber());
        setMaxSupply(max.toNumber());
        setMintPrice(price ? ethers.utils.formatEther(price) : null);
        setMaxMintAmount(maxMint ? maxMint.toNumber() : null);
        
        console.log('✅ State updated successfully');
      } catch (err) {
        console.error('❌ Error fetching contract data:', err);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Unable to fetch contract data. Please check your connection.',
        });
      } finally {
        setFetchingData(false);
      }
    };
    fetchContractData();
  }, [toast]);

  const handleMint = async () => {
    if (!account) {
      toast({
        variant: 'destructive',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to mint NFTs.',
      });
      return;
    }

    if (mintQuantity < 1 || (maxMintAmount && mintQuantity > maxMintAmount)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Quantity',
        description: `Please mint between 1 and ${maxMintAmount || 'unlimited'} NFTs.`,
      });
      return;
    }

    try {
      const pricePerNft = mintPrice ? ethers.utils.parseEther(mintPrice) : ethers.BigNumber.from(0);
      const totalHype = pricePerNft.mul(mintQuantity);
      
      const minterAddress = account.address;
      
      console.log('🚀 Preparing mint transaction...');
      console.log('  NFT Contract:', CONTRACT_ADDRESS);
      console.log('  Fee Recipient:', OPENSEA_FEE_RECIPIENT);
      console.log('  Minter:', minterAddress);
      console.log('  Quantity:', mintQuantity);
      console.log('  Total HYPE:', ethers.utils.formatEther(totalHype));
      
      toast({
        title: 'Preparing Transaction',
        description: 'Please confirm in your wallet...',
      });

      const seadropContract = getContract({
        client,
        chain: hyperliquid,
        address: SEADROP_ADDRESS,
      });

      const transaction = prepareContractCall({
        contract: seadropContract,
        method: "function mintPublic(address nftContract, address feeRecipient, address minterIfNotPayer, uint256 quantity) payable",
        params: [CONTRACT_ADDRESS, OPENSEA_FEE_RECIPIENT, minterAddress, BigInt(mintQuantity)],
        value: BigInt(totalHype.toString()),
        gas: BigInt(300000),
      });

      console.log('✅ Transaction prepared, sending...');

      sendTransaction(transaction, {
        onSuccess: async (result) => {
          console.log('✅ Transaction confirmed:', result);
          
          toast({
            title: 'Success!',
            description: `Successfully minted ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}!`,
          });

          setTimeout(async () => {
            const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);
            const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, rpcProvider);
            const newTotal = await nftContract.totalSupply();
            setTotalSupply(newTotal.toNumber());
          }, 2000);
          
          setMintQuantity(1);
        },
        onError: (error) => {
          console.error('❌ Minting error:', error);
          
          let errorMessage = 'Transaction failed. Please try again.';
          
          if (error.message?.includes('user rejected')) {
            errorMessage = 'You cancelled the transaction.';
          } else if (error.message?.includes('insufficient funds')) {
            errorMessage = 'Insufficient HYPE balance.';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          toast({
            variant: 'destructive',
            title: 'Minting Failed',
            description: errorMessage,
          });
        },
      });
    } catch (err: any) {
      console.error('❌ Minting preparation error:', err);
      
      let errorMessage = 'Failed to prepare transaction. Please try again.';
      
      if (err.message?.includes('account')) {
        errorMessage = 'Wallet connection lost. Please reconnect your wallet.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Minting Failed',
        description: errorMessage,
      });
    }
  };

  const incrementQuantity = () => {
    if (!maxMintAmount || mintQuantity < maxMintAmount) {
      setMintQuantity(mintQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (mintQuantity > 1) {
      setMintQuantity(mintQuantity - 1);
    }
  };

  const totalCost = mintPrice ? (parseFloat(mintPrice) * mintQuantity).toFixed(4) : '0';

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Mint Your NFT
          </CardTitle>
          <CardDescription className="text-center text-base">
            {account ? 'Select quantity and mint your Liminal Dreams NFT' : 'Connect your wallet to begin minting'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {fetchingData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Collection Progress</span>
                  <span className="text-sm font-semibold" data-testid="text-supply-info">
                    {totalSupply} / {maxSupply} Minted
                  </span>
                </div>
                <ProgressBar current={totalSupply} max={maxSupply} />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Mint Price</div>
                  <div className="text-lg font-bold" data-testid="text-mint-price">
                    {mintPrice !== null ? `${mintPrice} HYPE` : 'Not set'}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Max Per Transaction</div>
                  <div className="text-lg font-bold" data-testid="text-max-mint">
                    {maxMintAmount !== null ? maxMintAmount : 'Not set'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="quantity" className="text-base">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={isSending || mintQuantity <= 1}
                    data-testid="button-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={maxMintAmount || 999}
                    value={mintQuantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      const max = maxMintAmount || 999;
                      setMintQuantity(Math.min(Math.max(1, val), max));
                    }}
                    className="text-center text-2xl font-bold h-14"
                    disabled={isSending}
                    data-testid="input-quantity"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={isSending || (maxMintAmount !== null && mintQuantity >= maxMintAmount)}
                    data-testid="button-increase"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg p-4 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-medium">Total Cost</span>
                <span className="text-2xl font-bold" data-testid="text-total-cost">
                  {totalCost} HYPE
                </span>
              </div>

              <Button
                onClick={handleMint}
                disabled={!account || isSending}
                className="w-full h-14 text-lg font-semibold"
                data-testid="button-mint"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : account ? (
                  `Mint ${mintQuantity} NFT${mintQuantity > 1 ? 's' : ''}`
                ) : (
                  'Connect Wallet to Mint'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
