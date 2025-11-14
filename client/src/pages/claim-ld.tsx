import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { sendTransaction, prepareTransaction, prepareContractCall } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Wallet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTRACTS, CLAIM_MANAGER_ABI, NFT_ABI } from "@/lib/contracts";
import { client } from "@/lib/thirdweb-client";

const hyperliquid = defineChain(999);

export default function ClaimLD() {
  const account = useActiveAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [otherNFTCount, setOtherNFTCount] = useState(0);
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
      
      // Check if already claimed
      const claimContract = new ethers.Contract(
        CONTRACTS.CLAIM_MANAGER,
        CLAIM_MANAGER_ABI,
        provider
      );
      
      const hasClaimed = await claimContract.walletClaimed(account.address);
      if (hasClaimed) {
        const claimedAmt = await claimContract.claimedAmount(account.address);
        setClaimed(true);
        setClaimableAmount(ethers.utils.formatUnits(claimedAmt, 18));
        setIsLoading(false);
        return;
      }
      
      // Check Original NFT balance
      const originalNFTContract = new ethers.Contract(
        CONTRACTS.ORIGINAL_LD_NFT,
        NFT_ABI,
        provider
      );
      
      const originalBalance = await originalNFTContract.balanceOf(account.address);
      const originalCount = originalBalance.toNumber();
      
      // Check Other NFT balance
      const otherNFTContract = new ethers.Contract(
        CONTRACTS.OTHER_NFT,
        NFT_ABI,
        provider
      );
      
      const otherBalance = await otherNFTContract.balanceOf(account.address);
      const otherCount = otherBalance.toNumber();
      
      const totalNFTs = originalCount + otherCount;
      setNftCount(totalNFTs);
      setOtherNFTCount(otherCount);
      
      if (totalNFTs > 0) {
        const claimable = totalNFTs * CONTRACTS.TOKENS_PER_NFT;
        setClaimableAmount(claimable);
      }
    } catch (error) {
      console.error("Error fetching claimable data:", error);
    }
    setIsLoading(false);
  };

  const handleClaim = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    setIsClaiming(true);
    try {
      // Step 1: If has Other NFTs, need approval first
      if (otherNFTCount > 0) {
        console.log(`🔍 You have ${otherNFTCount} Other NFTs - checking approval...`);
        const provider = new ethers.providers.JsonRpcProvider(CONTRACTS.RPC_URL);
        const otherNFTContract = new ethers.Contract(
          CONTRACTS.OTHER_NFT,
          NFT_ABI,
          provider
        );
        
        const isApproved = await otherNFTContract.isApprovedForAll(
          account.address,
          CONTRACTS.CLAIM_MANAGER
        );
        
        if (!isApproved) {
          console.log("🔐 Requesting approval for Other NFTs...");
          
          const iface = new ethers.utils.Interface(NFT_ABI);
          const approvalData = iface.encodeFunctionData("setApprovalForAll", [
            CONTRACTS.CLAIM_MANAGER,
            true
          ]);
          
          const approvalTransaction = prepareTransaction({
            client,
            chain: hyperliquid,
            to: CONTRACTS.OTHER_NFT,
            data: approvalData,
          });
          
          const approvalTx = await sendTransaction({
            transaction: approvalTransaction,
            account,
          });
          
          console.log("✅ Approval successful:", approvalTx.transactionHash);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          console.log("✅ Already approved!");
        }
      }
      
      // Step 2: Call claimTokens() - NO parameters needed!
      console.log("📤 Calling claimTokens()...");
      
      const claimIface = new ethers.utils.Interface(CLAIM_MANAGER_ABI);
      const claimData = claimIface.encodeFunctionData("claimTokens", []);
      
      const claimTransaction = prepareTransaction({
        client,
        chain: hyperliquid,
        to: CONTRACTS.CLAIM_MANAGER,
        data: claimData,
      });
      
      const result = await sendTransaction({
        transaction: claimTransaction,
        account,
      });
      
      console.log("✅ Claim successful:", result.transactionHash);
      setTxHash(result.transactionHash);
      setClaimed(true);
      alert(`Successfully claimed ${claimableAmount.toLocaleString()} $LD tokens!`);
      setIsClaiming(false);
    } catch (error: any) {
      console.error("❌ Error:", error);
      alert(`Failed: ${error.message || "Unknown error"}`);
      setIsClaiming(false);
    }
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
            <p className="text-muted-foreground text-lg">
              NFT holders receive 25,000 $LD per NFT
            </p>
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
              ) : claimed ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Already Claimed!</h3>
                  <p className="text-muted-foreground mb-4">
                    You have already claimed your tokens
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {parseFloat(claimableAmount).toLocaleString()} $LD
                  </p>
                  {txHash && (
                    <a 
                      href={`https://explorer.hyperliquid.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-4 inline-block"
                    >
                      View Transaction →
                    </a>
                  )}
                </div>
              ) : nftCount === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
                  <p className="text-muted-foreground">
                    This wallet doesn't hold any eligible NFTs
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                      <p className="font-mono text-sm">
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                      </p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">NFTs Held</p>
                      <p className="text-2xl font-bold text-primary">{nftCount} NFTs</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Claimable Tokens</p>
                    <p className="text-4xl font-bold text-primary mb-1">
                      {claimableAmount.toLocaleString()} $LD
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {nftCount} NFTs × 25,000 $LD
                    </p>
                  </div>

                  <Button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {otherNFTCount > 0 ? "Approving & Claiming..." : "Claiming..."}
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Claim {claimableAmount.toLocaleString()} $LD Tokens
                      </>
                    )}
                  </Button>

                  {otherNFTCount > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        ℹ️ You have {otherNFTCount} Other NFT{otherNFTCount > 1 ? 's' : ''}. These will be automatically transferred to treasury when you claim.
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">$LD Token Contract</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs sm:text-sm break-all">
                      {CONTRACTS.LD_TOKEN}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(CONTRACTS.LD_TOKEN);
                        alert("Token address copied!");
                      }}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-xs whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                  <a
                    href={`https://explorer.hyperliquid.xyz/address/${CONTRACTS.LD_TOKEN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                  >
                    View on Explorer →
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
