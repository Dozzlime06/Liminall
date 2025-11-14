import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Activity, Bot, TrendingUp, Users, Zap } from 'lucide-react';

const CONTRACT_ADDRESS = '0x7d5C48A82E13168d84498548fe0a2282b9C1F16B';

interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  totalVolume: string;
  totalTransactions: number;
  uniqueDeployers: number;
}

interface AgentPayment {
  id: number;
  txHash: string;
  agentId: string;
  deployer: string;
  amount: string;
  token: string;
  timestamp: Date;
}

interface AgentActivityItem {
  id: number;
  agentId: string;
  eventType: string;
  description: string;
  metadata: string | null;
  timestamp: Date;
}

export default function Scan() {
  const { data: stats } = useQuery<AgentStats>({
    queryKey: ['/api/agents/stats'],
  });

  const { data: payments = [] } = useQuery<AgentPayment[]>({
    queryKey: ['/api/agents/payments'],
  });

  const { data: activity = [] } = useQuery<AgentActivityItem[]>({
    queryKey: ['/api/agents/activity'],
  });

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              AI Agent Explorer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track AI agent deployments, payments, and on-chain activity
            </p>
          </div>

          {stats && (
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Active Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-active-agents">
                    {stats.activeAgents}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {stats.totalAgents} total
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-volume">
                    {stats.totalVolume} LD
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tokens spent</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-transactions">
                    {stats.totalTransactions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Payments</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Deployers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-unique-deployers">
                    {stats.uniqueDeployers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Unique wallets</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Payments
              </CardTitle>
              <CardDescription>
                Latest AI agent deployment payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No Agents Deployed Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    AI agent deployments will appear here once users start creating agents.
                    Visit the AI Agents page to deploy your first agent.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40 hover-elevate"
                      data-testid={`payment-${index}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(payment.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">
                            {payment.deployer.slice(0, 6)}...{payment.deployer.slice(-4)}
                          </span>
                          <span className="text-xs text-muted-foreground">deployed</span>
                          <span className="text-sm font-semibold text-primary">
                            {payment.agentId}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold">{payment.amount} {payment.token}</div>
                          <div className="text-xs text-muted-foreground">
                            {payment.txHash.slice(0, 8)}...
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://hyperevmscan.io/tx/${payment.txHash}`, '_blank')}
                          data-testid={`button-view-tx-${index}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5" />
                  Quick Links
                </CardTitle>
                <CardDescription>
                  Blockchain explorer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open('https://hyperevmscan.io', '_blank')}
                  data-testid="button-hyperevm-home"
                >
                  <ExternalLink className="w-4 h-4" />
                  HyperEVM Scan
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open('https://hyperevmscan.io/txs', '_blank')}
                  data-testid="button-hyperevm-txs"
                >
                  <Activity className="w-4 h-4" />
                  Recent Transactions
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Network Info</CardTitle>
                <CardDescription>
                  HyperEVM blockchain details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Chain ID:</span>
                    <span className="font-mono">999</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span>Hyperliquid</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Currency:</span>
                    <span>HYPE</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
