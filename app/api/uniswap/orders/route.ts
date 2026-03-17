import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const KEY = process.env.UNISWAP_API_KEY || '';
  const { searchParams } = new URL(req.url);
  const orderHash = searchParams.get('orderHash') || '';
  const chainId = searchParams.get('chainId') || '1';
  if (!orderHash) return NextResponse.json({ error: 'orderHash required' }, { status: 400 });
  try {
    const r = await fetch(
      `https://trade-api.gateway.uniswap.org/v1/orders?orderHashes=${orderHash}&chainId=${chainId}&limit=1`,
      { headers: { 'x-api-key': KEY, 'origin': 'https://app.uniswap.org' } }
    );
    const d = await r.json();
    if (!r.ok) return NextResponse.json({ error: d.errorCode || d.detail || 'ORDER_FETCH_FAILED', details: d }, { status: r.status });
    return NextResponse.json(d, { status: 200 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
