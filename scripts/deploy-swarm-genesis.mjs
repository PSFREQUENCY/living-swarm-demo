// Deploy SwarmGenesis v2 — performance-optimized onchain art
// Fixes: no shadowBlur, 150 particles, 30fps cap, pause on hidden
// Usage: node scripts/deploy-swarm-genesis.mjs

import { ethers } from 'ethers';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .trim().split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"NonExistent","type":"error"},
  {"inputs":[],"name":"NotApproved","type":"error"},
  {"inputs":[],"name":"NotOwner","type":"error"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"operator","type":"address"},{"indexed":false,"name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
  {"inputs":[{"name":"to","type":"address"},{"name":"id","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"id","type":"uint256"}],"name":"getApproved","outputs":[{"type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"owner","type":"address"},{"name":"op","type":"address"}],"name":"isApprovedForAll","outputs":[{"type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"to","type":"address"},{"name":"uri","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"id","type":"uint256"}],"name":"ownerOf","outputs":[{"type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"id","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"id","type":"uint256"},{"name":"","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"op","type":"address"},{"name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"name":"id","type":"bytes4"}],"name":"supportsInterface","outputs":[{"type":"bool"}],"stateMutability":"pure","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"id","type":"uint256"}],"name":"tokenURI","outputs":[{"type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"id","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
];

const BYTECODE = readFileSync(new URL('../contracts_SwarmGenesis_sol_SwarmGenesis.bin', import.meta.url), 'utf8').trim();

// ─── Performance constants shared by all tokens ──────────────────────────────
// - No shadowBlur (most expensive canvas op — removed entirely)
// - 150 particles max
// - 30fps cap via timestamp delta
// - Pause loop on document.hidden
// - Additive blending (globalCompositeOperation=lighter) for glow — free
// - Bloom via double-draw: normal pass + low-alpha large-radius pass

// ─── TOKEN 1: GHOST PROTOCOL ─────────────────────────────────────────────────
const ART1 = `<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0;padding:0;overflow:hidden;background:#000}canvas{width:100vw;height:100vh;display:block}</style></head><body><canvas id=c></canvas><script>
var cv=document.getElementById('c'),X=cv.getContext('2d'),W,H,t=0,N=150,P=[],au,ai=0,mx=-999,my=-999,lt=0;
function rs(){cv.width=W=innerWidth;cv.height=H=innerHeight}rs();addEventListener('resize',rs);
for(var i=0;i<N;i++)P.push({a:Math.random()*6.28,r:.1+Math.random()*.9,z:Math.random(),p:Math.random()*6.28,q:Math.random()*6.28,g:i%4,life:1,d:i%7===0});
function gx(u){var v=u*6.28;return Math.sin(v)*.48+Math.sin(v*2)*.1}
function gy(u){var v=u*6.28;return-Math.abs(Math.cos(v))*.55+Math.sin(v*2.5)*.12-.18}
function snd(){if(ai)return;ai=1;au=new(AudioContext||webkitAudioContext)();var d=au.destination;
var o=au.createOscillator(),g=au.createGain();o.frequency.value=55;o.type='sine';g.gain.value=.08;o.connect(g);g.connect(d);o.start();
var o2=au.createOscillator(),lf=au.createOscillator(),lg=au.createGain(),g2=au.createGain();
o2.frequency.value=110;lf.frequency.value=.2;lf.type='sine';lg.gain.value=10;g2.gain.value=.025;
lf.connect(lg);lg.connect(o2.frequency);o2.connect(g2);g2.connect(d);o2.start();lf.start();
function gl(){var sr=au.sampleRate,b=au.createBuffer(1,~~(sr*.05),sr),dd=b.getChannelData(0);
for(var j=0;j<dd.length;j++)dd[j]=(Math.random()*2-1)*Math.pow(1-j/dd.length,3);
var s=au.createBufferSource(),gg=au.createGain(),ff=au.createBiquadFilter();
ff.type='bandpass';ff.frequency.value=1e3+Math.random()*2e3;ff.Q.value=3;gg.gain.value=.07;
s.buffer=b;s.connect(ff);ff.connect(gg);gg.connect(d);s.start();setTimeout(gl,500+Math.random()*1500);}gl();}
addEventListener('click',snd);addEventListener('touchstart',snd);
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
function draw(now){requestAnimationFrame(draw);
if(document.hidden)return;if(now-lt<33)return;lt=now;t+=.016;
X.globalCompositeOperation='source-over';X.fillStyle='rgba(0,0,6,.15)';X.fillRect(0,0,W,H);
X.globalCompositeOperation='lighter';
var cx=W/2,cy=H*.48,R=Math.min(W,H)*.33;
for(var i=0;i<N;i++){
var p=P[i],u=(i/N+t*.025)%1;
var tx=cx+gx(u)*R*1.15,ty=cy+gy(u)*R*1.15;
var sx=cx+Math.cos(p.a)*p.r*R,sy=cy+Math.sin(p.a)*p.r*R*.75;
var dx=tx-sx,dy=ty-sy,ds=Math.sqrt(dx*dx+dy*dy);
p.a+=(dy>0?.002:-.002);p.r+=(ds/R-p.r)*.01;p.r=Math.max(.05,Math.min(1.2,p.r));
var mdx=sx-mx,mdy=sy-my,md=mdx*mdx+mdy*mdy;
if(md<12000){var mf=100/md;p.a+=mdy*mf*.001;p.r+=mdx*mf*.001;if(p.d)p.life-=.05;}
if(p.d&&p.life<.05){p.a=Math.random()*6.28;p.r=.1+Math.random()*.9;p.life=1;}
var al=(.3+.45*p.z+Math.sin(t*2+p.p)*.12)*(p.d?p.life:1);
var rd=.8+p.z*1.8;
var col=p.g===0?[160,60,255]:p.g===1?[0,190,255]:p.g===2?[240,50,190]:[80,255,180];
var cs='rgba('+col[0]+','+col[1]+','+col[2]+','+al+')';
X.fillStyle=cs;X.beginPath();X.arc(sx,sy,rd,0,6.28);X.fill();
// bloom: single large soft circle per particle (cheap glow)
X.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(al*.18)+')';
X.beginPath();X.arc(sx,sy,rd*4,0,6.28);X.fill();}
X.globalCompositeOperation='source-over';
var fs=Math.min(W,H)*.046;X.textAlign='center';X.font='bold '+fs+'px monospace';
if(Math.sin(t*9)>.93){X.fillStyle='rgba(240,50,190,.45)';X.fillText('GHOST PROTOCOL',cx+(Math.random()*5-2.5),cy+R*1.62);}
X.fillStyle='rgba(185,120,255,'+(0.55+Math.sin(t*.7)*.2)+')';X.fillText('GHOST PROTOCOL',cx,cy+R*1.62);
X.fillStyle='rgba(0,190,255,.25)';X.font=(fs*.4)+'px monospace';X.fillText('LIVING SWARM GENESIS // TOKEN 1/3 // PRIVACY LAYER',cx,cy+R*1.88);
X.fillStyle='rgba(160,60,255,.16)';X.font=(fs*.3)+'px monospace';X.fillText('AES-256-GCM // HKDF // PII-STRIPPED // HMAC-SHA256',cx,cy+R*2.08);}
requestAnimationFrame(draw);
<\/script></body></html>`;

// ─── TOKEN 2: ARBITER ZERO ────────────────────────────────────────────────────
const ART2 = `<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0;padding:0;overflow:hidden;background:#000}canvas{width:100vw;height:100vh;display:block}</style></head><body><canvas id=c></canvas><script>
var cv=document.getElementById('c'),X=cv.getContext('2d'),W,H,t=0,N=150,P=[],au,ai=0,score=0,tgt=42,sa=0,lt=0;
function rs(){cv.width=W=innerWidth;cv.height=H=innerHeight}rs();addEventListener('resize',rs);
for(var i=0;i<N;i++){var b=Math.floor(i/38);P.push({band:b,a:Math.random()*6.28,r:.18+b*.16+Math.random()*.12,z:Math.random(),p:Math.random()*6.28,q:Math.random()*6.28});}
function bc(b,al){return b===0?'rgba(0,240,90,'+al+')':b===1?'rgba(255,200,0,'+al+')':b===2?'rgba(255,110,0,'+al+')':'rgba(255,20,40,'+al+')';}
function snd(){if(ai)return;ai=1;au=new(AudioContext||webkitAudioContext)();var d=au.destination;
var h=au.createOscillator(),hg=au.createGain();h.frequency.value=60;h.type='sawtooth';hg.gain.value=.03;h.connect(hg);hg.connect(d);h.start();
function ping(){var o=au.createOscillator(),g=au.createGain();o.frequency.value=600+tgt*3;o.type='sine';g.gain.value=0;o.connect(g);g.connect(d);o.start();
var n=au.currentTime;g.gain.linearRampToValueAtTime(.1,n+.01);g.gain.exponentialRampToValueAtTime(.001,n+.35);setTimeout(function(){try{o.stop()}catch(e){}},500);setTimeout(ping,1000+Math.random()*700);}ping();}
addEventListener('click',snd);addEventListener('touchstart',snd);
addEventListener('mousemove',function(e){tgt=Math.round(e.clientX/W*100)});
addEventListener('touchmove',function(e){tgt=Math.round(e.touches[0].clientX/W*100)});
function draw(now){requestAnimationFrame(draw);
if(document.hidden)return;if(now-lt<33)return;lt=now;t+=.016;
score+=(tgt-score)*.04;sa+=.028;
X.globalCompositeOperation='source-over';X.fillStyle='rgba(0,5,0,.15)';X.fillRect(0,0,W,H);
var cx=W/2,cy=H*.46,R=Math.min(W,H)*.36;
// radar rings
X.globalCompositeOperation='source-over';
[.28,.55,.78,1].forEach(function(rf){X.strokeStyle='rgba(0,180,60,.07)';X.lineWidth=.8;X.beginPath();X.arc(cx,cy,R*rf,0,6.28);X.stroke();});
// scan sweep (no shadowBlur — just a bright line + gradient fill)
X.save();X.translate(cx,cy);X.rotate(sa);
var sg=X.createLinearGradient(0,0,R,0);sg.addColorStop(0,'rgba(0,255,70,.22)');sg.addColorStop(1,'rgba(0,255,70,0)');
X.beginPath();X.moveTo(0,0);X.arc(0,0,R,-.55,.55);X.closePath();X.fillStyle=sg;X.fill();
X.strokeStyle='rgba(0,255,70,.8)';X.lineWidth=1.5;X.beginPath();X.moveTo(0,0);X.lineTo(R,0);X.stroke();
X.restore();
// particles
X.globalCompositeOperation='lighter';
var sc2=Math.round(score),oc=sc2>75?'255,20,40':sc2>50?'255,110,0':sc2>25?'255,200,0':'0,240,90';
for(var i=0;i<N;i++){
var p=P[i];p.a+=.002*(1+p.band*.25)*(Math.sin(t*.4+p.p)*.15+1);
var sr=p.r*R+Math.sin(t*1.2+p.q)*R*.025;
var sx=cx+Math.cos(p.a)*sr,sy=cy+Math.sin(p.a)*sr*.72;
var al=(p.band===3&&sc2>75)?(.2+Math.sin(t*7)*.2):(.12+p.z*.3);
var rd=.6+p.z*1.6;
var col=bc(p.band,al);
X.fillStyle=col;X.beginPath();X.arc(sx,sy,rd,0,6.28);X.fill();
X.fillStyle=bc(p.band,al*.15);X.beginPath();X.arc(sx,sy,rd*3.5,0,6.28);X.fill();}
// orb
var orbR=R*.1*(1+Math.sin(t*3)*.07);
var og=X.createRadialGradient(cx,cy,0,cx,cy,orbR);
og.addColorStop(0,'rgba('+oc+',.85)');og.addColorStop(.6,'rgba('+oc+',.25)');og.addColorStop(1,'rgba('+oc+',0)');
X.fillStyle=og;X.beginPath();X.arc(cx,cy,orbR,0,6.28);X.fill();
// score text
X.globalCompositeOperation='source-over';
var fs=Math.min(W,H)*.052;X.textAlign='center';X.font='bold '+fs+'px monospace';
X.fillStyle='rgba('+oc+',.95)';X.fillText(sc2,cx,cy+fs*.38);
X.font=(fs*.3)+'px monospace';X.fillStyle='rgba('+oc+',.6)';
X.fillText(sc2>75?'BLOCK':sc2>50?'HOLD':sc2>25?'LOG':'PASS',cx,cy+fs*.82);
var tf=Math.min(W,H)*.04;X.font='bold '+tf+'px monospace';
X.fillStyle='rgba(255,170,40,'+(0.6+Math.sin(t*.6)*.2)+')';X.fillText('ARBITER ZERO',cx,cy+R*1.22);
X.fillStyle='rgba(0,240,90,.22)';X.font=(tf*.4)+'px monospace';X.fillText('LIVING SWARM GENESIS // TOKEN 2/3 // THREAT ORACLE',cx,cy+R*1.46);
X.fillStyle='rgba(255,110,0,.15)';X.font=(tf*.3)+'px monospace';X.fillText('ZERO-TRUST // ONCHAIN ATTESTATION // ARBITER-GATED DEFI',cx,cy+R*1.65);}
requestAnimationFrame(draw);
<\/script></body></html>`;

// ─── TOKEN 3: THE CRYSTALLIZED ────────────────────────────────────────────────
const ART3 = `<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0;padding:0;overflow:hidden;background:#000}canvas{width:100vw;height:100vh;display:block}</style></head><body><canvas id=c></canvas><script>
var cv=document.getElementById('c'),X=cv.getContext('2d'),W,H,t=0,N=160,P=[],au,ai=0,cp=0,lt=0;
function rs(){cv.width=W=innerWidth;cv.height=H=innerHeight}rs();addEventListener('resize',rs);
var LAT=[];for(var row=-3;row<=3;row++)for(var col=-3;col<=3;col++)if(Math.abs(row)+Math.abs(col)+Math.abs(-row-col)<=4)LAT.push({x:col+row*.5,y:row*.866});
for(var i=0;i<N;i++){var L=LAT[i%LAT.length];P.push({lx:L.x,ly:L.y,x:Math.random()*2-1,y:Math.random()*2-1,vx:(Math.random()-.5)*.02,vy:(Math.random()-.5)*.02,z:Math.random(),p:Math.random()*6.28,q:Math.random()*6.28,g:i%3,beam:i%8===0});}
function snd(){if(ai)return;ai=1;au=new(AudioContext||webkitAudioContext)();var d=au.destination;
[220,440,660].forEach(function(f,idx){var o=au.createOscillator(),g=au.createGain();o.frequency.value=f;o.type='sine';g.gain.value=.025/(idx+1);o.connect(g);g.connect(d);o.start();});
function bell(){var o=au.createOscillator(),g=au.createGain();o.frequency.value=330*Math.pow(2,Math.floor(Math.random()*8)/12);o.type='sine';g.gain.value=0;o.connect(g);g.connect(d);o.start();
var n=au.currentTime;g.gain.linearRampToValueAtTime(.12,n+.02);g.gain.exponentialRampToValueAtTime(.001,n+2);setTimeout(function(){try{o.stop()}catch(e){}},2500);setTimeout(bell,1200+Math.random()*2000);}bell();}
addEventListener('click',snd);addEventListener('touchstart',snd);
function draw(now){requestAnimationFrame(draw);
if(document.hidden)return;if(now-lt<33)return;lt=now;t+=.016;cp=Math.min(1,cp+.003);
X.globalCompositeOperation='source-over';X.fillStyle='rgba(1,0,3,.13)';X.fillRect(0,0,W,H);
var cx=W/2,cy=H*.46,R=Math.min(W,H)*.27,rot=t*.035;
// light beams (cheap: lines with gradient, no blur)
X.globalCompositeOperation='lighter';
for(var i=0;i<8;i++){var ba=i*6.28/8+rot;var bx=cx+Math.cos(ba)*R*1.3,by=cy+Math.sin(ba)*R*1.15;
var h2=(i*45+t*18)%360;
var bg=X.createLinearGradient(cx,cy,bx,by);bg.addColorStop(0,'hsla('+h2+',100%,65%,.12)');bg.addColorStop(1,'hsla('+h2+',100%,65%,0)');
X.strokeStyle=bg;X.lineWidth=1.5+Math.sin(t*1.5+i)*.8;X.beginPath();X.moveTo(cx,cy);X.lineTo(bx,by);X.stroke();}
// particles
for(var i=0;i<N;i++){
var p=P[i];var sc=R*.21;
p.x+=(p.lx*sc/R-p.x)*cp*.012;p.y+=(p.ly*sc/R*0.92-p.y)*cp*.012;
p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy*=.985;
// rotate
var ca=Math.cos(rot),sa=Math.sin(rot),rx=p.x*R,ry=p.y*R;
var sx=cx+(rx*ca-ry*sa),sy=cy+(rx*sa+ry*ca);
var al=(.2+.4*p.z+Math.sin(t*2.2+p.p)*.12)*(.25+cp*.75);
var rd=p.beam?1.6+p.z*1.4:.6+p.z*1.5;
var col=p.g===0?[250,205,55]:p.g===1?[0,230,205]:[240,240,180];
var cs='rgba('+col[0]+','+col[1]+','+col[2]+','+al+')';
X.fillStyle=cs;X.beginPath();X.arc(sx,sy,rd,0,6.28);X.fill();
// bloom pass
X.fillStyle='rgba('+col[0]+','+col[1]+','+col[2]+','+(al*.15)+')';
X.beginPath();X.arc(sx,sy,rd*(p.beam?5:3.5),0,6.28);X.fill();}
// core glow
var cg=X.createRadialGradient(cx,cy,0,cx,cy,R*.16);
cg.addColorStop(0,'rgba(255,240,160,.6)');cg.addColorStop(.5,'rgba(255,205,55,.15)');cg.addColorStop(1,'rgba(0,230,205,0)');
X.fillStyle=cg;X.beginPath();X.arc(cx,cy,R*.16*(1+Math.sin(t*1.8)*.06),0,6.28);X.fill();
// text
X.globalCompositeOperation='source-over';
var fs=Math.min(W,H)*.042;X.textAlign='center';X.font='bold '+fs+'px monospace';
X.fillStyle='rgba(255,220,90,'+(0.6+Math.sin(t*.65)*.2)+')';X.fillText('THE CRYSTALLIZED',cx,cy+R*1.5);
X.fillStyle='rgba(0,230,205,.25)';X.font=(fs*.4)+'px monospace';X.fillText('LIVING SWARM GENESIS // TOKEN 3/3 // ETERNAL MEMORY',cx,cy+R*1.75);
X.fillStyle='rgba(255,205,55,.15)';X.font=(fs*.3)+'px monospace';X.fillText('GEMINI // ROYAL LOGS // ONCHAIN FOREVER // SEPOLIA',cx,cy+R*1.95);}
requestAnimationFrame(draw);
<\/script></body></html>`;

// ─── Deploy + Mint ────────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(env.SWAPPER_KEY, provider);

console.log('Deploying SwarmGenesis v2 (performance-optimized) to Sepolia...');
console.log('Deployer:', wallet.address);

const factory = new ethers.ContractFactory(ABI, '0x' + BYTECODE, wallet);
const contract = await factory.deploy({ gasLimit: 3_000_000 });
console.log('Deploy tx:', contract.deploymentTransaction()?.hash);
await contract.waitForDeployment();
const addr = await contract.getAddress();
console.log('\n✓ SwarmGenesis deployed at:', addr);

function toDataURI(html) {
  return 'data:text/html;base64,' + Buffer.from(html).toString('base64');
}

const artworks = [
  { name: 'GHOST PROTOCOL',   html: ART1 },
  { name: 'ARBITER ZERO',     html: ART2 },
  { name: 'THE CRYSTALLIZED', html: ART3 },
];

console.log('\nMinting 3 tokens...');
for (let i = 0; i < artworks.length; i++) {
  const art = artworks[i];
  const uri = toDataURI(art.html);
  console.log(`\nMinting token ${i + 1}: ${art.name} (${art.html.length} bytes)`);
  const tx = await contract.mint(wallet.address, uri, { gasLimit: 8_000_000 });
  console.log('  Tx:', tx.hash);
  await tx.wait();
  console.log('  ✓ Token', i + 1, 'minted');
}

console.log('\n✓ All 3 tokens minted');
console.log('\nAdd to .env.local:');
console.log(`SWARM_GENESIS_ADDRESS=${addr}`);
console.log('\nhttps://sepolia.etherscan.io/address/' + addr);
