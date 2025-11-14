# Liminal Dreams NFT Minting DApp

A decentralized application for minting Liminal Dreams NFTs using $HYPE tokens on the Hyperliquid network.

## Overview

This DApp provides a sleek, user-friendly interface for minting NFTs from the Liminal Dreams collection. Built with React, Vite, and Privy authentication, it connects directly to your deployed smart contract at `0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Wallet Connection**: Thirdweb SDK v5 (MetaMask, OKX, Coinbase, Rainbow, Rabby)
- **Blockchain**: Ethers.js v5 for smart contract interaction
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Dark theme with purple accents (#7c3aed primary color)

## Key Features

### NFT Minting (Live)
✅ Privy wallet connection with support for multiple wallet types
✅ Real-time contract data from SeaDrop protocol (price, max mint, supply)
✅ Direct minting through DApp using SeaDrop (same as OpenSea)
✅ Dynamic quantity selector (1-1,000 NFTs per transaction)
✅ Collection progress bar (74/5,555 minted)
✅ NFT artwork carousel gallery (4 images)
✅ Automatic network switching to Chain ID 999 (Hyperliquid)
✅ Transaction status notifications with success/error handling
✅ Responsive design with hamburger navigation
✅ Glass morphism effects and smooth animations

### AI Agent Explorer (Live)
✅ Real-time AI agent activity dashboard
✅ Live statistics: Active Agents, Total Volume (LD), Transactions, Deployers
✅ Recent payment transactions display (agent deployments)
✅ Empty state messaging for when no agents exist yet
✅ Integration-ready backend API for agent data
✅ Direct links to HyperEVMScan for transaction viewing
✅ Network information display (Chain ID 999)
✅ Prepared for future agent deployment feature

### AI Chat Support (Live)
✅ Floating chat button (bottom-right corner, available on all pages)
✅ OpenAI GPT-4o-mini powered AI assistant
✅ Project-specific knowledge (NFT minting, pricing, AI agents, contracts)
✅ Multi-turn conversation with context retention
✅ Clear chat functionality
✅ Politely declines off-topic questions
✅ Uses Replit AI Integrations (no API key needed)

### AI Agent Creation (Coming Soon)
🔜 Pay $LD tokens to deploy AI agents
🔜 Automated on-chain task execution
🔜 Real-time monitoring via x402Scan
🔜 Multiple agent types (Trading Bot, Yield Optimizer, NFT Sniper, Portfolio Manager)
🔜 Transparent payment and activity tracking

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Hamburger nav + wallet connection
│   │   ├── MintingInterface.tsx       # NFT minting UI
│   │   ├── NFTGallery.tsx             # NFT artwork carousel
│   │   ├── ProgressBar.tsx            # Collection progress bar
│   │   └── Footer.tsx                 # Footer with GitBook link
│   ├── pages/
│   │   ├── home.tsx                   # NFT minting page
│   │   ├── scan.tsx                   # Blockchain explorer with analytics
│   │   ├── ai-agents.tsx              # AI agent creation (coming soon)
│   │   └── not-found.tsx              # 404 page
│   ├── lib/
│   │   ├── privy-provider.tsx         # Privy auth wrapper
│   │   └── queryClient.ts             # TanStack Query setup
│   ├── abi/
│   │   ├── contractAbi.json           # NFT contract ABI
│   │   └── seadropAbi.json            # SeaDrop protocol ABI
│   └── App.tsx                        # Root component with routing
```

## Environment Variables

The following environment variables are configured:

- `VITE_PRIVY_APP_ID`: Your Privy application ID (required for wallet connection)
- `VITE_CONTRACT_ADDRESS`: `0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`
- `VITE_CHAIN_ID`: `999` (Hyperliquid network)
- `VITE_RPC_URL`: `https://rpc.hyperliquid.xyz`

## Smart Contract Integration

The DApp connects to **two contracts** for full functionality:

### NFT Contract (`0x7d5C48A82E13168d84498548fe0a2282b9C1F16B`)
- `totalSupply()`: Returns current minted NFT count (71 NFTs)
- `maxSupply()`: Returns maximum NFT collection size (5,555 NFTs)
- Holds the actual NFT tokens

### SeaDrop Protocol (`0x00005EA00Ac477B1030CE78506496e8C2dE24bf5`)
- `getPublicDrop()`: Returns minting configuration (price, max amount, timing)
- `mintPublic()`: Handles minting logic (same as OpenSea uses)
- **Current Settings** (fetched real-time):
  - Mint Price: **0.025 $HYPE**
  - Max Per Wallet: **1,000 NFTs**
  - Start Time: Active
  - End Time: Active

**Direct Minting**: Users can now mint directly through the DApp using the SeaDrop protocol. This is the same infrastructure that OpenSea uses, but integrated directly into your landing page.

## User Flow

### NFT Minting Flow
1. **Open DApp**: Navigate to home page via hamburger menu
2. **Connect Wallet**: Authenticate via Privy (supports embedded + external wallets)
3. **View Collection**: See real-time supply (74/5,555), pricing (0.025 HYPE), and progress
4. **Browse Gallery**: Swipe through NFT artwork carousel (4 preview images)
5. **Select Quantity**: Choose how many NFTs to mint (1-1,000)
6. **Mint**: Click "Mint" button (uses SeaDrop protocol)
7. **Approve Transaction**: Confirm in wallet (quantity × 0.025 HYPE)
8. **Success**: NFTs minted, supply updates automatically

### AI Agent Explorer Flow
1. **Navigate**: Open "Scan" from hamburger menu
2. **View Stats**: See agent statistics (active agents, volume, transactions, deployers)
3. **Browse Payments**: View agent deployment payment transactions
4. **Empty State**: Informative message when no agents deployed yet
5. **Quick Links**: Access HyperEVMScan and Liminal Dreams NFT contract
6. **Network Info**: View network details (Chain ID 999, Hyperliquid)

### AI Agent Creation Flow (Coming Soon)
1. **Navigate**: Open "AI Agents" from hamburger menu
2. **Select Agent Type**: Choose from Trading Bot, Yield Optimizer, NFT Sniper, etc.
3. **Configure**: Set agent name and parameters
4. **Pay $LD**: Send $LD tokens for agent deployment
5. **x402Scan**: Detects payment and deploys agent automatically
6. **Track**: Monitor agent activity via x402Scan dashboard

## Development Notes

- All NFT data is fetched on-chain (no backend database needed)
- Contract interaction uses ethers.js v5 for compatibility
- Privy handles wallet connection, including embedded wallets
- The app automatically switches to the correct network (Chain 999)
- SeaDrop integration provides real-time minting configuration
- Minting uses the same protocol as OpenSea (SeaDrop public mint)
- Transaction errors are caught and displayed with user-friendly messages
- Supply updates automatically after successful mints

## Deployment

Ready to deploy to Vercel! See `DEPLOYMENT.md` for complete instructions.

**Required Environment Variables:**
- `VITE_PRIVY_APP_ID` - Privy wallet authentication
- `VITE_CONTRACT_ADDRESS` - NFT contract address (already set)
- `VITE_CHAIN_ID` - Hyperliquid Chain ID 999 (already set)
- `VITE_RPC_URL` - RPC endpoint (already set)
- `OPENAI_API_KEY` - For AI chat support
- `SESSION_SECRET` - Random session secret

## Recent Changes

**2025-11-09**: AI Chat Support Widget
- ✅ Added floating chat button (bottom-right corner, all pages)
- ✅ Integrated OpenAI GPT-4o-mini via Replit AI Integrations
- ✅ Created /api/support/chat backend endpoint with project knowledge
- ✅ Built ChatWidget component with conversation UI
- ✅ Multi-turn context retention for natural conversations
- ✅ Clear chat and loading states
- ✅ System prompt with comprehensive Liminal Dreams project info
- ✅ Fixed SVG icon visibility on primary background

**2025-11-09**: AI Agent Explorer
- ✅ Built "AI Agent Explorer" page (x402scan-style for agent activity)
- ✅ Created backend data model: agents, payments, activity schemas
- ✅ Implemented storage interface with agent-related methods
- ✅ Added API routes: /api/agents, /api/agents/payments, /api/agents/stats, /api/agents/activity
- ✅ Stats dashboard: active agents, total volume (LD), transactions, deployers
- ✅ Recent payments display with transaction details
- ✅ Empty state messaging (no agents deployed yet)
- ✅ Mobile-responsive header with improved spacing
- ✅ Added Scan navigation item to hamburger menu

**2025-11-09**: SeaDrop Integration & Direct Minting
- ✅ Integrated SeaDrop protocol contract for minting
- ✅ Fetch real-time mint price and max amount from SeaDrop
- ✅ Enabled direct minting through DApp (no OpenSea redirect needed)
- ✅ Successfully tested minting flow (confirmed 70→71 NFTs)
- ✅ Created Privy wallet integration
- ✅ Built minting interface with quantity controls
- ✅ Added progress bar for collection tracking
- ✅ Configured smart contract connection
- ✅ Implemented transaction handling with error states
