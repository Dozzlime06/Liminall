import { createThirdwebClient, defineChain } from "thirdweb";

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "placeholder",
});

export const hyperliquid = defineChain({
  id: 999,
  name: "Hyperliquid",
  nativeCurrency: {
    name: "HYPE",
    symbol: "HYPE",
    decimals: 18,
  },
  rpc: "https://rpc.hyperliquid.xyz/evm",
});
