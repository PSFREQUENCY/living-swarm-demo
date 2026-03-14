const UNI='https://trade-api.gateway.uniswap.org/v1/check_approval';
const KEY=process.env.UNISWAP_API_KEY||'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw';
export async function POST(req){try{const b=await req.json();const r=await fetch(UNI,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':KEY,'origin':'https://app.uniswap.org'},body:JSON.stringify(b)});const d=await r.json();return Response.json({...d,needsApproval:d.approval!=null});}catch(e){return Response.json({error:e.message},{status:500});}}
