import { NextResponse } from 'next/server';

const AGENTS = [
  { id: 'herald-01',   role: 'PLANNER',      erc8004_token: 1, status: 'ACTIVE', erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e' },
  { id: 'engineer-02', role: 'DEVELOPER',    erc8004_token: 2, status: 'ACTIVE', erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e' },
  { id: 'sentinel-03', role: 'QA_VALIDATOR', erc8004_token: 3, status: 'ALWAYS_ON', erc8004_registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e' },
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
