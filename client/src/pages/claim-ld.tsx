import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Wallet, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClaimLD() {
  const account = useActiveAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async () => {
    if (!account) return;
    
    setIsClaiming(true);
    // TODO: Implement actual claim logic
    setTimeout(() => {
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
                Connect your wallet to claim your $LD tokens
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
                      <span className="text-muted-foreground">Available to Claim</span>
                      <span className="text-2xl font-bold text-primary">
                        0 $LD
                      </span>
                    </div>
                  </div>

                  {claimed ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Claim Successful!</h3>
                      <p className="text-muted-foreground">
                        Your $LD tokens have been claimed
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
                          Claim $LD Tokens
                        </>
                      )}
                    </Button>
                  )}

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">How it works:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Connect your wallet to check eligibility</li>
                      <li>Click "Claim $LD Tokens" to receive your allocation</li>
                      <li>Tokens will be sent directly to your wallet</li>
                      <li>Use $LD tokens for NFT minting and AI agent deployment</li>
                    </ul>
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
