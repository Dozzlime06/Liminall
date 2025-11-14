// NFT Snapshot Data - Pre-indexed for instant claims
const NFT_SNAPSHOT = {
  "0xa2eB6bE3bDe7e99a8E68E6252E006cEd620ff02f": {
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
