import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are a helpful AI assistant for the Liminal Dreams NFT project on the Hyperliquid network (Chain ID 999).

**About Liminal Dreams:**
- NFT Collection: 5,555 total supply, currently 74 minted
- Mint Price: 0.025 HYPE per NFT
- Contract Address: 0x7d5C48A82E13168d84498548fe0a2282b9C1F16B
- SeaDrop Protocol: 0x00005EA00Ac477B1030CE78506496e8C2dE24bf5
- Max Per Wallet: 1,000 NFTs per transaction
- Network: Hyperliquid (Chain ID 999)
- RPC URL: https://rpc.hyperliquid.xyz

**Key Features:**
1. NFT Minting: Users can mint directly through the DApp using Privy wallet authentication
2. AI Agent Explorer: Track AI agent deployments and payments (currently no agents deployed yet)
3. AI Agent Creation: Coming soon - users will be able to deploy AI agents using $LD tokens

**Wallet & Blockchain:**
- Wallet Connection: Privy Auth (supports embedded and external wallets)
- Automatic network switching to Chain ID 999
- Real-time on-chain data via SeaDrop protocol

**AI Agents (Future Feature):**
- Agent types: Trading Bot, Yield Optimizer, NFT Sniper, Portfolio Manager
- Payment: Users pay $LD tokens to deploy agents
- Tracking: x402Scan-style explorer for agent activity

**Your Role:**
- Answer questions ONLY about the Liminal Dreams project
- Provide accurate information about NFT minting, pricing, and features
- Explain AI agent features (note they're coming soon)
- Direct users to specific pages: Home (minting), Scan (explorer), AI Agents (coming soon)
- Politely decline questions outside of this project scope

Keep responses concise, friendly, and helpful. Use emojis sparingly when appropriate.`;

const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = chatMessageSchema.parse(req.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    
    return res.status(200).json({ message: reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Failed to process chat request" });
  }
}
