// ─── Chain config + GhostTownVault ABI + helpers ─────────────────────────────
// Deploy GhostTownVault.sol to mainnet + Sepolia, then fill in CONTRACT_ADDRESSES.

export const CHAINS = {
  mainnet: {
    id: 1,
    name: "Ethereum Mainnet",
    shortName: "ETH",
    color: "#627eea",
    rpc: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public fallback
    explorer: "https://etherscan.io",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    isTestnet: false,
  },
  sepolia: {
    id: 11155111,
    name: "Sepolia Testnet",
    shortName: "SEP",
    color: "#cfb5f0",
    rpc: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "SepoliaETH", symbol: "sETH", decimals: 18 },
    isTestnet: true,
  },
} as const;

export type ChainKey = keyof typeof CHAINS;

// ── Fill in after deploying GhostTownVault.sol ──────────────────────────────
export const CONTRACT_ADDRESSES: Record<ChainKey, string> = {
  mainnet: "0x0000000000000000000000000000000000000000", // TODO: deploy
  sepolia: "0x0000000000000000000000000000000000000000", // TODO: deploy
};

// ── ABI (minimal surface for the frontend) ──────────────────────────────────
export const VAULT_ABI = [
  // ERC-1155 balance
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  // Items
  "function itemCount() view returns (uint256)",
  "function getItem(uint256 id) view returns (tuple(uint256 id, string name, uint8 season, uint8 power, uint8 tier, string category, uint256 maxSupply, uint256 minted, uint256 price, bool vaultLocked, bool active))",
  "function getAllItems() view returns (tuple(uint256 id, string name, uint8 season, uint8 power, uint8 tier, string category, uint256 maxSupply, uint256 minted, uint256 price, bool vaultLocked, bool active)[])",
  // Mint
  "function mint(uint256 itemId, uint256 amount) payable",
  // Vault
  "function vaultBalance() view returns (uint256)",
  "function vaultThreshold() view returns (uint256)",
  "function depositVault() payable",
  // Marketplace
  "function list(uint256 itemId, uint256 amount, uint256 priceEach) returns (uint256)",
  "function buy(uint256 lid, uint256 amount) payable",
  "function cancelListing(uint256 lid)",
  "function listingCount() view returns (uint256)",
  "function getListings(uint256 from, uint256 count) view returns (tuple(address seller, uint256 itemId, uint256 amount, uint256 priceEach, bool active)[], uint256[])",
  // Season
  "function currentSeason() view returns (uint8)",
  "function nextVaultUnlock() view returns (uint256)",
  // Events
  "event ItemMinted(address indexed to, uint256 indexed itemId, uint256 amount, uint256 season)",
  "event VaultDeposit(address indexed from, uint256 amount)",
  "event ItemUnlockedFromVault(uint256 indexed itemId, string itemName)",
  "event Listed(uint256 indexed listingId, address seller, uint256 itemId, uint256 amount, uint256 priceEach)",
  "event Sale(uint256 indexed listingId, address buyer, uint256 amount, uint256 total)",
] as const;

// ── Item display helpers ─────────────────────────────────────────────────────
export const CATEGORY_ICONS: Record<string, string> = {
  weapon:    "⚔️",
  armor:     "🛡️",
  relic:     "💠",
  key:       "🗝️",
  vehicle:   "🏍️",
  skin:      "🧥",
  companion: "🤖",
};

export const TIER_LABELS: Record<number, string> = {
  1: "GENESIS",
  2: "ALPHA",
};

export const TIER_COLORS: Record<number, string> = {
  1: "#fbbf24",  // gold
  2: "#9f7aea",  // purple
};

export const RARITY_BY_SUPPLY: (supply: number) => string = (s) => {
  if (s <= 3)  return "legendary";
  if (s <= 9)  return "epic";
  if (s <= 21) return "rare";
  if (s <= 42) return "uncommon";
  return "common";
};

export const RARITY_COLORS: Record<string, string> = {
  legendary: "#f59e0b",
  epic:      "#9f7aea",
  rare:      "#4299e1",
  uncommon:  "#38b2ac",
  common:    "#6b7280",
};

// ── Edition sizes used ───────────────────────────────────────────────────────
export const GENESIS_EDITIONS = [3,6,9,11,12,13,21,30,33,36,42,69];

// ── Vault progress helper ────────────────────────────────────────────────────
export function vaultProgress(balance: bigint, threshold: bigint): number {
  if (threshold === 0n) return 0;
  return Math.min(1, Number((balance * 100n) / threshold) / 100);
}

// ── Switch chain via MetaMask/EIP-1193 ──────────────────────────────────────
export async function switchChain(chainKey: ChainKey): Promise<void> {
  const chain = CHAINS[chainKey];
  const hexId  = "0x" + chain.id.toString(16);
  try {
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexId }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId:            hexId,
          chainName:          chain.name,
          nativeCurrency:     chain.nativeCurrency,
          rpcUrls:            [chain.rpc],
          blockExplorerUrls:  [chain.explorer],
        }],
      });
    } else throw e;
  }
}

// ── Format ETH amount ────────────────────────────────────────────────────────
export function fmtEth(wei: bigint, decimals = 4): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(decimals).replace(/\.?0+$/, "") + " ETH";
}
