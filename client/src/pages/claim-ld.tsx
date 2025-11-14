import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Wallet, CheckCircle2, AlertCircle, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  NFT_SNAPSHOT, 
  TOKENS_PER_NFT, 
  TOTAL_CLAIMABLE_TOKENS,
  getHolderData,
  hasClaimed,
  markAsClaimed
} from "@/data/nft-snapshot";

export default function ClaimLD() {
  const account = useActiveAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [holderData, setHolderData] = useState<{
    nftCount: number;
    claimableTokens: number;
  } | null>(null);

  useEffect(() => {
    if (account?.address) {
      const data = getHolderData(account.address);
      if (data) {
        setHolderData({
          nftCount: data.nftCount,
          claimableTokens: data.claimableTokens
        });
        setClaimed(hasClaimed(account.address));
      } else {
        setHolderData(null);
        setClaimed(false);
      }
    }
  }, [account?.address]);

  const handleClaim = async () => {
    if (!account || !holderData || claimed) return;
    
    setIsClaiming(true);
    // TODO: Implement actual blockchain claim transaction
    setTimeout(() => {
      markAsClaimed(account.address);
      setIsClaiming(false);
      setClaimed(true);
    }, 2000);
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
              Claim your Liminal Dreams tokens
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Token Claim
              </CardTitle>
              <CardDescription>
                NFT holders can claim 25,000 $LD per NFT
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
              ) : !holderData ? (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Not Eligible</h3>
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
                        {holderData.nftCount} NFTs
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Claimable Tokens</span>
                      <span className="text-2xl font-bold text-primary">
                        {holderData.claimableTokens.toLocaleString()} $LD
                      </span>
                    </div>
                  </div>

                  {claimed ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Already Claimed!</h3>
                      <p className="text-muted-foreground">
                        You have already claimed {holderData.claimableTokens.toLocaleString()} $LD tokens
                      </p>
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
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Claim {holderData.claimableTokens.toLocaleString()} $LD Tokens
                        </>
                      )}
                    </Button>
                  )}

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">Calculation:</h4>
                    <p className="text-sm text-muted-foreground">
                      {holderData.nftCount} NFTs × {TOKENS_PER_NFT.toLocaleString()} $LD = {holderData.claimableTokens.toLocaleString()} $LD
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                All Eligible Wallets
              </CardTitle>
              <CardDescription>
                Snapshot of all NFT holders and their claimable amounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {NFT_SNAPSHOT.map((holder, index) => (
                  <div 
                    key={holder.address}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-mono text-sm">
                          {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {holder.nftCount} NFTs
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {holder.claimableTokens.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">$LD</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Distribution</span>
                  <span className="text-xl font-bold text-primary">
                    {TOTAL_CLAIMABLE_TOKENS.toLocaleString()} $LD
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Across 13 holders for 620 NFTs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
