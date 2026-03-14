import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.UNISWAP_API_KEY || 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch('https://trade-api.gateway.uniswap.org/v1/check_approval',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':API_KEY,'origin':'https://app.uniswap.org'},body:JSON.stringify(body)});
    const data = await res.json();
    return NextResponse.json({...data,needsApproval:data.approval!=null});
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500});
  }
}
