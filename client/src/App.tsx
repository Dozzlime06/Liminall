import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivyProviderWrapper } from "@/lib/privy-provider";
import Home from "@/pages/home";
import AIAgents from "@/pages/ai-agents";
import Scan from "@/pages/scan";
import NotFound from "@/pages/not-found";
import ChatWidget from "@/components/ChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ai-agents" component={AIAgents} />
      <Route path="/scan" component={Scan} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProviderWrapper>
        <TooltipProvider>
          <Toaster />
          <Router />
          <ChatWidget />
        </TooltipProvider>
      </PrivyProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;
