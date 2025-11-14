import { useState } from 'react';
import { ConnectButton, useActiveAccount, useDisconnect, darkTheme } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Home, Menu, Bot, Sparkles, Search, Gift } from 'lucide-react';
import { client, hyperliquid } from '@/lib/thirdweb-client';

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("com.okex.wallet"),
];

export default function Header() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/claim-ld', label: 'Claim-LD', icon: Gift },
    { path: '/ai-agents', label: 'AI Agents', icon: Bot, badge: 'Soon' },
    { path: '/scan', label: 'Scan', icon: Search },
  ];

  const handleNavigate = (path: string) => {
    setLocation(path);
    setOpen(false);
  };

  return (
    <header className="flex items-center justify-between h-20 px-4 sm:px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3 sm:gap-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-hamburger-menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Sparkles className="w-5 h-5 text-primary" />
                Liminal Dreams
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-8">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  variant={location === item.path ? 'secondary' : 'ghost'}
                  className="justify-start gap-3 h-12"
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <h1 
          className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer" 
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          onClick={() => setLocation('/')}
        >
          Liminal Dreams
        </h1>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <ConnectButton
          client={client}
          wallets={wallets}
          chain={hyperliquid}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "#7c3aed",
              primaryButtonText: "#ffffff",
              accentButtonBg: "#7c3aed",
              accentButtonText: "#ffffff",
              primaryText: "#ffffff",
              secondaryText: "#a1a1aa",
              borderColor: "#27272a",
              modalBg: "#09090b",
            },
          })}
          connectButton={{
            label: "Connect Wallet",
            style: {
              fontSize: "14px",
              height: "40px",
              paddingLeft: "16px",
              paddingRight: "16px",
            },
          }}
          detailsButton={{
            displayBalanceToken: {
              [hyperliquid.id]: import.meta.env.VITE_CONTRACT_ADDRESS || "0x7d5C48A82E13168d84498548fe0a2282b9C1F16B",
            },
            style: {
              fontSize: "14px",
              height: "40px",
            },
          }}
        />
      </div>
    </header>
  );
}
