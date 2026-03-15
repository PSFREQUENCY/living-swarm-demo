// Gap 5 — Data room auth: issue nonce & verify signed challenge

import { NextRequest, NextResponse } from 'next/server';
import { issueNonce, verifyNonce, issueAccessToken } from '@/lib/data-room-auth';

/** GET /api/data-room/auth?address=0x... — issue a nonce */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }
  const nonce = issueNonce(address);
  return NextResponse.json({ nonce });
}

/** POST /api/data-room/auth — verify signature, return access token */
export async function POST(req: NextRequest) {
  const { address, nonce, signature } = await req.json();
  if (!address || !nonce || !signature) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!verifyNonce(nonce, signature, address)) {
    return NextResponse.json({ error: 'Invalid or expired signature' }, { status: 401 });
  }
  const token = issueAccessToken(address);
  return NextResponse.json({ token, address: address.toLowerCase() });
}
