// ═══════════════════════════════════════════════════════════════
// ERC-8004 Agent Registration Script
// Registers Herald-01, Engineer-02, Sentinel-03 in the ERC-8004
// Identity Registry at 0x8004A818BFB912233c491871b3d84c89A494BD9e
// on Sepolia testnet.
//
// Run: node scripts/register-erc8004.mjs
// Requires: RARE_PRIVATE_KEY + SEPOLIA_RPC_URL in .env.local
// ═══════════════════════════════════════════════════════════════
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// Load env
const envPath = join(__dir, '..', '.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
);

// ERC-8004 Registry ABI (minimal — mint function)
const ERC8004_ABI = [
  'function mint(address to, string calldata agentURI) external returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function tokenURI(uint256 tokenId) external view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

const REGISTRY = '0x8004A818BFB912233c491871b3d84c89A494BD9e';
const BASE_URL = 'https://living-swarm-demo.vercel.app';

const AGENTS = [
  { name: 'Herald-01',   uri: `${BASE_URL}/agents/herald-01.json` },
  { name: 'Engineer-02', uri: `${BASE_URL}/agents/engineer-02.json` },
  { name: 'Sentinel-03', uri: `${BASE_URL}/agents/sentinel-03.json` },
];

async function main() {
  const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
  const signer = new ethers.Wallet(env.RARE_PRIVATE_KEY, provider);
  const registry = new ethers.Contract(REGISTRY, ERC8004_ABI, signer);

  console.log('═══ ERC-8004 Agent Registration ═══');
  console.log(`Operator: ${signer.address}`);
  console.log(`Registry: ${REGISTRY} (Sepolia)`);
  console.log('');

  for (const agent of AGENTS) {
    console.log(`Registering ${agent.name}...`);
    try {
      const tx = await registry.mint(signer.address, agent.uri);
      console.log(`  TX: ${tx.hash}`);
      const receipt = await tx.wait();
      // Parse Transfer event to get tokenId
      const iface = new ethers.Interface(ERC8004_ABI);
      let tokenId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === 'Transfer') {
            tokenId = parsed.args[2].toString();
          }
        } catch {}
      }
      console.log(`  Token ID: ${tokenId}`);
      console.log(`  Agent URI: ${agent.uri}`);
      console.log(`  ✅ ${agent.name} registered on-chain`);
      console.log('');
    } catch (e) {
      console.error(`  ❌ Failed: ${e.message}`);
    }
  }

  console.log('Done. Update erc8004_tx_hash and erc8004_token_id in /public/agents/*.json');
}

main().catch(console.error);
