import { useState, useEffect } from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { prepareContractCall } from "thirdweb";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Wallet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTRACTS, CLAIM_MANAGER_ABI, NFT_ABI } from "@/lib/contracts";
import { client } from "@/lib/thirdweb-client";

const hyperliquid = defineChain({
  id: 999,
  rpc: "https://rpc.hyperliquid.xyz/evm",
});

export default function ClaimLD() {
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [originalNftCount, setOriginalNftCount] = useState(0);
  const [otherNftCount, setOtherNftCount] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [agreedToSweep, setAgreedToSweep] = useState(false);

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
      setOriginalNftCount(originalCount);
      setOtherNftCount(otherCount);
      
      if (totalNFTs > 0) {
        const claimable = totalNFTs * CONTRACTS.TOKENS_PER_NFT;
        setClaimableAmount(claimable);
      }
      
      // Check if Other NFT is approved for ClaimManager
      if (otherCount > 0) {
        const isApprovedForAll = await otherNFTContract.isApprovedForAll(
          account.address,
          CONTRACTS.CLAIM_MANAGER
        );
        setIsApproved(isApprovedForAll);
        console.log("🔐 Other NFT approved for ClaimManager:", isApprovedForAll);
      } else {
        // If no Other NFTs, approval not needed
        setIsApproved(true);
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
      // Fetch tokenIds from backend (instant!)
      console.log("📡 Fetching NFT data from server...");
      const response = await fetch(`/api/nft/wallet/${account.address}`);
      const data = await response.json();
      
      const originalTokenIds = data.originalTokenIds || [];
      const otherTokenIds = data.otherTokenIds || [];
      
      console.log("✅ Got tokenIds:", originalTokenIds.length, "original,", otherTokenIds.length, "other");
      
      if (originalTokenIds.length === 0 && otherTokenIds.length === 0) {
        alert("No NFTs found for your wallet");
        setIsClaiming(false);
        return;
      }
      
      // Use Thirdweb's sendTransaction with full ABI
      const claimContract = getContract({
        client,
        chain: hyperliquid,
        address: CONTRACTS.CLAIM_MANAGER,
        abi: CLAIM_MANAGER_ABI,
      });
      
      console.log("📝 Preparing transaction...");
      const tx = prepareContractCall({
        contract: claimContract,
        method: {
          name: "claimTokens",
          type: "function" as const,
          inputs: [
            { name: "originalTokenIds", type: "uint256[]", internalType: "uint256[]" },
            { name: "otherTokenIds", type: "uint256[]", internalType: "uint256[]" },
          ],
          outputs: [],
          stateMutability: "nonpayable" as const,
        },
        params: [originalTokenIds, otherTokenIds],
      });
      
      console.log("📤 Sending transaction...");
      sendTransaction(tx, {
        onSuccess: (result) => {
          console.log("✅ Success:", result.transactionHash);
          setTxHash(result.transactionHash);
          setClaimed(true);
          alert(`Successfully claimed ${claimableAmount.toLocaleString()} $LD tokens!`);
          setIsClaiming(false);
        },
        onError: (error) => {
          console.error("❌ Error:", error);
          alert(`Claim failed: ${error.message}`);
          setIsClaiming(false);
        },
      });
    } catch (error: any) {
      console.error("❌ Claim error:", error);
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
                      disabled={isClaiming || (otherNftCount > 0 && !agreedToSweep)}
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
                          {otherNftCount > 0 && !agreedToSweep 
                            ? `Agree to terms to claim` 
                            : `Claim ${claimableAmount.toLocaleString()} $LD Tokens`}
                        </>
                      )}
                    </Button>
                  )}

                  {/* WARNING: Other NFTs get swept */}
                  {otherNftCount > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-orange-500 mb-2">⚠️ Important Notice</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            You have <strong>{otherNftCount} Other NFT{otherNftCount > 1 ? 's' : ''}</strong> that will be <strong className="text-orange-500">automatically transferred to treasury</strong> when you claim.
                          </p>
                          {originalNftCount > 0 && (
                            <p className="text-xs text-green-400 mb-3">
                              ✓ Your {originalNftCount} Original LD NFT{originalNftCount > 1 ? 's' : ''} will remain in your wallet
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <input
                              type="checkbox"
                              id="agree-sweep"
                              checked={agreedToSweep}
                              onChange={(e) => setAgreedToSweep(e.target.checked)}
                              className="w-4 h-4 rounded border-orange-500"
                            />
                            <label htmlFor="agree-sweep" className="text-sm cursor-pointer">
                              I understand {otherNftCount} Other NFT{otherNftCount > 1 ? 's' : ''} will be permanently transferred
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">How it works:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>{nftCount} NFTs × {CONTRACTS.TOKENS_PER_NFT.toLocaleString()} $LD = {claimableAmount.toLocaleString()} $LD</li>
                      {originalNftCount > 0 && (
                        <li className="text-green-400">Original LD NFTs: You keep your {originalNftCount} NFT{originalNftCount > 1 ? 's' : ''}</li>
                      )}
                      {otherNftCount > 0 && (
                        <li className="text-orange-500">Other NFTs: {otherNftCount} NFT{otherNftCount > 1 ? 's' : ''} auto-swept to treasury</li>
                      )}
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
