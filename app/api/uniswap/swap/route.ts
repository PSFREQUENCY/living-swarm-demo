import { NextRequest, NextResponse } from 'next/server';
const KEY = process.env.UNISWAP_API_KEY || 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: any = { quote: body.quote, simulateTransaction: true, refreshGasPrice: true, urgency: body.urgency || 'urgent' };
    if (body.signature && body.permitData) { payload.signature = body.signature; payload.permitData = body.permitData; }
    const r = await fetch('https://trade-api.gateway.uniswap.org/v1/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': KEY, 'origin': 'https://app.uniswap.org' },
      body: JSON.stringify(payload),
    });
    const d = await r.json();
    return NextResponse.json(d, { status: r.status });
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
