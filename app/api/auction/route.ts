// ═══════════════════════════════════════════════════════════════
// ROYAL LOGS — /api/auction
// Creates a Rare Protocol auction at 0.000369 ETH / 24h
// ═══════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

const AUCTION_PRICE    = '0.000369';
const AUCTION_DURATION = 86400; // 24 hours

export async function POST(req: NextRequest) {
  try {
    const { tokenId, contractAddress: reqContract } = await req.json();
    const contractAddress = reqContract || process.env.RARE_CONTRACT_ADDRESS;

    if (!contractAddress) {
      return NextResponse.json({ error: 'No contract address' }, { status: 400 });
    }
    if (tokenId === undefined || tokenId === null) {
      return NextResponse.json({ error: 'tokenId required' }, { status: 400 });
    }

    const auctionCmd = [
      'rare auction create',
      `--contract ${contractAddress}`,
      `--token-id ${tokenId}`,
      `--starting-price ${AUCTION_PRICE}`,
      `--duration ${AUCTION_DURATION}`,
      '--chain sepolia',
    ].join(' ');

    let txHash = '';
    let auctionId = '';
    let cliAvailable = false;

    try {
      const result = execSync(auctionCmd, { timeout: 60000, encoding: 'utf8' });
      cliAvailable = true;
      const txMatch = result.match(/0x[a-fA-F0-9]{64}/);
      txHash = txMatch ? txMatch[0] : '';
      const idMatch = result.match(/auction[_\s]?id[:\s]+([a-zA-Z0-9-]+)/i);
      auctionId = idMatch ? idMatch[1] : '';
    } catch (_cliErr: any) {
      // CLI not available in serverless env
    }

    return NextResponse.json({
      success: cliAvailable,
      simulation: !cliAvailable,
      tokenId,
      contractAddress,
      chain: 'sepolia',
      startingPrice: AUCTION_PRICE,
      currency: 'ETH',
      duration: AUCTION_DURATION,
      durationHuman: '24 hours',
      txHash: cliAvailable ? txHash : null,
      auctionId: cliAvailable ? auctionId : null,
      auctionCmd,
      rareUrl: `https://rare.xyz/token/${contractAddress}/${tokenId}`,
      sepoliaUrl: txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null,
      note: cliAvailable
        ? 'Auction created via Rare CLI'
        : 'Rare CLI not available in serverless env — auction parameters ready for local execution',
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenId = searchParams.get('tokenId');
  const contractAddress = searchParams.get('contract') || process.env.RARE_CONTRACT_ADDRESS;

  if (!tokenId || !contractAddress) {
    return NextResponse.json({ error: 'tokenId and contract required' }, { status: 400 });
  }

  let status = '';
  let cliAvailable = false;

  try {
    status = execSync(
      `rare auction status --contract ${contractAddress} --token-id ${tokenId} --chain sepolia`,
      { timeout: 30000, encoding: 'utf8' }
    );
    cliAvailable = true;
  } catch (_e: any) {
    // CLI not available
  }

  return NextResponse.json({
    tokenId,
    contractAddress,
    status: cliAvailable ? status : 'CLI not available in serverless env',
    rareUrl: `https://rare.xyz/token/${contractAddress}/${tokenId}`,
    simulation: !cliAvailable,
  });
}
