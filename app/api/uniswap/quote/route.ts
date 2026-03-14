import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.UNISWAP_API_KEY || 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';
const UNI = 'https://trade-api.gateway.uniswap.org/v1/quote';
const RN: Record<number,string> = {0:'CLASSIC',1:'DUTCH_LIMIT',2:'DUTCH_V2',3:'LIMIT_ORDER',4:'WRAP',5:'UNWRAP',6:'BRIDGE',7:'PRIORITY',8:'DUTCH_V3'};

function arbiterScore(b: any): number {
  let s = 0;
  try { const a = BigInt(b.amount||'0'),E=BigInt('1000000000000000000'); if(a>E*BigInt(10))s+=40; else if(a>E)s+=20; else s+=5; } catch(e){s+=5;}
  if(b.tokenInChainId!==b.tokenOutChainId)s+=25;
  const K=['0x0000000000000000000000000000000000000000','0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48','0xdac17f958d2ee523a2206206994597c13d831ec7','0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2','0x6b175474e89094c44da98b954eedeac495271d0f'];
  if(!K.includes((b.tokenIn||'').toLowerCase()))s+=15;
  if(!K.includes((b.tokenOut||'').toLowerCase()))s+=15;
  return Math.min(s,100);
}
function arbiterBand(s: number){
  if(s<=25)return{band:'PASS',action:'execute'};
  if(s<=50)return{band:'LOG',action:'log'};
  if(s<=75)return{band:'HOLD',action:'hold'};
  return{band:'BLOCK',action:'block'};
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const score = arbiterScore(body);
    const verdict = arbiterBand(score);
    if(verdict.action==='block') return NextResponse.json({error:'ARBITER_BLOCKED',score,verdict},{status:403});
    const res = await fetch(UNI,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':API_KEY,'x-universal-router-version':'2.0','origin':'https://app.uniswap.org'},body:JSON.stringify(body)});
    const data = await res.json();
    if(!res.ok) return NextResponse.json({error:'API_ERROR',status:res.status,details:data,arbiter:{score,verdict}},{status:res.status});
    return NextResponse.json({...data,routingName:RN[data.routing]||'UNKNOWN',arbiter:{score,verdict}});
  } catch(e:any) {
    return NextResponse.json({error:e.message},{status:500});
  }
}
