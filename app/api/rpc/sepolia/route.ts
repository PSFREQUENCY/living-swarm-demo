// Server-side proxy for Sepolia RPC calls — keeps Alchemy API key off the client
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) {
    return NextResponse.json({ error: 'RPC not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
