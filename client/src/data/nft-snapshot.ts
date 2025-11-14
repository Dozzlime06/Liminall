export interface HolderSnapshot {
  address: string;
  nftCount: number;
  claimableTokens: number;
}

export const TOKENS_PER_NFT = 25000;

export const NFT_SNAPSHOT: HolderSnapshot[] = [
  {
    address: "0x486c331bdfb1db8803e315bac67922d7e023a435",
    nftCount: 195,
    claimableTokens: 195 * TOKENS_PER_NFT,
  },
  {
    address: "0xa2eb6be3bde7e99a8e68e6252e006ced620ff02f",
    nftCount: 136,
    claimableTokens: 136 * TOKENS_PER_NFT,
  },
  {
    address: "0x9999918a1f51ca6f13ab5433c6c6af9670b33999",
    nftCount: 120,
    claimableTokens: 120 * TOKENS_PER_NFT,
  },
  {
    address: "0xebe6cc6820a76705b6654fdd1254256dcd54f1df",
    nftCount: 100,
    claimableTokens: 100 * TOKENS_PER_NFT,
  },
  {
    address: "0x36ebd79fd8f5cec6b4914fa0d37e6aa2b2ed4815",
    nftCount: 30,
    claimableTokens: 30 * TOKENS_PER_NFT,
  },
  {
    address: "0x010e1f4890d3905053ce0cbec8792345ea54808d",
    nftCount: 10,
    claimableTokens: 10 * TOKENS_PER_NFT,
  },
  {
    address: "0x9030b7e27f89bf6738946dae88c803a7faabf066",
    nftCount: 10,
    claimableTokens: 10 * TOKENS_PER_NFT,
  },
  {
    address: "0xa9b38ae5b53272306476dcd8ace28b1bc7b88c07",
    nftCount: 6,
    claimableTokens: 6 * TOKENS_PER_NFT,
  },
  {
    address: "0x1cdbdb52c21f511d939e6a0b286511f073d45419",
    nftCount: 5,
    claimableTokens: 5 * TOKENS_PER_NFT,
  },
  {
    address: "0x5d856f28ecc4385eca4adcd64c40fc69ba602a39",
    nftCount: 4,
    claimableTokens: 4 * TOKENS_PER_NFT,
  },
  {
    address: "0x9babe3fa7167a493497c2b3345bb2ee7e7fbffbc",
    nftCount: 2,
    claimableTokens: 2 * TOKENS_PER_NFT,
  },
  {
    address: "0x741e9a0eec918d60c2d208b0b2cb579b239a6b4f",
    nftCount: 1,
    claimableTokens: 1 * TOKENS_PER_NFT,
  },
  {
    address: "0x9faeeb684b98e051d221811105fcc2631c90cbef",
    nftCount: 1,
    claimableTokens: 1 * TOKENS_PER_NFT,
  },
];

export const TOTAL_NFTS = 620;
export const TOTAL_CLAIMABLE_TOKENS = TOTAL_NFTS * TOKENS_PER_NFT;

export function getHolderData(address: string): HolderSnapshot | null {
  const normalizedAddress = address.toLowerCase();
  return NFT_SNAPSHOT.find(
    (holder) => holder.address.toLowerCase() === normalizedAddress
  ) || null;
}

export function isClaimEligible(address: string): boolean {
  return getHolderData(address) !== null;
}

export function getClaimedAddresses(): Set<string> {
  const claimed = localStorage.getItem("ld-claimed-addresses");
  return claimed ? new Set(JSON.parse(claimed)) : new Set();
}

export function markAsClaimed(address: string): void {
  const claimed = getClaimedAddresses();
  claimed.add(address.toLowerCase());
  localStorage.setItem("ld-claimed-addresses", JSON.stringify([...claimed]));
}

export function hasClaimed(address: string): boolean {
  return getClaimedAddresses().has(address.toLowerCase());
}
