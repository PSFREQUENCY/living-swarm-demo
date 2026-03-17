import { NextResponse } from 'next/server';

const AGENTS = [
  { id: 'herald-01',   role: 'SCOUT',      erc8004_token: 1849, status: 'ACTIVE',    erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e', erc8004_tx: '0x846adaa65b69862e9e1bc3dfb61fc0173891be6e83d46f9676512df11e9b58a2' },
  { id: 'engineer-02', role: 'STRATEGIST', erc8004_token: 1850, status: 'ACTIVE',    erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e', erc8004_tx: '0x25009c2e8c8f1afd0e6f37889318d8cdbd5e4c7596b2864162977c2101ba4f2a' },
  { id: 'sentinel-03', role: 'GUARDIAN',   erc8004_token: 1851, status: 'ALWAYS_ON', erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e', erc8004_tx: '0x2c448847a46b806c8ea400dcb436f3f1b8a840464e9bd8bb6a443f43973b7168' },
];

export async function GET() {
  return NextResponse.json({
    swarm: 'LIVING_SWARM',
    version: '6.0',
    chain: 'sepolia',
    erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    erc8183_schema: 'https://eips.ethereum.org/EIPS/eip-8183#capability-manifest-v1',
    arbiter_contract: '0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94',
    agents: AGENTS,
    capabilities_manifest: [
      'https://living-swarm-demo.vercel.app/agents/herald-01.json',
      'https://living-swarm-demo.vercel.app/agents/engineer-02.json',
      'https://living-swarm-demo.vercel.app/agents/sentinel-03.json',
    ],
    status: 'ONLINE',
    uptime: Date.now(),
  });
}
