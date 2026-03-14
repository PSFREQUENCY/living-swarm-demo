const API_KEY = process.env.UNISWAP_API_KEY || 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';

export async function POST(req) {
  try {
    const body = await req.json();
    const payload = { quote: body.quote, simulateTransaction: true, refreshGasPrice: true, urgency: body.urgency || 'urgent' };
    if (body.signature && body.permitData) { payload.signature = body.signature; payload.permitData = body.permitData; }
    const res = await fetch('https://trade-api.gateway.uniswap.org/v1/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'origin': 'https://app.uniswap.org' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: 'SWAP_FAILED', details: data }, { status: res.status });
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
