import { NextRequest, NextResponse } from 'next/server';
const KEY = process.env.UNISWAP_API_KEY || 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch('https://trade-api.gateway.uniswap.org/v1/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': KEY, 'x-universal-router-version': '2.0', 'origin': 'https://app.uniswap.org' },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    const RN: Record<number,string> = {0:'CLASSIC',1:'DUTCH_LIMIT',2:'DUTCH_V2',4:'WRAP',5:'UNWRAP',6:'BRIDGE',7:'PRIORITY',8:'DUTCH_V3'};
    return NextResponse.json({ ...d, routingName: RN[d.routing] || 'UNKNOWN' }, { status: r.status });
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
