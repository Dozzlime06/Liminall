import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Wallet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTRACTS, CLAIM_MANAGER_ABI, NFT_ABI } from "@/lib/contracts";

export default function ClaimLD() {
  const account = useActiveAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (account?.address) {
      fetchClaimableData();
    }
  }, [account?.address]);

  const fetchClaimableData = async () => {
    if (!account) return;
    
    setIsLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider(CONTRACTS.RPC_URL);
      const claimManager = new ethers.Contract(
        CONTRACTS.CLAIM_MANAGER,
        CLAIM_MANAGER_ABI,
        provider
      );
      
      const nftContract = new ethers.Contract(
        CONTRACTS.ORIGINAL_LD_NFT,
        NFT_ABI,
        provider
      );
      
      const balance = await nftContract.balanceOf(account.address);
      const nftCountNum = balance.toNumber();
      setNftCount(nftCountNum);
      
      if (nftCountNum > 0) {
        const claimable = nftCountNum * CONTRACTS.TOKENS_PER_NFT;
        setClaimableAmount(claimable);
      }
    } catch (error) {
      console.error("Error fetching claimable data:", error);
    }
    setIsLoading(false);
  };

  const handleClaim = async () => {
    if (!account || !(window as any).ethereum) {
      alert("Please connect your wallet");
      return;
    }

    setIsClaiming(true);
    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      
      const nftContract = new ethers.Contract(
        CONTRACTS.ORIGINAL_LD_NFT,
        NFT_ABI,
        provider
      );
      
      const balance = await nftContract.balanceOf(account.address);
      const nftCountNum = balance.toNumber();
      
      const originalTokenIds: number[] = [];
      const otherTokenIds: number[] = [];
      
      for (let i = 0; i < 10000 && originalTokenIds.length < nftCountNum; i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          if (owner.toLowerCase() === account.address.toLowerCase()) {
            originalTokenIds.push(i);
          }
        } catch {}
      }
      
      const claimManager = new ethers.Contract(
        CONTRACTS.CLAIM_MANAGER,
        CLAIM_MANAGER_ABI,
        signer
      );
      
      console.log("Claiming with tokenIds:", originalTokenIds, otherTokenIds);
      
      const tx = await claimManager.claimTokens(originalTokenIds, otherTokenIds);
      setTxHash(tx.hash);
      
      await tx.wait();
      
      setClaimed(true);
      alert(`Successfully claimed ${claimableAmount.toLocaleString()} $LD tokens!`);
    } catch (error: any) {
      console.error("Claim error:", error);
      alert(`Claim failed: ${error.message || "Unknown error"}`);
    }
    setIsClaiming(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Claim $LD Tokens
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              NFT holders receive 25,000 $LD per NFT
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live on Hyperliquid • Chain ID {CONTRACTS.CHAIN_ID}
            </div>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Token Claim
              </CardTitle>
              <CardDescription>
                Connect your wallet and claim your $LD tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!account ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Please connect your wallet to continue
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click "Connect Wallet" in the header above
                  </p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">
                    Checking your NFT balance...
                  </p>
                </div>
              ) : nftCount === 0 ? (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
                  <p className="text-muted-foreground mb-2">
                    This wallet does not hold any Liminal Dreams NFTs
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Wallet: {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Wallet Address</span>
                      <span className="font-mono text-sm">
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">NFTs Held</span>
                      <span className="text-xl font-bold">
                        {nftCount} NFTs
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Claimable Tokens</span>
                      <span className="text-2xl font-bold text-primary">
                        {claimableAmount.toLocaleString()} $LD
                      </span>
                    </div>
                  </div>

                  {claimed ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Claim Successful!</h3>
                      <p className="text-muted-foreground mb-2">
                        You claimed {claimableAmount.toLocaleString()} $LD tokens
                      </p>
                      {txHash && (
                        <a 
                          href={`https://explorer.hyperliquid.xyz/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Transaction
                        </a>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={handleClaim}
                      disabled={isClaiming}
                      className="w-full h-12 text-base"
                      size="lg"
                    >
                      {isClaiming ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Claim {claimableAmount.toLocaleString()} $LD Tokens
                        </>
                      )}
                    </Button>
                  )}

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">How it works:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>{nftCount} NFTs × {CONTRACTS.TOKENS_PER_NFT.toLocaleString()} $LD = {claimableAmount.toLocaleString()} $LD</li>
                      <li>One signature to claim all tokens</li>
                      <li>You keep your NFTs</li>
                      <li>Tokens sent directly to your wallet</li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-xs text-blue-300">
                      <strong>Smart Contract:</strong> {CONTRACTS.CLAIM_MANAGER.slice(0, 10)}...{CONTRACTS.CLAIM_MANAGER.slice(-8)}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
