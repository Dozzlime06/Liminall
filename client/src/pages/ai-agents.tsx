import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Sparkles, TrendingUp, Shield } from 'lucide-react';

export default function AIAgents() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-card/95 backdrop-blur-sm border-2 border-primary rounded-2xl p-8 shadow-2xl pointer-events-auto text-center max-w-md">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Coming Soon
              </h2>
              <p className="text-muted-foreground">
                AI Agent creation will be available soon. Pay with $LD tokens to deploy intelligent on-chain agents.
              </p>
            </div>
          </div>

          <div className="blur-sm pointer-events-none select-none opacity-50">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Create AI Agent
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Deploy intelligent agents by paying $LD tokens. Agents execute predefined on-chain tasks automatically.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Agent Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your AI agent settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-type">Agent Type</Label>
                    <Select>
                      <SelectTrigger id="agent-type">
                        <SelectValue placeholder="Select agent type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trading-bot">Trading Bot</SelectItem>
                        <SelectItem value="yield-optimizer">Yield Optimizer</SelectItem>
                        <SelectItem value="nft-sniper">NFT Sniper</SelectItem>
                        <SelectItem value="portfolio-manager">Portfolio Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      placeholder="My Trading Agent"
                      data-testid="input-agent-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Payment Amount ($LD)</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      placeholder="100"
                      data-testid="input-payment-ld"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Agent Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 text-primary" />
                        <span>Automated on-chain task execution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 text-primary" />
                        <span>Real-time monitoring via x402Scan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 text-primary" />
                        <span>Transparent payment tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 text-primary" />
                        <span>Customizable agent parameters</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/10">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Agent Type</span>
                        <span className="font-medium">Trading Bot</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Required</span>
                        <span className="font-medium">100 LD</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Deployment Time</span>
                        <span className="font-medium">~2 minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="lg" className="text-lg px-12" data-testid="button-create-agent">
                <Bot className="w-5 h-5 mr-2" />
                Create AI Agent
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
