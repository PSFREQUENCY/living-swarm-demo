// Deploy SwarmGenesis.sol + mint 3 fully-onchain art tokens
// Each tokenURI = data:text/html;base64,[self-contained canvas+audio artwork]
// Usage: node scripts/deploy-swarm-genesis.mjs

import { ethers } from 'ethers';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .trim().split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

// ─── Compiled SwarmGenesis.sol (npx solc 0.8.34) ────────────────────────────
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

// ─── ART: TOKEN 1 — GHOST PROTOCOL ──────────────────────────────────────────
// Privacy layer: 600 particles form ghost entity, PII dissolves on touch
const ART1 = `<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0;padding:0;overflow:hidden;background:#000}canvas{display:block;width:100vw;height:100vh}</style></head><body><canvas id=c></canvas><script>
var c=document.getElementById('c'),x=c.getContext('2d'),W,H,t=0,N=600,P=[],au,init=0,mx=-999,my=-999;
function sz(){c.width=W=innerWidth;c.height=H=innerHeight}sz();addEventListener('resize',sz);
for(var i=0;i<N;i++)P.push({a:Math.random()*6.28,r:.1+Math.random()*.9,s:.001+Math.random()*.003,z:Math.random(),p:Math.random()*6.28,q:Math.random()*6.28,g:i%4,life:1,dissolve:i%9===0});
function gx(u){var v=u*6.28;return Math.sin(v)*.48+Math.sin(v*2)*.1}
function gy(u){var v=u*6.28;return-Math.abs(Math.cos(v))*.55+Math.sin(v*2.5)*.12-.18}
function snd(){if(init)return;init=1;au=new(AudioContext||webkitAudioContext)();var d=au.destination;
[30,60].forEach(function(f,i){var o=au.createOscillator(),g=au.createGain();o.frequency.value=f;o.type='sine';g.gain.value=i?.05:.1;o.connect(g);g.connect(d);o.start();});
var o2=au.createOscillator(),lfo=au.createOscillator(),lg=au.createGain(),g2=au.createGain();
o2.frequency.value=110;o2.type='sine';lfo.frequency.value=.25;lfo.type='sine';lg.gain.value=12;g2.gain.value=.035;
lfo.connect(lg);lg.connect(o2.frequency);o2.connect(g2);g2.connect(d);o2.start();lfo.start();
function glitch(){var sr=au.sampleRate,dur=.06+Math.random()*.06,buf=au.createBuffer(1,sr*dur,sr),dd=buf.getChannelData(0);
for(var i=0;i<dd.length;i++)dd[i]=(Math.random()*2-1)*Math.pow(1-i/(sr*dur),3);
var s=au.createBufferSource(),gg=au.createGain(),ff=au.createBiquadFilter();
ff.type='bandpass';ff.frequency.value=800+Math.random()*3000;ff.Q.value=3;gg.gain.value=.08;
s.buffer=buf;s.connect(ff);ff.connect(gg);gg.connect(d);s.start();setTimeout(glitch,300+Math.random()*1600);}
glitch();
[880,1320,1760,2640].forEach(function(f,idx){var o=au.createOscillator(),g=au.createGain();o.frequency.value=f;g.gain.value=0;o.connect(g);g.connect(d);o.start();
setInterval(function(){var n=au.currentTime;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(.012/(idx+1),n+2);g.gain.linearRampToValueAtTime(0,n+5);o.frequency.linearRampToValueAtTime(f*(.96+Math.random()*.08),n+3);},3500+idx*1200);});}
addEventListener('click',snd);addEventListener('touchstart',snd);
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
addEventListener('touchmove',function(e){mx=e.touches[0].clientX;my=e.touches[0].clientY;});
function draw(){requestAnimationFrame(draw);t+=.016;
x.globalCompositeOperation='source-over';x.fillStyle='rgba(0,0,6,.13)';x.fillRect(0,0,W,H);
x.globalCompositeOperation='lighter';
var cx=W/2,cy=H*.48,R=Math.min(W,H)*.33;
for(var i=0;i<N;i++){
var p=P[i],u=(i/N+t*.025)%1;
var tx=cx+gx(u)*R*1.15,ty=cy+gy(u)*R*1.15;
var sx=cx+Math.cos(p.a)*p.r*R,sy=cy+Math.sin(p.a)*p.r*R*.75+Math.sin(t*.4+p.p)*R*.04;
var dx=tx-sx,dy=ty-sy,ds=Math.sqrt(dx*dx+dy*dy);
p.a+=(dy>0?.0015:-.0015)*p.s*80;p.r+=(ds/R-p.r)*.009;p.r=Math.max(.05,Math.min(1.25,p.r));
var mdx=sx-mx,mdy=sy-my,md=mdx*mdx+mdy*mdy;
if(md<14400){var mf=120/md;p.a+=mdy*mf*.0012;p.r+=mdx*mf*.0012;if(p.dissolve){p.life-=.04;}}
if(p.dissolve&&p.life<.05){p.a=Math.random()*6.28;p.r=.1+Math.random()*.9;p.life=1;}
var al=(.25+.4*p.z+Math.sin(t*2.2+p.p)*.15)*(p.dissolve?p.life:1);
var rd=.8+p.z*2.2+Math.sin(t*3+p.q)*.6;
var col=p.g===0?'rgba(170,70,255,'+al+')':p.g===1?'rgba(0,200,255,'+al+')':p.g===2?'rgba(255,60,200,'+al+')':'rgba(120,255,200,'+al+')';
x.shadowBlur=rd*6;x.shadowColor=col;x.fillStyle=col;x.beginPath();x.arc(sx,sy,rd,0,6.28);x.fill();}
x.globalCompositeOperation='source-over';x.shadowBlur=0;
var fs=Math.min(W,H)*.046;x.textAlign='center';
if(Math.sin(t*9)>.92){x.fillStyle='rgba(255,60,200,.5)';x.font='bold '+fs+'px monospace';x.fillText('GHOST PROTOCOL',cx+(Math.random()*6-3),cy+R*1.62+(Math.random()*4-2));}
x.shadowBlur=25;x.shadowColor='rgba(150,50,255,.9)';x.fillStyle='rgba(200,140,255,'+(0.55+Math.sin(t*.7)*.2)+')';x.font='bold '+fs+'px monospace';x.fillText('GHOST PROTOCOL',cx,cy+R*1.62);
x.shadowBlur=12;x.shadowColor='rgba(0,200,255,.6)';x.fillStyle='rgba(0,200,255,.28)';x.font=(fs*.42)+'px monospace';x.fillText('LIVING SWARM GENESIS // TOKEN 1/3 // PRIVACY LAYER',cx,cy+R*1.88);
x.fillStyle='rgba(180,80,255,.18)';x.font=(fs*.32)+'px monospace';x.fillText('AES-256-GCM // HKDF // PII-STRIPPED // HMAC-SHA256 // SEPOLIA',cx,cy+R*2.1);x.shadowBlur=0;}
draw();
<\/script></body></html>`;

// ─── ART: TOKEN 2 — ARBITER ZERO ────────────────────────────────────────────
// Risk scoring engine: radar sweep, particles in threat bands, score pulses
const ART2 = `<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0;padding:0;overflow:hidden;background:#000}canvas{display:block;width:100vw;height:100vh}</style></head><body><canvas id=c></canvas><script>
var c=document.getElementById('c'),x=c.getContext('2d'),W,H,t=0,N=500,P=[],au,init=0,score=0,targetScore=42,scanAngle=0;
function sz(){c.width=W=innerWidth;c.height=H=innerHeight}sz();addEventListener('resize',sz);
for(var i=0;i<N;i++){var band=Math.floor(i/125);P.push({band:band,a:Math.random()*6.28,r:.15+band*.18+Math.random()*.15,s:.002+Math.random()*.004,z:Math.random(),p:Math.random()*6.28,q:Math.random()*6.28,age:Math.random()});}
function bandColor(b,al){return b===0?'rgba(0,255,100,'+al+')':b===1?'rgba(255,210,0,'+al+')':b===2?'rgba(255,120,0,'+al+')':'rgba(255,20,40,'+al+')';}
function snd(){if(init)return;init=1;au=new(AudioContext||webkitAudioContext)();var d=au.destination;
var hum=au.createOscillator(),hg=au.createGain();hum.frequency.value=60;hum.type='sawtooth';hg.gain.value=.04;hum.connect(hg);hg.connect(d);hum.start();
var tension=au.createOscillator(),tg=au.createGain(),tLfo=au.createOscillator(),tlg=au.createGain();
tension.frequency.value=220;tension.type='triangle';tLfo.frequency.value=.8;tLfo.type='sine';tlg.gain.value=30;tg.gain.value=.025;
tLfo.connect(tlg);tlg.connect(tension.frequency);tension.connect(tg);tg.connect(d);tension.start();tLfo.start();
function ping(){var o=au.createOscillator(),g=au.createGain();o.frequency.value=660+targetScore*4;o.type='sine';g.gain.value=0;o.connect(g);g.connect(d);o.start();
var n=au.currentTime;g.gain.linearRampToValueAtTime(.12,n+.01);g.gain.exponentialRampToValueAtTime(.001,n+.4);setTimeout(function(){o.stop();},500);setTimeout(ping,1200+Math.random()*800);}
ping();
function alert2(){if(targetScore>60){var o=au.createOscillator(),g=au.createGain();o.frequency.value=880;o.type='square';g.gain.value=0;o.connect(g);g.connect(d);o.start();
var n=au.currentTime;[0,.12,.24].forEach(function(dt){g.gain.setValueAtTime(.06,n+dt);g.gain.setValueAtTime(0,n+dt+.06);});setTimeout(function(){o.stop();},500);}
setTimeout(alert2,3000+Math.random()*2000);}
alert2();}
addEventListener('click',snd);addEventListener('touchstart',snd);
addEventListener('mousemove',function(e){targetScore=Math.round((e.clientX/W)*100);});
addEventListener('touchmove',function(e){targetScore=Math.round((e.touches[0].clientX/W)*100);});
function draw(){requestAnimationFrame(draw);t+=.016;
score+=(targetScore-score)*.03;scanAngle+=.025;
x.globalCompositeOperation='source-over';x.fillStyle='rgba(0,4,0,.14)';x.fillRect(0,0,W,H);
x.globalCompositeOperation='lighter';
var cx=W/2,cy=H*.46,R=Math.min(W,H)*.38;
// Radar rings
[.25,.5,.75,1].forEach(function(rf,ri){
var rr=R*rf;var al=.04+ri*.02;x.strokeStyle='rgba(0,200,80,'+al+')';x.lineWidth=.5;x.beginPath();x.arc(cx,cy,rr,0,6.28);x.stroke();});
// Scan sweep
var sweepGrad=x.createConicalGradient?null:null;
x.save();x.translate(cx,cy);x.rotate(scanAngle);
var sg=x.createLinearGradient(0,0,R,0);sg.addColorStop(0,'rgba(0,255,80,.18)');sg.addColorStop(1,'rgba(0,255,80,0)');
x.beginPath();x.moveTo(0,0);x.arc(0,0,R,-.5,.5);x.closePath();x.fillStyle=sg;x.fill();
x.restore();
// Scan line
x.save();x.translate(cx,cy);x.rotate(scanAngle);
x.strokeStyle='rgba(0,255,80,.7)';x.lineWidth=1.5;x.shadowBlur=8;x.shadowColor='rgba(0,255,80,.8)';
x.beginPath();x.moveTo(0,0);x.lineTo(R,0);x.stroke();x.restore();x.shadowBlur=0;
// Particles
for(var i=0;i<N;i++){
var p=P[i];p.a+=p.s*(1+p.band*.3)*(Math.sin(t*.5+p.p)*.2+1);p.age+=.003;
var sr=p.r*R+Math.sin(t*1.5+p.q)*R*.03;
var sx=cx+Math.cos(p.a)*sr,sy=cy+Math.sin(p.a)*sr*.7;
// Alert flash for band 3
var al=(p.band===3&&score>75)?.4+Math.sin(t*8)*.3:.15+p.z*.35;
var rd=.6+p.z*1.8;
var col=bandColor(p.band,al);
x.shadowBlur=rd*5;x.shadowColor=col;x.fillStyle=col;x.beginPath();x.arc(sx,sy,rd,0,6.28);x.fill();}
// Central orb
x.globalCompositeOperation='source-over';
var orbR=R*.12,orbPulse=1+Math.sin(t*3)*.08;
var og=x.createRadialGradient(cx,cy,0,cx,cy,orbR*orbPulse);
var sc2=Math.round(score);var oc=sc2>75?'255,20,40':sc2>50?'255,120,0':sc2>25?'255,210,0':'0,255,100';
og.addColorStop(0,'rgba('+oc+',.9)');og.addColorStop(.5,'rgba('+oc+',.3)');og.addColorStop(1,'rgba('+oc+',0)');
x.globalCompositeOperation='lighter';x.fillStyle=og;x.beginPath();x.arc(cx,cy,orbR*orbPulse,0,6.28);x.fill();
x.globalCompositeOperation='source-over';
var fs=Math.min(W,H)*.055;x.textAlign='center';x.font='bold '+fs+'px monospace';
x.shadowBlur=20;x.shadowColor='rgba('+oc+',.8)';x.fillStyle='rgba('+oc+',1)';x.fillText(sc2,cx,cy+fs*.35);
x.font=(fs*.32)+'px monospace';x.fillStyle='rgba('+oc+',.6)';
var band2=sc2>75?'BLOCK':sc2>50?'HOLD':sc2>25?'LOG':'PASS';x.fillText(band2,cx,cy+fs*.8);
var titleFs=Math.min(W,H)*.042;x.font='bold '+titleFs+'px monospace';
x.shadowBlur=22;x.shadowColor='rgba(255,120,0,.8)';x.fillStyle='rgba(255,180,50,'+(0.6+Math.sin(t*.6)*.2)+')';x.fillText('ARBITER ZERO',cx,cy+R*1.25);
x.shadowBlur=10;x.shadowColor='rgba(0,255,80,.5)';x.fillStyle='rgba(0,255,80,.25)';x.font=(titleFs*.42)+'px monospace';x.fillText('LIVING SWARM GENESIS // TOKEN 2/3 // THREAT ORACLE',cx,cy+R*1.5);
x.fillStyle='rgba(255,120,0,.16)';x.font=(titleFs*.32)+'px monospace';x.fillText('ZERO-TRUST // ONCHAIN ATTESTATION // ARBITER-GATED DEFI',cx,cy+R*1.7);x.shadowBlur=0;}
draw();
<\/script></body></html>`;

// ─── ART: TOKEN 3 — THE CRYSTALLIZED ────────────────────────────────────────
// Memory crystallization: particles form lattice, gold light refracts, harmonic resonance
const ART3 = `<!DOCTYPE html><html><head><meta charset=utf-8><style>*{margin:0;padding:0;overflow:hidden;background:#000}canvas{display:block;width:100vw;height:100vh}</style></head><body><canvas id=c></canvas><script>
var c=document.getElementById('c'),x=c.getContext('2d'),W,H,t=0,N=550,P=[],au,init=0,crystalPhase=0;
function sz(){c.width=W=innerWidth;c.height=H=innerHeight}sz();addEventListener('resize',sz);
// Crystal lattice points (hex grid)
var LATTICE=[];for(var row=-4;row<=4;row++){for(var col=-4;col<=4;col++){if(Math.abs(row)+Math.abs(col)+Math.abs(-row-col)<=6){LATTICE.push({x:col+row*.5,y:row*.866});}}}
for(var i=0;i<N;i++){var L=LATTICE[i%LATTICE.length];P.push({lx:L.x,ly:L.y,x:Math.random()*2-1,y:Math.random()*2-1,vx:(Math.random()-.5)*.02,vy:(Math.random()-.5)*.02,z:Math.random(),p:Math.random()*6.28,q:Math.random()*6.28,g:i%3,formed:Math.random()*.5,beam:i%12===0});}
function snd(){if(init)return;init=1;au=new(AudioContext||webkitAudioContext)();var d=au.destination;
var base=220;[1,2,3,4,5,6].forEach(function(h,idx){var o=au.createOscillator(),g=au.createGain();o.frequency.value=base*h;o.type='sine';g.gain.value=.03/(h*.8);o.connect(g);g.connect(d);o.start();});
function bell(){var o=au.createOscillator(),g=au.createGain(),f=au.createBiquadFilter();o.frequency.value=440*Math.pow(2,Math.floor(Math.random()*13)/12);o.type='sine';f.type='bandpass';f.frequency.value=o.frequency.value*2;f.Q.value=8;g.gain.value=0;o.connect(f);f.connect(g);g.connect(d);o.start();
var n=au.currentTime;g.gain.linearRampToValueAtTime(.15,n+.02);g.gain.exponentialRampToValueAtTime(.001,n+2.5);setTimeout(function(){o.stop();},3000);setTimeout(bell,1000+Math.random()*2500);}
bell();
var shimmerBuf=au.createBuffer(1,au.sampleRate*2,au.sampleRate),sd=shimmerBuf.getChannelData(0);
for(var i=0;i<sd.length;i++)sd[i]=(Math.random()*2-1)*.15*Math.sin(i/au.sampleRate*6280);
var shimmerSrc=au.createBufferSource(),shimmerG=au.createGain(),shimmerF=au.createBiquadFilter();
shimmerF.type='highpass';shimmerF.frequency.value=4000;shimmerG.gain.value=.06;
shimmerSrc.buffer=shimmerBuf;shimmerSrc.loop=true;shimmerSrc.connect(shimmerF);shimmerF.connect(shimmerG);shimmerG.connect(d);shimmerSrc.start();}
addEventListener('click',snd);addEventListener('touchstart',snd);
function draw(){requestAnimationFrame(draw);t+=.016;crystalPhase=Math.min(1,crystalPhase+.004);
x.globalCompositeOperation='source-over';x.fillStyle='rgba(1,0,2,.12)';x.fillRect(0,0,W,H);
x.globalCompositeOperation='lighter';
var cx=W/2,cy=H*.46,R=Math.min(W,H)*.28,rot=t*.04;
// Crystal light beams
for(var i=0;i<8;i++){var ba=i*6.28/8+rot;var bx=cx+Math.cos(ba)*R*1.2,by=cy+Math.sin(ba)*R*1.1;
var bg=x.createLinearGradient(cx,cy,bx,by);var hue=(i*45+t*20)%360;
bg.addColorStop(0,'hsla('+hue+',100%,70%,.15)');bg.addColorStop(1,'hsla('+hue+',100%,70%,0)');
x.strokeStyle=bg;x.lineWidth=1+Math.sin(t*2+i)*1;x.shadowBlur=4;x.shadowColor='hsla('+hue+',100%,70%,.4)';
x.beginPath();x.moveTo(cx,cy);x.lineTo(bx,by);x.stroke();}
x.shadowBlur=0;
for(var i=0;i<N;i++){
var p=P[i];
// Target: crystal lattice (formed) vs random (unformed)
var scale=R*.22;var tx=cx+p.lx*scale,ty=cy+p.ly*scale*.92;
var px2=p.x*R+cx,py2=p.y*R+cy;
// Lerp toward lattice
var lerpT=crystalPhase*.85+Math.sin(t*.3+p.p)*.1;
p.x+=(p.lx*.22-p.x)*lerpT*.015;p.y+=(p.ly*.2-p.y)*lerpT*.015;
p.x+=p.vx;p.y+=p.vy;p.vx*=.98;p.vy*=.98;
var sx=p.x*R+cx,sy=p.y*R+cy;
// Rotate whole crystal
var ca=Math.cos(rot),sa=Math.sin(rot);var rx=(sx-cx)*ca-(sy-cy)*sa+cx,ry=(sx-cx)*sa+(sy-cy)*ca+cy;
var al=(.2+.45*p.z+Math.sin(t*2.5+p.p)*.15)*(.3+crystalPhase*.7);
var rd=.7+p.z*2+Math.sin(t*3+p.q)*.5;
var col=p.g===0?'rgba(255,210,60,'+al+')':p.g===1?'rgba(0,235,210,'+al+')':'rgba(255,255,200,'+al+')';
// Beam particles are bigger + brighter
if(p.beam){al=Math.min(1,al*2.5);rd*=1.8;}
x.shadowBlur=rd*6;x.shadowColor=col;x.fillStyle=col;x.beginPath();x.arc(rx,ry,rd,0,6.28);x.fill();}
// Central crystal core
x.globalCompositeOperation='lighter';
var cg=x.createRadialGradient(cx,cy,0,cx,cy,R*.18);
cg.addColorStop(0,'rgba(255,245,180,.7)');cg.addColorStop(.4,'rgba(255,210,60,.2)');cg.addColorStop(1,'rgba(0,235,210,0)');
x.fillStyle=cg;x.beginPath();x.arc(cx,cy,R*.18*(1+Math.sin(t*2)*.06),0,6.28);x.fill();
x.globalCompositeOperation='source-over';
var fs=Math.min(W,H)*.044;x.textAlign='center';
x.shadowBlur=28;x.shadowColor='rgba(255,210,60,.9)';
x.fillStyle='rgba(255,225,100,'+(0.6+Math.sin(t*.65)*.2)+')';x.font='bold '+fs+'px monospace';x.fillText('THE CRYSTALLIZED',cx,cy+R*1.5);
x.shadowBlur=12;x.shadowColor='rgba(0,235,210,.6)';x.fillStyle='rgba(0,235,210,.28)';x.font=(fs*.42)+'px monospace';x.fillText('LIVING SWARM GENESIS // TOKEN 3/3 // ETERNAL MEMORY',cx,cy+R*1.75);
x.fillStyle='rgba(255,210,60,.16)';x.font=(fs*.32)+'px monospace';x.fillText('GEMINI // ROYAL LOGS // ONCHAIN FOREVER // SEPOLIA',cx,cy+R*1.95);x.shadowBlur=0;}
draw();
<\/script></body></html>`;

// ─── Deploy + Mint ────────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(env.SWAPPER_KEY, provider);
const recipient = wallet.address;

console.log('Deploying SwarmGenesis to Sepolia...');
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
  { name: 'GHOST PROTOCOL', html: ART1 },
  { name: 'ARBITER ZERO',   html: ART2 },
  { name: 'THE CRYSTALLIZED', html: ART3 },
];

console.log('\nMinting 3 tokens...');
for (let i = 0; i < artworks.length; i++) {
  const art = artworks[i];
  const uri = toDataURI(art.html);
  console.log(`\nMinting token ${i + 1}: ${art.name} (${art.html.length} bytes → ${uri.length} URI chars)`);
  const tx = await contract.mint(recipient, uri, { gasLimit: 10_000_000 });
  console.log('  Tx:', tx.hash);
  await tx.wait();
  console.log('  ✓ Minted token', i + 1);
}

const supply = await contract.totalSupply();
console.log('\n✓ Total supply:', supply.toString());
console.log('\nAdd to .env.local:');
console.log(`SWARM_GENESIS_ADDRESS=${addr}`);
console.log('\nContract on Etherscan:');
console.log(`https://sepolia.etherscan.io/address/${addr}`);
