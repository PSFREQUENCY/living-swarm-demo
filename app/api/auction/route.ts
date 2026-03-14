// ═══════════════════════════════════════════════════════════════
// ROYAL LOGS — /api/auction
// Creates a Rare Protocol auction at 0.000369 ETH
// ═══════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

const AUCTION_PRICE = '0.000369';
const AUCTION_DURATION = 86400; // 24 hours in seconds

export async function POST(req: NextRequest) {
  try {
    const { tokenId, contractAddress: reqContract } = await req.json();
    const contractAddress = reqContract || process.env.RARE_CONTRACT_ADDRESS;

    if (!contractAddress) {
      return NextResponse.json({ error: 'No contract address' }, { status: 400 });
    }
    if (!tokenId && tokenId !== 0) {
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

    try {
      const result = execSync(auctionCmd, { timeout: 60000, encoding: 'utf8' });
      const txMatch = result.match(/0x[a-fA-F0-9]{64}/);
      txHash = txMatch ? txMatch[0] : '';
      const idMatch = result.match(/auction[_\s]?id[:\s]+([a-zA-Z0-9-]+)/i);
      auctionId = idMatch ? idMatch[1] : '';
    } catch (cliErr: any) {
      return NextResponse.json({
        error: 'Rare CLI auction failed',
        details: cliErr.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tokenId,
      contractAddress,
      startingPrice: AUCTION_PRICE,
      duration: AUCTION_DURATION,
      txHash,
      auctionId,
      sepoliaUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
      rareUrl: `https://rare.xyz/token/${contractAddress}/${tokenId}`,
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

  try {
    const result = execSync(
      `rare auction status --contract ${contractAddress} --token-id ${tokenId} --chain sepolia`,
      { timeout: 30000, encoding: 'utf8' }
    );
    return NextResponse.json({ status: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
