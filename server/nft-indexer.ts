// NFT Snapshot Data - Pre-indexed for instant claims
const NFT_SNAPSHOT = {
  "0xa2eb1d6e05c5ee0f2fa6d68b55a381bdfcace34": {
    originalTokenIds: Array.from({length: 136}, (_, i) => i), // 136 NFTs
    otherTokenIds: [],
  },
  // Add more wallets from snapshot as needed
};

interface NFTOwnership {
  [wallet: string]: {
    originalTokenIds: number[];
    otherTokenIds: number[];
    totalNFTs: number;
    lastUpdated: number;
  };
}

const nftCache: NFTOwnership = {};

async function indexNFTOwnership() {
  console.log("🔍 Loading NFT snapshot data...");
  
  // Load snapshot data into cache
  for (const [wallet, data] of Object.entries(NFT_SNAPSHOT)) {
    const walletLower = wallet.toLowerCase();
    nftCache[walletLower] = {
      originalTokenIds: data.originalTokenIds,
      otherTokenIds: data.otherTokenIds,
      totalNFTs: data.originalTokenIds.length + data.otherTokenIds.length,
      lastUpdated: Date.now()
    };
  }
  
  console.log(`✅ Loaded ${Object.keys(nftCache).length} wallets from snapshot`);
  console.log(`📊 Total NFTs indexed: ${Object.values(nftCache).reduce((sum, w) => sum + w.totalNFTs, 0)}`);
}

export function getNFTsForWallet(walletAddress: string) {
  const wallet = walletAddress.toLowerCase();
  
  if (!nftCache[wallet]) {
    return {
      originalTokenIds: [],
      otherTokenIds: [],
      totalNFTs: 0,
      lastUpdated: 0
    };
  }
  
  return nftCache[wallet];
}

export async function startIndexer() {
  console.log("🚀 Starting NFT Indexer...");
  
  // Load snapshot data (instant!)
  await indexNFTOwnership();
  
  console.log("✅ NFT Indexer ready!");
}

export { nftCache };
