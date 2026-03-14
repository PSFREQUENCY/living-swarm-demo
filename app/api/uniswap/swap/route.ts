import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.UNISWAP_API_KEY || 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: any = {quote:body.quote,simulateTransaction:true,refreshGasPrice:true,urgency:body.urgency||'urgent'};
    if(body.signature&&body.permitData){payload.signature=body.signature;payload.permitData=body.permitData;}
    const res = await fetch('https://trade-api.gateway.uniswap.org/v1/swap',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':API_KEY,'origin':'https://app.uniswap.org'},body:JSON.stringify(payload)});
    const data = await res.json();
    if(!res.ok) return NextResponse.json({error:'SWAP_FAILED',details:data},{status:res.status});
    return NextResponse.json(data);
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500});
  }
}
