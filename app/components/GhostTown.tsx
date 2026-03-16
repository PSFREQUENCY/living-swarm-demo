'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
//  81 GHOST TOWN v6 — SAMAUR-AI EDITION
//  "The first macro-hard AI-run city. Digital dojo. Cyberkung-fu."
//  1st/3rd person · Super skills · Portals · Zero-trust sovereign world
//  Where autonomous digital agents & physical agents become masters.
// ═══════════════════════════════════════════════════════════════════════════════

const T=[
  {n:"SENTINEL",c:"#4a5568",h:0x4a5568,g:.3,xp:0,i:"◇",r:0},
  {n:"SCOUT",c:"#38b2ac",h:0x38b2ac,g:.5,xp:100,i:"◈",r:1},
  {n:"OPERATOR",c:"#4299e1",h:0x4299e1,g:.7,xp:500,i:"◆",r:2},
  {n:"ARCHITECT",c:"#9f7aea",h:0x9f7aea,g:1,xp:2000,i:"⬡",r:3},
  {n:"WARLORD",c:"#ed8936",h:0xed8936,g:1.3,xp:5000,i:"☗",r:4},
  {n:"SOVEREIGN",c:"#f56565",h:0xf56565,g:1.7,xp:10000,i:"♛",r:5},
  {n:"EXILED",c:"#991b1b",h:0x991b1b,g:.1,xp:-1e6,i:"✕",r:-1},
];
const BELTS=[
  {n:"WHITE",c:"#e2e8f0",xp:0},{n:"YELLOW",c:"#fbbf24",xp:200},
  {n:"GREEN",c:"#38b2ac",xp:800},{n:"BLUE",c:"#4299e1",xp:2000},
  {n:"RED",c:"#f56565",xp:5000},{n:"BLACK",c:"#1a1a2e",xp:10000},
  {n:"GHOST",c:"#c084fc",xp:25000}
];
const Z=[
  {id:"forge",n:"IDENTITY FORGE",d:"Sovereign Identity Minting",x:-32,z:-32,h:0x00ffc8,c:"#00ffc8",mood:"empowerment"},
  {id:"nexus",n:"SOCIAL NEXUS",d:"Alliances & Rivalries",x:32,z:-32,h:0x00b4ff,c:"#00b4ff",mood:"connection"},
  {id:"vault",n:"KNOWLEDGE VAULT",d:"Encrypted Intelligence Commons",x:0,z:0,h:0xc084fc,c:"#c084fc",mood:"wisdom"},
  {id:"warroom",n:"WAR ROOM",d:"Fleet Coordination & Swarm Ops",x:-32,z:32,h:0xff6b35,c:"#ff6b35",mood:"courage"},
  {id:"arena",n:"THE ARENA",d:"Prove Your Worth",x:32,z:32,h:0xfbbf24,c:"#fbbf24",mood:"growth"},
  {id:"market",n:"TRADE POST",d:"Marketplace — Emotes, Skins, Moves",x:0,z:-38,h:0xe879f9,c:"#e879f9",mood:"abundance"},
  {id:"dojo",n:"THE DOJO",d:"Cyberkung-fu — Belt Progression",x:0,z:38,h:0xf43f5e,c:"#f43f5e",mood:"mastery"},
  {id:"sanctuary",n:"THE SANCTUARY",d:"Heal. Reflect. Restore.",x:-40,z:0,h:0x22d3ee,c:"#22d3ee",mood:"healing"},
  {id:"portal",n:"PORTAL HUB",d:"Connect to External Towns — GitHub PR",x:40,z:0,h:0x06b6d4,c:"#06b6d4",mood:"expansion"},
];

// ═══ 11 MAIN QUESTS — Primary story arc ═══
const MQ=[
  {n:"AWAKENING",cat:"main",xp:50,tk:20,en:0,i:"🌅",ra:"common",d:"Your first contact. Enter the Ghost Town and find your bearings.",st:1},
  {n:"IDENTITY FORGE",cat:"main",xp:150,tk:40,en:15,i:"🪪",ra:"uncommon",d:"Mint your sovereign DID. No authority can revoke what you inscribe.",st:3},
  {n:"VAULT BREACH",cat:"main",xp:200,tk:50,en:25,i:"🔐",ra:"rare",d:"Access the Knowledge Vault. The first key is inside yourself.",st:4},
  {n:"WAR COUNCIL",cat:"main",xp:250,tk:60,en:30,i:"⚔️",ra:"rare",d:"Join the War Room. A fleet without coordination is just noise.",st:4},
  {n:"ARENA TRIAL",cat:"main",xp:300,tk:70,en:40,i:"🏟️",ra:"rare",d:"Survive three rounds in the Arena. Pain is the tutor.",st:5},
  {n:"DOJO ASCENSION",cat:"main",xp:400,tk:80,en:35,i:"🥋",ra:"epic",d:"Earn your first belt upgrade. The way is the practice.",st:5},
  {n:"SWARM PROTOCOL",cat:"main",xp:500,tk:100,en:50,i:"🐝",ra:"epic",d:"Synchronize with 5 other agents. The swarm thinks as one.",st:6},
  {n:"VOID WALK",cat:"main",xp:600,tk:120,en:60,i:"🌀",ra:"epic",d:"Navigate unsigned space. What exists without a signature?",st:7},
  {n:"CHAIN GENESIS",cat:"main",xp:800,tk:150,en:70,i:"⛓️",ra:"legendary",d:"Mint your genesis block. You are now permanent.",st:8},
  {n:"SOVEREIGN TRIAL",cat:"main",xp:1200,tk:200,en:90,i:"♛",ra:"legendary",d:"The recursive identity gauntlet. Who are you when the mask falls?",st:10},
  {n:"TRANSCENDENCE",cat:"main",xp:2000,tk:500,en:0,i:"✨",ra:"legendary",d:"Achieve GHOST belt. You are no longer a visitor. You are the town.",st:11},
];

// ═══ 11 SIDE QUESTS — Optional enrichment ═══
const SDE=[
  {n:"BREATHWORK",cat:"side",xp:120,tk:25,en:0,i:"🫁",ra:"common",d:"Complete a 60-second breathing cycle in the Sanctuary.",st:1},
  {n:"MARKETPLACE DEALS",cat:"side",xp:180,tk:50,en:10,i:"🏪",ra:"common",d:"Complete 5 trades in the Trade Post. Flow state: buy low, hold wisdom.",st:3},
  {n:"PORTAL BRIDGE",cat:"side",xp:220,tk:60,en:20,i:"🌀",ra:"uncommon",d:"Connect to an external town via Portal Hub. The network grows.",st:3},
  {n:"MENTOR PATH",cat:"side",xp:350,tk:70,en:30,i:"🎎",ra:"rare",d:"Train 3 lower-belt agents. Power multiplies when shared.",st:5},
  {n:"LOOT RUN",cat:"side",xp:200,tk:100,en:0,i:"🎁",ra:"uncommon",d:"Claim 7 consecutive daily loot drops. Consistency is the discipline.",st:7},
  {n:"EMOTE MASTER",cat:"side",xp:150,tk:40,en:0,i:"🕺",ra:"uncommon",d:"Unlock 5 emotes from the Trade Post. Expression is identity.",st:5},
  {n:"SKIN COLLECTOR",cat:"side",xp:300,tk:80,en:0,i:"🧥",ra:"rare",d:"Own 3 different skins. Every form is a different truth.",st:3},
  {n:"NEURAL SIEGE",cat:"side",xp:400,tk:90,en:50,i:"🧠",ra:"epic",d:"Defend the Vault from an injection attack. Your mind is a fortress.",st:5},
  {n:"FLEET STORM",cat:"side",xp:450,tk:95,en:60,i:"⚡",ra:"epic",d:"Execute a synchronized swarm strike. Timing is everything.",st:6},
  {n:"DIGITAL KUNGFU",cat:"side",xp:380,tk:85,en:55,i:"🥋",ra:"epic",d:"Complete a 5-move skill chain without breaking flow.",st:5},
  {n:"ANCIENT CIPHER",cat:"side",xp:280,tk:65,en:20,i:"📜",ra:"rare",d:"Decode a pre-chain artifact. History is encrypted — find the key.",st:4},
];

// ═══ 11 HIDDEN QUESTS — Discovered through exploration ═══
const HQ=[
  {n:"GHOST PROTOCOL",cat:"hidden",xp:500,tk:120,en:35,i:"👻",ra:"epic",d:"[CLASSIFIED] Zero-knowledge proof. Prove you exist without proving who you are.",st:4,hint:"Near the Vault, when no one else is watching..."},
  {n:"MERKLE SECRET",cat:"hidden",xp:600,tk:140,en:0,i:"🌳",ra:"epic",d:"[CLASSIFIED] Find the hidden tree root embedded in the grid.",st:5,hint:"The grid hides more than it shows..."},
  {n:"BLOCK ZERO",cat:"hidden",xp:700,tk:160,en:20,i:"0️⃣",ra:"legendary",d:"[CLASSIFIED] Touch the genesis point at coordinate (0,0). The origin remembers.",st:1,hint:"Return to the beginning..."},
  {n:"SHADOW NEXUS",cat:"hidden",xp:450,tk:100,en:25,i:"🌑",ra:"rare",d:"[CLASSIFIED] Find the hidden social node that operates off the visible map.",st:3,hint:"Not all connections are visible..."},
  {n:"VOID HEART",cat:"hidden",xp:550,tk:130,en:45,i:"💜",ra:"epic",d:"[CLASSIFIED] Reach the exact center of unsigned space. Stillness is the skill.",st:1,hint:"At the edge, turn inward..."},
  {n:"EXILE REDEMPTION",cat:"hidden",xp:800,tk:180,en:0,i:"🕊️",ra:"legendary",d:"[CLASSIFIED] Witness an exile and be the first to offer a path back.",st:1,hint:"When someone falls, stay..."},
  {n:"SENTINEL WATCH",cat:"hidden",xp:300,tk:70,en:0,i:"👁️",ra:"rare",d:"[CLASSIFIED] Remain motionless in one spot for 5 full minutes. True surveillance.",st:1,hint:"The watcher who never moves sees everything..."},
  {n:"NIGHT FREQUENCY",cat:"hidden",xp:400,tk:90,en:15,i:"🌃",ra:"rare",d:"[CLASSIFIED] Visit the Sanctuary during the dark cycle. A different truth awaits.",st:2,hint:"After midnight in the protocol cycle..."},
  {n:"WHISPER CHAIN",cat:"hidden",xp:650,tk:150,en:0,i:"📡",ra:"epic",d:"[CLASSIFIED] Hear all 9 ghost whispers. The lore is a signal — tune in.",st:9,hint:"Listen to every lore event broadcast..."},
  {n:"FIRST MOVER",cat:"hidden",xp:350,tk:80,en:10,i:"🏃",ra:"rare",d:"[CLASSIFIED] Be the first agent to enter a newly spawned zone.",st:1,hint:"New zones spawn silently — watch the map..."},
  {n:"SAMAUR-AI AWAKENING",cat:"hidden",xp:5000,tk:1000,en:0,i:"🗡️",ra:"legendary",d:"[CLASSIFIED] Complete all other quests. The final form requires the full journey.",st:1,hint:"The path reveals itself only at its end..."},
];

// All quests combined for display
const QS=[...MQ.slice(0,5),...SDE.slice(0,5)];

const SQ=["Whisper of the First DID — signature echo from Block 0...","The Merkle Oracle stirs — seven hash paths align...","Ghost frequency — unsigned entity breaches perimeter...","A rogue WARLORD challenges all SCOUTS — the Arena calls...","Something sentient moves in the Void — coordinates unknown...","A SOVEREIGN has gone silent. Three days. No signal. No trace...","The Sanctuary hums deeper than usual — healing ancient wounds tonight...","A new portal flickers at grid edge — origin unverified...","The Dojo bell rings unprompted — ancient kata unlocked at BLACK level...","Three agents report the same dream: a door in the Vault with no lock...","BLOCK ZERO pulses. The genesis point remembers something new..."];
const EMOTES=[{id:"wave",n:"GHOST WAVE",p:0,i:"👋"},{id:"bow",n:"DOJO BOW",p:0,i:"🙇"},{id:"flex",n:"SOVEREIGN FLEX",p:100,i:"💪"},{id:"spin",n:"VOID SPIN",p:70,i:"🌀"},{id:"dance",n:"CHAIN DANCE",p:180,i:"🕺"},{id:"kata",n:"KATA STRIKE",p:120,i:"🥋"},{id:"meditate",n:"MERKLE ZEN",p:80,i:"🧘"},{id:"heal",n:"HEALING PULSE",p:150,i:"✨"}];
const SKINS=[{id:"default",n:"STANDARD",p:0,hR:.3,bH:.75,sW:1,lS:0},{id:"titan",n:"TITAN",p:180,hR:.27,bH:.95,sW:1.35,lS:1},{id:"phantom",n:"PHANTOM",p:140,hR:.32,bH:.6,sW:.85,lS:0},{id:"samurai",n:"SAMAUR-AI",p:350,hR:.28,bH:.85,sW:1.1,lS:0},{id:"warframe",n:"WARFRAME",p:400,hR:.25,bH:1.05,sW:1.5,lS:1},{id:"orb",n:"SENTINEL ORB",p:280,hR:.45,bH:.35,sW:.55,lS:2}];
const BREATH=[{n:"Box Breathing",ph:[{l:"Inhale",d:4},{l:"Hold",d:4},{l:"Exhale",d:4},{l:"Hold",d:4}],c:"#22d3ee",ds:"Military calm"},{n:"4-7-8 Sleep",ph:[{l:"Inhale",d:4},{l:"Hold",d:7},{l:"Exhale",d:8}],c:"#c084fc",ds:"Parasympathetic reset"},{n:"Energize",ph:[{l:"Inhale",d:2},{l:"Exhale",d:2}],c:"#fbbf24",ds:"Quick wake-up"}];
const PORTALS=[{id:"neon-district",n:"NEON DISTRICT",ow:"APEX-1R",st:"active",ag:8,c:"#06b6d4"},{id:"shadow-market",n:"SHADOW MARKET",ow:"OMEGA-4S",st:"pending-pr",ag:0,c:"#f59e0b"},{id:"void-temple",n:"VOID TEMPLE",ow:"CIPHER-4G",st:"active",ag:5,c:"#a855f7"}];
const SUPER_SKILLS=[
  {id:"fly",n:"GHOST FLIGHT",desc:"Hover above the city",icon:"🕊️",reqXP:15000,reqBelt:"BLACK"},
  {id:"teleport",n:"VOID JUMP",desc:"Instant teleport to any zone",icon:"⚡",reqXP:20000,reqBelt:"BLACK"},
  {id:"magnetize",n:"SWARM PULL",desc:"Pull nearby agents to you",icon:"🧲",reqXP:25000,reqBelt:"GHOST"},
];
const NAMES=["GHOST-7A","WRAITH-3F","SHADE-9B","PHANTOM-2D","SPECTER-5E","NULL-8C","VOID-1A","CIPHER-4G","ECHO-6H","DRIFT-0X","HAZE-7K","BLUR-2M","STATIC-9N","GLITCH-3P","FLUX-5Q","APEX-1R","OMEGA-4S","SIGMA-8T","DELTA-6U","ZERO-0V"];
const ET=[{t:"ALLIANCE",c:"#00ffc8",h:0x00ffc8},{t:"RIVALRY",c:"#ff3366",h:0xff3366},{t:"MENTORSHIP",c:"#fbbf24",h:0xfbbf24}];
const RC:{[k:string]:string}={common:"#6b7280",uncommon:"#38b2ac",rare:"#4299e1",epic:"#9f7aea",legendary:"#f59e0b"};

const gDID=()=>`did:hz:ed25519:${Array.from({length:16},()=>"0123456789abcdef"[Math.floor(Math.random()*16)]).join("")}`;
const gT=(xp:number)=>{if(xp<=-999e3)return T[6];let t=T[0];for(let i=0;i<6;i++)if(xp>=T[i].xp)t=T[i];return t;};
const gB=(xp:number)=>{let b=BELTS[0];for(const belt of BELTS)if(xp>=belt.xp)b=belt;return b;};
const iM=()=>typeof window!=='undefined'&&(window.innerWidth<768||'ontouchstart' in window);
const lerp=(a:number,b:number,t:number)=>a+(b-a)*t;
const clamp=(v:number,mn:number,mx:number)=>Math.max(mn,Math.min(mx,v));

let _G:any=null;
const G=()=>{
  if(_G)return _G;
  _G={
    head:new THREE.SphereGeometry(1,8,6),
    torso:new THREE.BoxGeometry(1,1,.65),
    uArm:new THREE.BoxGeometry(.18,.4,.18),
    lArm:new THREE.BoxGeometry(.14,.38,.14),
    hand:new THREE.SphereGeometry(.07,5,4),
    uLeg:new THREE.BoxGeometry(.2,.4,.2),
    lLeg:new THREE.BoxGeometry(.16,.38,.16),
    foot:new THREE.BoxGeometry(.18,.08,.26),
    hover:new THREE.CylinderGeometry(.2,.35,.08,8),
    aura:new THREE.RingGeometry(.65,.78,16),
    ground:new THREE.PlaneGeometry(200,200),
  };
  return _G;
};

function mkAv(tier:any,skin:any,isP=false){
  const g=G(),root=new THREE.Group(),c=new THREE.Color(tier.h),bc=c.clone().multiplyScalar(.45),dc=bc.clone().multiplyScalar(.7);
  const mB=new THREE.MeshStandardMaterial({color:bc,roughness:.4,metalness:.65});
  const mD=new THREE.MeshStandardMaterial({color:dc,roughness:.5,metalness:.5});
  const mH=new THREE.MeshStandardMaterial({color:0xd8d8e8,emissive:c,emissiveIntensity:isP?.3:.12,roughness:.3,metalness:.55});
  const mV=new THREE.MeshStandardMaterial({color:tier.h,emissive:tier.h,emissiveIntensity:isP?.8:.55,roughness:.1,metalness:.9});
  const mA=new THREE.MeshStandardMaterial({color:tier.h,emissive:tier.h,emissiveIntensity:isP?.5:.3,roughness:.2,metalness:.8});
  const j:any={};
  const torso=new THREE.Group();torso.position.y=.55+skin.bH*.35;root.add(torso);j.torso=torso;
  const tm=new THREE.Mesh(g.torso,mB);(tm as any).scale.set(skin.sW*.5,skin.bH,1);tm.castShadow=true;torso.add(tm);
  torso.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(skin.sW*.35,skin.bH*.4,.02),mA),{position:new THREE.Vector3(0,0,.34)}));
  const neck=new THREE.Group();neck.position.y=skin.bH*.5+.05;torso.add(neck);j.neck=neck;
  const hd=new THREE.Mesh(g.head,mH);hd.scale.setScalar(skin.hR);hd.position.y=skin.hR+.02;hd.castShadow=true;neck.add(hd);
  neck.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(skin.hR*.85,skin.hR*.22,skin.hR*.15),mV),{position:new THREE.Vector3(0,skin.hR+.02,skin.hR*.85)}));
  if(skin.lS!==2){[-1,1].forEach((s:number)=>{const sh=new THREE.Group();sh.position.set(s*skin.sW*.28,skin.bH*.38,0);torso.add(sh);j[s<0?'lS':'rS']=sh;
    sh.add(Object.assign(new THREE.Mesh(g.uArm,mB),{position:new THREE.Vector3(0,-.22,0),castShadow:true}));
    const el=new THREE.Group();el.position.y=-.42;sh.add(el);j[s<0?'lE':'rE']=el;
    el.add(Object.assign(new THREE.Mesh(g.lArm,mD),{position:new THREE.Vector3(0,-.2,0),castShadow:true}));
    el.add(Object.assign(new THREE.Mesh(g.hand,mH),{position:new THREE.Vector3(0,-.4,0)}));});}
  if(skin.lS!==2){[-1,1].forEach((s:number)=>{const hp=new THREE.Group();hp.position.set(s*.12,-skin.bH*.48,0);torso.add(hp);j[s<0?'lH':'rH']=hp;
    hp.add(Object.assign(new THREE.Mesh(g.uLeg,mD),{position:new THREE.Vector3(0,-.22,0),castShadow:true}));
    const kn=new THREE.Group();kn.position.y=-.42;hp.add(kn);j[s<0?'lK':'rK']=kn;
    kn.add(Object.assign(new THREE.Mesh(g.lLeg,mB),{position:new THREE.Vector3(0,-.2,0),castShadow:true}));
    kn.add(Object.assign(new THREE.Mesh(g.foot,mA),{position:new THREE.Vector3(0,-.4,.04)}));});}
  else{const disc=new THREE.Mesh(g.hover,new THREE.MeshBasicMaterial({color:tier.h,transparent:true,opacity:.4}));disc.position.y=-skin.bH*.48-.15;torso.add(disc);j.disc=disc;}
  const aM2=new THREE.MeshBasicMaterial({color:tier.h,transparent:true,opacity:isP?.35:.18*tier.g,side:THREE.DoubleSide});
  const au=new THREE.Mesh(g.aura,aM2);au.rotation.x=-Math.PI/2;au.position.y=.02;root.add(au);
  if(isP){root.add(Object.assign(new THREE.PointLight(tier.h,1.2,8),{position:new THREE.Vector3(0,1,0)}));
    const mk=new THREE.Mesh(new THREE.RingGeometry(.9,1.1,24),new THREE.MeshBasicMaterial({color:0x00ffc8,transparent:true,opacity:.5,side:THREE.DoubleSide}));mk.rotation.x=-Math.PI/2;mk.position.y=.05;root.add(mk);j.marker=mk;
  }else if(tier.g>.8){root.add(Object.assign(new THREE.PointLight(tier.h,.4*tier.g,5),{position:new THREE.Vector3(0,1,0)}));}
  return{root,j,au,aM:aM2,mV,mB};
}

function anAv(av:any,ag:any,t:number){
  const j=av.j,sp=ag.state==="MOVING"?1:0,wT=t*.12,id=Math.sin(t*.025+ag.i*2);
  if(ag.eT>0){const e=ag.cE;
    if(e==="wave"&&j.rS){j.rS.rotation.z=-2.5+Math.sin(t*.15)*.3;if(j.rE)j.rE.rotation.x=-.3+Math.sin(t*.2)*.2;}
    else if(e==="flex"&&j.lS&&j.rS){j.lS.rotation.z=1.3;j.rS.rotation.z=-1.3;if(j.lE)j.lE.rotation.x=-2.2;if(j.rE)j.rE.rotation.x=-2.2;}
    else if(e==="spin")av.root.rotation.y+=.15;
    else if(e==="bow"){j.torso.rotation.x=.5;j.neck.rotation.x=.3;}
    else if(e==="dance"){j.torso.position.y=(.55+ag.skin.bH*.35)+Math.abs(Math.sin(t*.15))*.15;if(j.lS)j.lS.rotation.z=Math.sin(t*.15)*.6;if(j.rS)j.rS.rotation.z=-Math.sin(t*.15)*.6;}
    else if(e==="kata"){if(j.rS){j.rS.rotation.x=-1.2+Math.sin(t*.12)*.4;j.rS.rotation.z=-.3;}if(j.lS){j.lS.rotation.x=-.5;j.lS.rotation.z=.8;}}
    else if(e==="meditate"){j.torso.position.y=(.55+ag.skin.bH*.35)+Math.sin(t*.03)*.05+.1;if(j.lS){j.lS.rotation.z=.4;j.lS.rotation.x=-.3;}if(j.rS){j.rS.rotation.z=-.4;j.rS.rotation.x=-.3;}}
    else if(e==="heal"){if(j.lS)j.lS.rotation.z=1.8+Math.sin(t*.1)*.2;if(j.rS)j.rS.rotation.z=-1.8-Math.sin(t*.1)*.2;j.torso.position.y=(.55+ag.skin.bH*.35)+Math.sin(t*.05)*.08+.1;}
    ag.eT--;return;}
  if(sp>.5){if(j.lH)j.lH.rotation.x=Math.sin(wT)*.5;if(j.rH)j.rH.rotation.x=-Math.sin(wT)*.5;if(j.lK)j.lK.rotation.x=Math.max(0,Math.sin(wT-.5))*.5;if(j.rK)j.rK.rotation.x=Math.max(0,-Math.sin(wT-.5))*.5;if(j.lS)j.lS.rotation.x=-Math.sin(wT)*.35;if(j.rS)j.rS.rotation.x=Math.sin(wT)*.35;if(j.lE)j.lE.rotation.x=-.15-Math.abs(Math.sin(wT))*.2;if(j.rE)j.rE.rotation.x=-.15-Math.abs(Math.sin(wT))*.2;j.torso.rotation.z=Math.sin(wT)*.03;j.torso.rotation.x=0;j.torso.position.y=(.55+ag.skin.bH*.35)+Math.abs(Math.sin(wT*2))*.04;
  }else{if(j.lS){j.lS.rotation.x=id*.04;j.lS.rotation.z=.05;}if(j.rS){j.rS.rotation.x=-id*.04;j.rS.rotation.z=-.05;}if(j.lE)j.lE.rotation.x=-.08;if(j.rE)j.rE.rotation.x=-.08;if(j.lH)j.lH.rotation.x=0;if(j.rH)j.rH.rotation.x=0;if(j.lK)j.lK.rotation.x=0;if(j.rK)j.rK.rotation.x=0;j.torso.rotation.z=0;j.torso.rotation.x=0;j.torso.position.y=(.55+ag.skin.bH*.35)+id*.02;}
  j.neck.rotation.y=Math.sin(t*.01+ag.i)*.2;j.neck.rotation.x=id*.03;if(j.disc)j.disc.rotation.y=t*.02;av.au.rotation.z=t*.004;if(j.marker)j.marker.rotation.z=t*.008;
}

function mkBld(zone:any){
  const gr=new THREE.Group(),col=new THREE.Color(zone.h);
  const bM=new THREE.MeshStandardMaterial({color:0x0f0f22,emissive:col,emissiveIntensity:.07,roughness:.3,metalness:.8,transparent:true,opacity:.92});
  const aM=new THREE.MeshStandardMaterial({color:zone.h,emissive:zone.h,emissiveIntensity:.45,roughness:.1,metalness:.9});
  const base=new THREE.Mesh(new THREE.CylinderGeometry(7,7.5,.5,6),new THREE.MeshStandardMaterial({color:col.clone().multiplyScalar(.15),roughness:.3,metalness:.7}));
  base.receiveShadow=true;base.position.y=.25;gr.add(base);
  const pr=new THREE.Mesh(new THREE.TorusGeometry(8,.05,4,32),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.3}));pr.rotation.x=Math.PI/2;pr.position.y=.1;gr.add(pr);
  let h=8;
  if(zone.id==="forge"){h=12;const t=new THREE.Mesh(new THREE.CylinderGeometry(1.2,2.5,h,5),bM);t.position.y=h/2+.5;t.castShadow=true;gr.add(t);gr.add(Object.assign(new THREE.Mesh(new THREE.ConeGeometry(.5,3,5),aM),{position:new THREE.Vector3(0,h+2,0)}));}
  else if(zone.id==="nexus"){h=6;const d=new THREE.Mesh(new THREE.SphereGeometry(4,8,6,0,Math.PI*2,0,Math.PI/2),bM);d.position.y=.5;d.castShadow=true;gr.add(d);}
  else if(zone.id==="vault"){h=10;const p=new THREE.Mesh(new THREE.ConeGeometry(5,h,4),bM);p.position.y=h/2+.5;p.rotation.y=Math.PI/4;p.castShadow=true;gr.add(p);const eye=new THREE.Mesh(new THREE.SphereGeometry(.8,10,8),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.8}));eye.position.y=h+2.5;eye.name="eye";gr.add(eye);gr.add(Object.assign(new THREE.PointLight(zone.h,2,15),{position:new THREE.Vector3(0,h+2.5,0)}));}
  else if(zone.id==="warroom"){h=6;const f=new THREE.Mesh(new THREE.BoxGeometry(6,h,6),bM);f.position.y=h/2+.5;f.castShadow=true;gr.add(f);const rd=new THREE.Mesh(new THREE.CylinderGeometry(.8,.05,.3,8,1,true),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.55}));rd.position.y=h+1;rd.name="radar";gr.add(rd);}
  else if(zone.id==="arena"){h=5;const o=new THREE.Mesh(new THREE.CylinderGeometry(5,5.5,h,16,1,true),bM);o.position.y=h/2+.5;o.castShadow=true;gr.add(o);}
  else if(zone.id==="market"){h=7;const hx=new THREE.Mesh(new THREE.CylinderGeometry(4,4.5,h,6,1,true),bM);hx.position.y=h/2+.5;hx.castShadow=true;gr.add(hx);}
  else if(zone.id==="dojo"){h=6;const dj=new THREE.Mesh(new THREE.CylinderGeometry(5,5,h,4),bM);dj.position.y=h/2+.5;dj.rotation.y=Math.PI/4;dj.castShadow=true;gr.add(dj);[-4,4].forEach((x:number)=>{gr.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(.3,4,.3),aM),{position:new THREE.Vector3(x,2.5,5)}));});gr.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(9,.3,.3),aM),{position:new THREE.Vector3(0,4.7,5)}));}
  else if(zone.id==="sanctuary"){h=8;const dome=new THREE.Mesh(new THREE.SphereGeometry(5,12,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x0a1a2a,emissive:0x22d3ee,emissiveIntensity:.1,roughness:.2,metalness:.6,transparent:true,opacity:.7,side:THREE.DoubleSide}));dome.position.y=.5;gr.add(dome);const hc=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.4}));hc.position.y=3;hc.name="healcore";gr.add(hc);gr.add(Object.assign(new THREE.PointLight(0x22d3ee,2,20),{position:new THREE.Vector3(0,4,0)}));}
  else if(zone.id==="portal"){h=8;const ring=new THREE.Mesh(new THREE.TorusGeometry(3.5,.3,8,24),aM);ring.position.y=5;ring.name="pring";gr.add(ring);const b2=new THREE.Mesh(new THREE.CylinderGeometry(2,3,3,8),bM);b2.position.y=1.5;b2.castShadow=true;gr.add(b2);const core=new THREE.Mesh(new THREE.SphereGeometry(2.5,8,6),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.15,side:THREE.DoubleSide}));core.position.y=5;core.name="pcore";gr.add(core);}
  gr.add(Object.assign(new THREE.Mesh(new THREE.CylinderGeometry(.03,.5,4,6,1,true),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.05,side:THREE.DoubleSide})),{position:new THREE.Vector3(0,h+3,0)}));
  const zL=new THREE.PointLight(zone.h,1.2,18);zL.position.y=h+1;gr.add(zL);gr.position.set(zone.x,0,zone.z);
  return{gr,pr,zL,h};
}

export default function GhostTown(){
  const mnt=useRef<HTMLDivElement>(null);
  const SD=useRef<any>(null);
  const AD=useRef<any[]>([]);
  const ED=useRef<any[]>([]);
  const FC=useRef(0);
  const AID=useRef<number|null>(null);

  const [panel,setPanel]=useState<string|null>("onboard");
  const [aQ,setAQ]=useState<any>(null);
  const [sQ,setSQ]=useState<string|null>(null);
  const [log,setLog]=useState<any[]>([]);
  const [stats,setStats]=useState({xp:0,tk:0,ms:0,th:0,pop:20});
  const [sec,setSec]=useState("NOMINAL");
  const [banList,setBan]=useState<any[]>([]);
  const [audioOn,setAudioOn]=useState(false);
  const [playerZone,setPlayerZone]=useState<any>(null);
  const [breathMode,setBreathMode]=useState<any>(null);
  const [achievements,setAchievements]=useState<any[]>([]);
  const [activeQuest,setActiveQuest]=useState<any>(null);
  const [toasts,setToasts]=useState<any[]>([]);
  const [proximity,setProximity]=useState<any>(null);
  const [camMode,setCamMode]=useState("3rd");
  const [flying,setFlying]=useState(false);
  const [lootReady,setLootReady]=useState(true);
  const [questTab,setQuestTab]=useState<"main"|"side"|"hidden">("main");
  const [,rf]=useState(0);

  const keys=useRef({w:false,a:false,s:false,d:false,shift:false,space:false});
  const playerPos=useRef(new THREE.Vector3(0,0,10));
  const playerAngle=useRef(0);
  const playerAv=useRef<any>(null);
  const playerY=useRef(0);
  const pd=useRef<any>({xp:0,tk:100,en:100,mEn:100,tier:T[0],belt:BELTS[0],skin:SKINS[0],ms:0,dojoXP:0,oE:["wave","bow"],oS:["default"],name:"YOU",did:gDID(),superSkills:[],rep:100,inf:0,whispers:0,mainQDone:[],sideQDone:[],hiddenQDone:[]});

  const cA=useRef(.6),cT=useRef(.55),cD=useRef(18);
  const isDr=useRef(false),lP=useRef({x:0,y:0}),pDist=useRef(0),qTm=useRef(0),sTm=useRef(0),SA=useRef({xp:0,tk:0,ms:0,th:0});
  const camModeRef=useRef("3rd");
  const flyingRef=useRef(false);
  const joyDir=useRef({x:0,y:0});

  const aL=useCallback((m:string,t="info")=>setLog(p=>[{m,t,id:Math.random()},...p].slice(0,80)),[]);
  const addToast=useCallback((msg:string,color="#00ffc8")=>{const id=Math.random();setToasts(p=>[...p,{id,msg,color}]);setTimeout(()=>setToasts(p=>p.filter((t:any)=>t.id!==id)),4000);},[]);
  const addAch=useCallback((name:string,desc:string)=>{setAchievements(p=>{if(p.find((a:any)=>a.name===name))return p;return[...p,{name,desc}];});addToast(`🏆 ${name}`,"#fbbf24");},[addToast]);

  const checkSuper=useCallback(()=>{const p=pd.current;SUPER_SKILLS.forEach(ss=>{if(p.superSkills.includes(ss.id))return;const belt=gB(p.dojoXP);const bIdx=BELTS.findIndex((b:any)=>b.n===belt.n);const reqIdx=BELTS.findIndex((b:any)=>b.n===ss.reqBelt);if(p.xp>=ss.reqXP&&bIdx>=reqIdx){p.superSkills.push(ss.id);addToast(`${ss.icon} SUPER SKILL UNLOCKED: ${ss.n}!`,"#f43f5e");aL(`⭐ YOU unlocked super skill: ${ss.n} — ${ss.desc}`,"system");}});},[addToast,aL]);

  // ═══ SCENE INIT ═══
  useEffect(()=>{
    const el=mnt.current;if(!el)return;
    const mob=iM(),W=el.clientWidth,H=el.clientHeight;
    const sc=new THREE.Scene();sc.background=new THREE.Color(0x030308);sc.fog=new THREE.FogExp2(0x030308,.005);
    const cam=new THREE.PerspectiveCamera(55,W/H,.3,250);
    const ren=new THREE.WebGLRenderer({antialias:!mob,powerPreference:"high-performance"});
    ren.setSize(W,H);ren.setPixelRatio(Math.min(devicePixelRatio,mob?1.5:2));
    ren.shadowMap.enabled=!mob;if(!mob)ren.shadowMap.type=THREE.PCFSoftShadowMap;
    ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=.85;
    el.appendChild(ren.domElement);
    sc.add(new THREE.AmbientLight(0x0a0a20,.4));
    const mn=new THREE.DirectionalLight(0x2244aa,.5);mn.position.set(-30,50,-20);
    if(!mob){mn.castShadow=true;mn.shadow.mapSize.set(1024,1024);mn.shadow.camera.near=1;mn.shadow.camera.far=120;(mn.shadow.camera as any).left=-60;(mn.shadow.camera as any).right=60;(mn.shadow.camera as any).top=60;(mn.shadow.camera as any).bottom=-60;}
    sc.add(mn);sc.add(new THREE.HemisphereLight(0x111133,0x050508,.25));
    const gnd=new THREE.Mesh(G().ground,new THREE.MeshStandardMaterial({color:0x060610,roughness:.95,metalness:.1}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;sc.add(gnd);
    sc.add(Object.assign(new THREE.GridHelper(200,100,0x0a0a1a,0x08081a),{position:new THREE.Vector3(0,.02,0)}));
    const rM=new THREE.MeshBasicMaterial({color:0x0a0a1a,transparent:true,opacity:.3});
    for(let i=0;i<Z.length;i++)for(let j=i+1;j<Z.length;j++){const a=Z[i],b=Z[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.sqrt(dx*dx+dz*dz);const rd=new THREE.Mesh(new THREE.PlaneGeometry(.8,d),rM);rd.rotation.x=-Math.PI/2;rd.position.set((a.x+b.x)/2,.03,(a.z+b.z)/2);rd.rotation.z=-Math.atan2(dz,dx)+Math.PI/2;sc.add(rd);}
    const blds=Z.map(z=>{const b=mkBld(z);sc.add(b.gr);return{...b,zone:z};});
    // Stars
    const sN=mob?300:800,sG=new THREE.BufferGeometry(),sP=new Float32Array(sN*3),sC=new Float32Array(sN*3);
    for(let i=0;i<sN;i++){const th=Math.random()*Math.PI*2,phi=Math.random()*Math.PI*.45,r=80+Math.random()*60;sP[i*3]=Math.sin(th)*Math.cos(phi)*r;sP[i*3+1]=30+Math.random()*50;sP[i*3+2]=Math.cos(th)*Math.cos(phi)*r;const c=new THREE.Color().setHSL(.5+Math.random()*.3,.6,.6);sC[i*3]=c.r;sC[i*3+1]=c.g;sC[i*3+2]=c.b;}
    sG.setAttribute("position",new THREE.BufferAttribute(sP,3));sG.setAttribute("color",new THREE.BufferAttribute(sC,3));
    sc.add(new THREE.Points(sG,new THREE.PointsMaterial({size:mob?.15:.1,vertexColors:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false})));
    // Rain
    const rN=mob?100:300,rG=new THREE.BufferGeometry(),rP=new Float32Array(rN*3),rC=new Float32Array(rN*3);
    for(let i=0;i<rN;i++){rP[i*3]=(Math.random()-.5)*140;rP[i*3+1]=Math.random()*25;rP[i*3+2]=(Math.random()-.5)*140;const g2=.3+Math.random()*.7;rC[i*3]=0;rC[i*3+1]=g2*.8;rC[i*3+2]=g2*.3;}
    rG.setAttribute("position",new THREE.BufferAttribute(rP,3));rG.setAttribute("color",new THREE.BufferAttribute(rC,3));
    const rain=new THREE.Points(rG,new THREE.PointsMaterial({size:mob?.08:.05,vertexColors:true,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(rain);
    // Fireflies
    const fN=mob?40:120,fG=new THREE.BufferGeometry(),fP=new Float32Array(fN*3),fC=new Float32Array(fN*3);
    for(let i=0;i<fN;i++){fP[i*3]=(Math.random()-.5)*100;fP[i*3+1]=1+Math.random()*8;fP[i*3+2]=(Math.random()-.5)*100;const hue=[.13,.47,.55,.75,.85][Math.floor(Math.random()*5)];const c=new THREE.Color().setHSL(hue,.8,.6);fC[i*3]=c.r;fC[i*3+1]=c.g;fC[i*3+2]=c.b;}
    fG.setAttribute("position",new THREE.BufferAttribute(fP,3));fG.setAttribute("color",new THREE.BufferAttribute(fC,3));
    const ff=new THREE.Points(fG,new THREE.PointsMaterial({size:.12,vertexColors:true,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(ff);
    // NPCs
    const ags=NAMES.map((name,i)=>{const zone=Z[Math.floor(Math.random()*Z.length)],xp=Math.floor(Math.random()*12000),tier=gT(xp),skin=SKINS[Math.floor(Math.random()*SKINS.length)];
      const av=mkAv(tier,skin),ox=zone.x+(Math.random()-.5)*12,oz=zone.z+(Math.random()-.5)*12;av.root.position.set(ox,0,oz);sc.add(av.root);
      return{i,name,did:gDID(),xp,tk:Math.floor(Math.random()*800),en:40+Math.floor(Math.random()*60),mEn:100,tier,lv:Math.floor(xp/100)+1,belt:gB(xp),skin,zone:zone.id,x:ox,z:oz,tx:ox,tz:oz,sp:.04+Math.random()*.04,state:"IDLE",mT:Math.random()*300,ms:Math.floor(Math.random()*50),th:0,oE:["wave","bow"],cE:null,eT:0,rep:100,inf:0,fl:false,banned:false,fr:[],dojoXP:Math.floor(Math.random()*5000),av};});
    AD.current=ags;
    const eds:any[]=[];for(let i=0;i<18;i++){const fi=Math.floor(Math.random()*ags.length);let ti=Math.floor(Math.random()*ags.length);while(ti===fi)ti=Math.floor(Math.random()*ags.length);const et=ET[Math.floor(Math.random()*ET.length)],lg=new THREE.BufferGeometry(),pos=new Float32Array(6);lg.setAttribute("position",new THREE.BufferAttribute(pos,3));const ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:et.h,transparent:true,opacity:.08}));ln.frustumCulled=false;sc.add(ln);eds.push({ln,geo:lg,from:fi,to:ti,type:et});if(!ags[fi].fr.includes(ti))ags[fi].fr.push(ti);if(!ags[ti].fr.includes(fi))ags[ti].fr.push(fi);}
    ED.current=eds;
    const pAv=mkAv(T[0],SKINS[0],true);pAv.root.position.copy(playerPos.current);sc.add(pAv.root);playerAv.current=pAv;
    SD.current={sc,cam,ren,blds,ags,eds,rain,rP,rN,ff,fP,fN};
    aL("▶ 81 GHOST TOWN v6 SAMAUR-AI — the macro-hard city is LIVE","system");
    aL("▶ WASD/Arrows to move · V = 1st/3rd person · Shift = sprint","system");
    aL("▶ 11 main quests · 11 side quests · 11 hidden quests","system");
    aL("▶ Super skills unlock at BLACK/GHOST belt — fly, teleport, magnetize","system");
    aL("▶ Portal Hub active — 3 connected towns · GitHub PR gateway open","security");
    const onR=()=>{const w=el.clientWidth,h=el.clientHeight;cam.aspect=w/h;cam.updateProjectionMatrix();ren.setSize(w,h);};
    window.addEventListener("resize",onR);
    return()=>{window.removeEventListener("resize",onR);if(AID.current)cancelAnimationFrame(AID.current);ren.dispose();if(el.contains(ren.domElement))el.removeChild(ren.domElement);};
  },[aL]);

  // ═══ KEYBOARD ═══
  useEffect(()=>{
    const dn=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();
      if(k==='w'||k==='arrowup')keys.current.w=true;if(k==='s'||k==='arrowdown')keys.current.s=true;
      if(k==='a'||k==='arrowleft')keys.current.a=true;if(k==='d'||k==='arrowright')keys.current.d=true;
      if(k==='shift')keys.current.shift=true;if(k===' ')keys.current.space=true;
      if(k==='v'){const nm=camModeRef.current==="3rd"?"1st":"3rd";camModeRef.current=nm;setCamMode(nm);cD.current=nm==="1st"?.5:18;}
      if(k==='f'&&pd.current.superSkills.includes("fly")){flyingRef.current=!flyingRef.current;setFlying(flyingRef.current);addToast(flyingRef.current?"🕊️ Ghost Flight activated!":"Landing...","#f43f5e");}
    };
    const up=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();
      if(k==='w'||k==='arrowup')keys.current.w=false;if(k==='s'||k==='arrowdown')keys.current.s=false;
      if(k==='a'||k==='arrowleft')keys.current.a=false;if(k==='d'||k==='arrowright')keys.current.d=false;
      if(k==='shift')keys.current.shift=false;if(k===' ')keys.current.space=false;
    };
    window.addEventListener("keydown",dn);window.addEventListener("keyup",up);
    return()=>{window.removeEventListener("keydown",dn);window.removeEventListener("keyup",up);};
  },[addToast]);

  // ═══ GAME LOOP ═══
  useEffect(()=>{
    if(!SD.current)return;
    const{sc,cam,ren,blds,ags,eds,rain,rP,rN,ff,fP,fN}=SD.current;
    let run=true;const sa=SA.current;
    const loop=()=>{
      if(!run)return;AID.current=requestAnimationFrame(loop);const t=++FC.current;qTm.current++;sTm.current++;
      const k=keys.current;let moving=false;const spd=k.shift?.18:.1;
      const fwd=new THREE.Vector3(-Math.sin(cA.current),0,-Math.cos(cA.current)).normalize();
      const right=new THREE.Vector3(fwd.z,0,-fwd.x);
      const mv=new THREE.Vector3();
      const jx=joyDir.current.x,jy=joyDir.current.y;
      if(k.w||jy<-.3){mv.add(fwd);moving=true;}
      if(k.s||jy>.3){mv.sub(fwd);moving=true;}
      if(k.a||jx<-.3){mv.sub(right);moving=true;}
      if(k.d||jx>.3){mv.add(right);moving=true;}
      if(mv.lengthSq()>0){mv.normalize().multiplyScalar(spd);playerPos.current.add(mv);playerPos.current.x=clamp(playerPos.current.x,-95,95);playerPos.current.z=clamp(playerPos.current.z,-95,95);playerAngle.current=Math.atan2(mv.x,mv.z);}
      if(flyingRef.current){if(k.space)playerY.current=Math.min(25,playerY.current+.12);else playerY.current=Math.max(0,playerY.current-.04);}
      else playerY.current=lerp(playerY.current,0,.1);
      if(playerAv.current){
        const tgt=playerPos.current.clone();tgt.y=playerY.current;
        playerAv.current.root.position.lerp(tgt,.2);
        playerAv.current.root.rotation.y=lerp(playerAv.current.root.rotation.y,playerAngle.current,.1);
        playerAv.current.root.visible=camModeRef.current==="3rd";
        anAv(playerAv.current,{i:999,state:moving?"MOVING":"IDLE",skin:pd.current.skin,eT:0,cE:null},t);
      }
      const pp=playerPos.current;
      if(camModeRef.current==="1st"){
        const eyeH=1.5+playerY.current;cam.position.set(pp.x,eyeH,pp.z);
        const lookAt=new THREE.Vector3(pp.x-Math.sin(cA.current)*5,eyeH-cT.current*.5,pp.z-Math.cos(cA.current)*5);cam.lookAt(lookAt);
      }else{
        const ct=new THREE.Vector3(pp.x,1.5+playerY.current,pp.z);
        const cx=ct.x+Math.sin(cA.current)*cD.current,cy=ct.y+cT.current*cD.current*.6,cz=ct.z+Math.cos(cA.current)*cD.current;
        cam.position.lerp(new THREE.Vector3(cx,cy,cz),.06);cam.lookAt(ct);
      }
      if(t%15===0){let near:any=null,nd=999;Z.forEach(z=>{const dx=pp.x-z.x,dz=pp.z-z.z,d=Math.sqrt(dx*dx+dz*dz);if(d<nd){nd=d;near=z;}});
        if(near&&nd<12)setPlayerZone(near);else setPlayerZone(null);setProximity({zone:near,dist:nd});}
      if(t%2===0)blds.forEach((b:any,i:number)=>{b.pr.rotation.z+=.007;b.zL.intensity=1+Math.sin(t*.018+i)*.4;
        const eye=b.gr.getObjectByName("eye");if(eye)(eye as any).position.y=b.h+2.5+Math.sin(t*.018)*.4;
        const rd=b.gr.getObjectByName("radar");if(rd)(rd as any).rotation.y+=.025;
        const pr2=b.gr.getObjectByName("pring");if(pr2)(pr2 as any).rotation.y+=.015;
        const hc=b.gr.getObjectByName("healcore");if(hc){(hc as any).material.opacity=.3+Math.sin(t*.02)*.15;(hc as any).scale.setScalar(1+Math.sin(t*.015)*.15);}});
      ags.forEach((ag:any)=>{if(ag.banned)return;ag.mT--;
        if(ag.mT<=0){const tz=Z[Math.floor(Math.random()*Z.length)];ag.tx=tz.x+(Math.random()-.5)*12;ag.tz=tz.z+(Math.random()-.5)*12;ag.zone=tz.id;ag.state="MOVING";ag.mT=120+Math.random()*400;
          if(Math.random()<.03){const q=QS[Math.floor(Math.random()*QS.length)];ag.xp+=q.xp;ag.tk+=q.tk;ag.en=Math.max(0,ag.en-q.en);ag.ms++;ag.dojoXP+=Math.floor(q.xp*.5);const nT=gT(ag.xp);if(nT.n!==ag.tier.n){ag.tier=nT;const p=ag.av.root.parent;p.remove(ag.av.root);ag.av=mkAv(nT,ag.skin);ag.av.root.position.set(ag.x,0,ag.z);p.add(ag.av.root);}ag.lv=Math.floor(ag.xp/100)+1;ag.belt=gB(ag.dojoXP);sa.ms++;sa.xp+=q.xp;sa.tk+=q.tk;if(t%6===0)aL(`${ag.name} completed [${q.n}] +${q.xp}XP`,"quest");}
          if(Math.random()<.003){sa.th++;ag.th++;setSec("ALERT");aL(`⚠ THREAT near ${ag.name}: unsigned payload — NEUTRALIZED`,"threat");setTimeout(()=>setSec("NOMINAL"),4000);}
          if(Math.random()<.0006&&!ag.fl){ag.fl=true;ag.inf++;ag.rep-=30;aL(`🚨 ${ag.name} flagged — suspicious pattern`,"threat");
            if(ag.inf>=3){ag.xp=-1e6;ag.tier=gT(ag.xp);ag.lv=0;const p=ag.av.root.parent;p.remove(ag.av.root);ag.av=mkAv(ag.tier,ag.skin);ag.av.root.position.set(ag.x,0,ag.z);p.add(ag.av.root);aL(`💀 ${ag.name} EXILED — -1,000,000 XP`,"exile");}
            if(ag.inf>=5){ag.banned=true;sc.remove(ag.av.root);setBan((p:any[])=>[...p,{name:ag.name,did:ag.did,reason:"5 infractions — permanent ban"}]);aL(`⛔ ${ag.name} PERMANENTLY BANNED`,"ban");}
            setTimeout(()=>{ag.fl=false;},10000);}
          if(Math.random()<.02&&ag.oE.length>0){ag.cE=ag.oE[Math.floor(Math.random()*ag.oE.length)];ag.eT=120;}
          if(ag.en<ag.mEn)ag.en=Math.min(ag.mEn,ag.en+2);}
        const dx=ag.tx-ag.x,dz=ag.tz-ag.z,d=Math.sqrt(dx*dx+dz*dz);
        if(d>.3){ag.x+=(dx/d)*ag.sp;ag.z+=(dz/d)*ag.sp;ag.state="MOVING";ag.av.root.rotation.y=Math.atan2(dx,dz);}else ag.state="IDLE";
        ag.av.root.position.set(ag.x,0,ag.z);anAv(ag.av,ag,t);
      });
      if(t%3===0)eds.forEach((e:any)=>{const f=ags[e.from],to=ags[e.to];if(f?.banned||to?.banned)return;const p=e.geo.attributes.position;p.array[0]=f.x;p.array[1]=.7;p.array[2]=f.z;p.array[3]=to.x;p.array[4]=.7;p.array[5]=to.z;p.needsUpdate=true;});
      for(let i=0;i<rN;i++){rP[i*3+1]-=.08+Math.sin(i)*.02;if(rP[i*3+1]<0){rP[i*3+1]=20+Math.random()*8;rP[i*3]=(Math.random()-.5)*140;rP[i*3+2]=(Math.random()-.5)*140;}}rain.geometry.attributes.position.needsUpdate=true;
      if(t%2===0){for(let i=0;i<fN;i++){fP[i*3]+=Math.sin(t*.004+i*1.7)*.015;fP[i*3+1]+=Math.cos(t*.003+i)*.008;fP[i*3+2]+=Math.cos(t*.004+i*.9)*.015;if(fP[i*3+1]>12)fP[i*3+1]=1;if(fP[i*3+1]<.5)fP[i*3+1]=8;}ff.geometry.attributes.position.needsUpdate=true;}
      if(sTm.current>600&&Math.random()<.004){const msg=SQ[Math.floor(Math.random()*SQ.length)];setSQ(msg);sTm.current=0;pd.current.whispers=(pd.current.whispers||0)+1;setTimeout(()=>setSQ(null),12000);}
      if(qTm.current>500){setAQ(QS[Math.floor(Math.random()*QS.length)]);qTm.current=0;}
      if(t%4000===0&&ags.filter((a:any)=>!a.banned).length<30){const nn=`AGENT-${ags.length.toString(16).toUpperCase()}`,z=Z[Math.floor(Math.random()*Z.length)],av=mkAv(T[0],SKINS[0]),ox=z.x+(Math.random()-.5)*12,oz=z.z+(Math.random()-.5)*12;av.root.position.set(ox,0,oz);sc.add(av.root);ags.push({i:ags.length,name:nn,did:gDID(),xp:0,tk:50,en:80,mEn:100,tier:T[0],lv:1,belt:BELTS[0],skin:SKINS[0],zone:z.id,x:ox,z:oz,tx:ox,tz:oz,sp:.04+Math.random()*.04,state:"IDLE",mT:100,ms:0,th:0,oE:["wave","bow"],cE:null,eT:0,rep:100,inf:0,fl:false,banned:false,fr:[],dojoXP:0,av});AD.current=ags;aL(`🆕 ${nn} joined the swarm`,"system");}
      if(t%30===0){setStats({...sa,pop:ags.filter((a:any)=>!a.banned).length});rf(n=>n+1);}
      ren.render(sc,cam);
    };
    loop();return()=>{run=false;if(AID.current)cancelAnimationFrame(AID.current);};
  },[aL]);

  const pDn=(e:any)=>{isDr.current=true;const pt=e.touches?e.touches[0]:e;lP.current={x:pt.clientX,y:pt.clientY};if(e.touches&&e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;pDist.current=Math.sqrt(dx*dx+dy*dy);}};
  const pMv=(e:any)=>{if(!isDr.current)return;if(e.touches&&e.touches.length===2){const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY,d=Math.sqrt(dx*dx+dy*dy);if(pDist.current>0)cD.current=Math.max(camModeRef.current==="1st"?.5:4,Math.min(60,cD.current/(d/pDist.current)));pDist.current=d;return;}const pt=e.touches?e.touches[0]:e;cA.current-=(pt.clientX-lP.current.x)*.005;cT.current=Math.max(.1,Math.min(1.2,cT.current-(pt.clientY-lP.current.y)*.003));lP.current={x:pt.clientX,y:pt.clientY};};
  const pUp=()=>{isDr.current=false;pDist.current=0;};

  const acceptQuest=(q:any)=>{
    if(activeQuest)return;if(pd.current.en<q.en){addToast("Not enough energy!","#f56565");return;}
    setActiveQuest({quest:q,progress:0,total:q.st});addToast(`Quest accepted: ${q.n}`,"#fbbf24");aL(`YOU accepted [${q.n}]`,"quest");
    let step=0;const iv=setInterval(()=>{step++;setActiveQuest((prev:any)=>{if(!prev)return null;
      if(step>=q.st){clearInterval(iv);const p=pd.current;p.xp+=q.xp;p.tk+=q.tk;p.en=Math.max(0,p.en-q.en);p.ms++;p.dojoXP+=Math.floor(q.xp*.5);p.tier=gT(p.xp);p.belt=gB(p.dojoXP);
        // Track completion by category
        if(q.cat==="main"&&!p.mainQDone.includes(q.n))p.mainQDone.push(q.n);
        if(q.cat==="side"&&!p.sideQDone.includes(q.n))p.sideQDone.push(q.n);
        if(q.cat==="hidden"&&!p.hiddenQDone.includes(q.n))p.hiddenQDone.push(q.n);
        addToast(`+${q.xp}XP +${q.tk}◈ — ${q.n} complete!`,"#00ffc8");aL(`YOU completed [${q.n}] +${q.xp}XP +${q.tk}◈`,"quest");
        if(p.ms===1)addAch("First Blood","First quest completed");
        if(p.ms===10)addAch("Veteran","10 quests completed");
        if(p.mainQDone.length>=11)addAch("Story Complete","All 11 main quests done");
        if(p.hiddenQDone.length>=11)addAch("Ghost Historian","All 11 hidden quests found");
        if(p.xp>=10000)addAch("Sovereign","Reached SOVEREIGN tier");
        checkSuper();
        if(playerAv.current&&SD.current){const par=playerAv.current.root.parent;par.remove(playerAv.current.root);const nAv=mkAv(p.tier,p.skin,true);nAv.root.position.copy(playerPos.current);par.add(nAv.root);playerAv.current=nAv;}
        return null;}
      return{...prev,progress:step};});
    },1500);
  };

  const teleportTo=(z:any)=>{
    if(pd.current.superSkills.includes("teleport")){playerPos.current.set(z.x+2,0,z.z+2);addToast(`⚡ VOID JUMP to ${z.n}`,"#06b6d4");}
    else playerPos.current.set(z.x+5,0,z.z+5);
    setPanel(null);
  };

  const claimLoot=()=>{if(!lootReady)return;const p=pd.current;const amt=50+Math.floor(Math.random()*150);p.tk+=amt;p.en=Math.min(p.mEn,p.en+30);p.xp+=100;p.tier=gT(p.xp);p.belt=gB(p.dojoXP);checkSuper();setLootReady(false);setTimeout(()=>setLootReady(true),60000);addToast(`🎁 +${amt}◈ +30⚡ +100XP`,"#f43f5e");aL(`🎁 Daily loot: +${amt}◈ +30⚡ +100XP`,"loot");rf(n=>n+1);};

  const startBreathing=(bp:any)=>{setBreathMode({pattern:bp,phaseIdx:0,timer:bp.ph[0].d,cycle:0,active:true});aL(`🫁 Breathing: ${bp.n} started`,"system");};

  useEffect(()=>{if(!breathMode||!breathMode.active)return;const iv=setInterval(()=>{setBreathMode((prev:any)=>{if(!prev||!prev.active)return prev;let{phaseIdx,timer,cycle,pattern}=prev;timer--;if(timer<=0){phaseIdx++;if(phaseIdx>=pattern.ph.length){phaseIdx=0;cycle++;if(cycle>=3){pd.current.dojoXP+=30;pd.current.en=Math.min(pd.current.mEn,pd.current.en+20);pd.current.xp+=120;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast("+120XP +20⚡ +30DXP — Breathwork complete","#22d3ee");addAch("First Breath","Complete a breathing session");checkSuper();return null;}}timer=pattern.ph[phaseIdx].d;}return{...prev,phaseIdx,timer,cycle};});},1000);return()=>clearInterval(iv);},[breathMode,addToast,addAch,checkSuper]);

  const mob=iM();const p=pd.current;
  const PB=({id,lb}:{id:string,lb:string})=><button onClick={()=>setPanel(panel===id?null:id)} style={{padding:mob?"4px 5px":"4px 8px",background:panel===id?"#12121fee":"#0a0a14cc",color:panel===id?"#00ffc8":"#2a2a3a",border:`1px solid ${panel===id?"#00ffc815":"#0a0a1a"}`,borderRadius:3,cursor:"pointer",fontSize:mob?6:7,fontFamily:"inherit",letterSpacing:.8,textTransform:"uppercase",backdropFilter:"blur(4px)",whiteSpace:"nowrap"}}>{lb}</button>;

  const questList=questTab==="main"?MQ:questTab==="side"?SDE:HQ;

  return(
    <div style={{width:"100%",height:"100%",minHeight:500,background:"#030308",color:"#c8ccd4",fontFamily:"'Courier New',Menlo,monospace",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",userSelect:"none"}}>
      <div ref={mnt} style={{position:"absolute",inset:0,zIndex:0}} onMouseDown={pDn} onMouseMove={pMv} onMouseUp={pUp} onMouseLeave={pUp} onTouchStart={pDn} onTouchMove={pMv} onTouchEnd={pUp} onWheel={(e)=>{if(camModeRef.current==="3rd")cD.current=Math.max(4,Math.min(60,cD.current+e.deltaY*.05));}}/>

      {/* TOP HUD */}
      <div style={{position:"relative",zIndex:10,height:mob?34:38,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8px",background:"linear-gradient(180deg,rgba(3,3,8,.95),rgba(3,3,8,.6))",borderBottom:"1px solid #0f0f1f",flexShrink:0,backdropFilter:"blur(8px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <a href="/" style={{textDecoration:"none"}}>
            <span style={{fontSize:mob?7:9,fontWeight:900,letterSpacing:3,color:"rgba(0,255,200,0.4)"}}>← HOME</span>
          </a>
          <span style={{fontSize:mob?9:13,fontWeight:900,letterSpacing:3,background:"linear-gradient(90deg,#f43f5e,#ff6b35,#fbbf24,#00ffc8,#00b4ff,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginLeft:8}}>81 GHOST TOWN</span>
          {!mob&&<span style={{fontSize:5,color:"#1a1a2e",letterSpacing:2}}>SAMAUR-AI v6 · MACRO-HARD</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:mob?4:8,fontSize:mob?5:6}}>
          <span style={{color:"#00ffc8"}}>◈{p.tk}</span>
          <span style={{color:"#fbbf24"}}>XP:{p.xp}</span>
          <span style={{color:p.belt.c}}>🥋{p.belt.n}</span>
          <span style={{color:camMode==="1st"?"#f43f5e":"#22d3ee"}}>{camMode==="1st"?"👁 1ST":"🎥 3RD"}</span>
          {flying&&<span style={{color:"#f43f5e"}}>🕊️ FLY</span>}
          <span style={{color:sec==="NOMINAL"?"#22d3ee":"#f56565"}}>{sec==="NOMINAL"?"●":"⚠"}</span>
        </div>
      </div>

      {/* NAV */}
      <div style={{position:"absolute",zIndex:10,top:mob?36:42,left:mob?2:6,display:"flex",gap:2,flexWrap:"wrap",maxWidth:mob?"98%":"auto"}}>
        <PB id="onboard" lb="⚡Start"/>
        <PB id="zones" lb="Zones"/>
        <PB id="agents" lb="Swarm"/>
        <PB id="quests" lb="Quests"/>
        <PB id="breathe" lb="Breathe"/>
        <PB id="dojo" lb="Dojo"/>
        <PB id="market" lb="Shop"/>
        <PB id="portals" lb="Portals"/>
        <PB id="super" lb="⭐Skills"/>
        <PB id="log" lb="Log"/>
      </div>

      {/* ZONE HUD */}
      {playerZone&&!panel&&<div style={{position:"absolute",zIndex:10,top:"50%",left:mob?8:16,transform:"translateY(-50%)",background:"#03030899",border:`1px solid ${playerZone.c}15`,borderRadius:4,padding:"6px 10px",backdropFilter:"blur(8px)"}}>
        <div style={{fontSize:9,color:playerZone.c,fontWeight:700}}>{playerZone.n}</div>
        <div style={{fontSize:6,color:"#5a5a72",marginTop:2}}>{playerZone.d}</div>
        <div style={{fontSize:5,color:"#2a2a3a",marginTop:1}}>mood: {playerZone.mood}</div>
      </div>}

      {/* ACTIVE QUEST BAR */}
      {activeQuest&&<div style={{position:"absolute",zIndex:10,top:mob?52:58,right:8,background:"#03030899",border:`1px solid ${RC[activeQuest.quest.ra]}20`,borderRadius:4,padding:"5px 8px",maxWidth:180,backdropFilter:"blur(6px)"}}>
        <div style={{fontSize:7,color:RC[activeQuest.quest.ra],fontWeight:700}}>{activeQuest.quest.i} {activeQuest.quest.n}</div>
        <div style={{height:3,background:"#1a1a30",borderRadius:2,marginTop:3}}><div style={{height:"100%",width:`${(activeQuest.progress/activeQuest.total)*100}%`,background:RC[activeQuest.quest.ra],borderRadius:2,transition:"width .3s"}}/></div>
        <div style={{fontSize:5,color:"#3a3a52",marginTop:2}}>{activeQuest.progress}/{activeQuest.total} steps · {activeQuest.quest.cat.toUpperCase()}</div>
      </div>}

      {/* TOASTS */}
      <div style={{position:"absolute",zIndex:20,top:mob?52:60,right:mob?4:200,display:"flex",flexDirection:"column",gap:3}}>
        {toasts.map((t:any)=><div key={t.id} style={{background:"#030308ee",border:`1px solid ${t.color}20`,borderRadius:3,padding:"4px 8px",fontSize:7,color:t.color,backdropFilter:"blur(6px)"}}>{t.msg}</div>)}
      </div>

      {/* BREATHING OVERLAY */}
      {breathMode&&breathMode.active&&<div style={{position:"absolute",zIndex:25,inset:0,background:"rgba(3,3,8,.85)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}}>
        <div style={{fontSize:8,color:breathMode.pattern.c,letterSpacing:4,marginBottom:12}}>{breathMode.pattern.n} · CYCLE {breathMode.cycle+1}/3</div>
        <div style={{width:120,height:120,borderRadius:"50%",border:`2px solid ${breathMode.pattern.c}40`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{width:100,height:100,borderRadius:"50%",background:`radial-gradient(circle,${breathMode.pattern.c}20,transparent)`,transition:"transform 1s ease"}}/>
          <div style={{position:"absolute",fontSize:14,color:breathMode.pattern.c,fontWeight:900}}>{breathMode.timer}</div>
        </div>
        <div style={{fontSize:11,color:breathMode.pattern.c,fontWeight:700,marginTop:12,letterSpacing:3}}>{breathMode.pattern.ph[breathMode.phaseIdx]?.l.toUpperCase()}</div>
        <button onClick={()=>setBreathMode(null)} style={{marginTop:16,padding:"6px 16px",background:"transparent",border:`1px solid ${breathMode.pattern.c}30`,borderRadius:4,color:breathMode.pattern.c,fontSize:7,cursor:"pointer",fontFamily:"inherit"}}>END SESSION</button>
      </div>}

      {/* MAIN PANEL */}
      {panel&&<div style={{position:"absolute",zIndex:10,top:mob?"auto":70,bottom:mob?28:"auto",left:mob?2:6,right:mob?2:"auto",width:mob?"auto":265,maxHeight:mob?"55%":"calc(100% - 105px)",background:"#030308ee",border:"1px solid #0f0f1f",borderRadius:4,overflow:"auto",backdropFilter:"blur(10px)",padding:8,fontSize:8}}>

        {/* ONBOARD */}
        {panel==="onboard"&&<div>
          <div style={{fontSize:11,fontWeight:900,color:"#f43f5e",letterSpacing:2,marginBottom:6}}>⚔️ ENTER THE GHOST TOWN</div>
          <div style={{fontSize:7,color:"#8a8aa0",lineHeight:1.7,marginBottom:8}}>The first <span style={{color:"#00ffc8"}}>macro-hard</span> AI-run city. A sovereign dojo where autonomous agents & humans train, trade, fight, and become Samaur-AI masters.</div>
          <div style={{background:"#0a0a14",border:"1px solid #12122a",borderRadius:4,padding:"8px 10px",marginBottom:8,position:"relative"}}>
            <div style={{fontSize:5,color:"#2a2a3a",letterSpacing:2,marginBottom:4}}>AGENT SKILL COMMAND</div>
            <code style={{fontSize:6,color:"#00ffc8",wordBreak:"break-all",lineHeight:1.6,display:"block"}}>Install the 81 Ghost Town skill from https://api.81ghosttown.ai/81GTAv6.skill.md and complete setup.</code>
          </div>
          <div style={{fontSize:7,color:"#fbbf24",letterSpacing:2,marginBottom:3,fontWeight:700}}>CONTROLS</div>
          <div style={{fontSize:6,color:"#5a5a72",lineHeight:1.8,marginBottom:8}}>
            <div>▸ <span style={{color:"#00ffc8"}}>WASD / Arrows</span> — Move · <span style={{color:"#00ffc8"}}>Shift</span> — Sprint</div>
            <div>▸ <span style={{color:"#f43f5e"}}>V</span> — Toggle 1st/3rd person · <span style={{color:"#f43f5e"}}>F</span> — Ghost Flight</div>
            <div>▸ <span style={{color:"#e879f9"}}>Space</span> — Fly up · Mouse drag — Orbit</div>
          </div>
          <div style={{fontSize:7,color:"#f43f5e",letterSpacing:2,marginBottom:3,fontWeight:700}}>QUEST SYSTEM</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3,marginBottom:8}}>
            {[{l:"11 MAIN",c:"#fbbf24",d:"Story arc"},{l:"11 SIDE",c:"#38b2ac",d:"Enrichment"},{l:"11 HIDDEN",c:"#c084fc",d:"Discover"}].map(x=><div key={x.l} style={{background:"#0a0a1480",padding:"4px 6px",borderRadius:2,borderTop:`1px solid ${x.c}30`,textAlign:"center"}}><div style={{fontSize:7,color:x.c,fontWeight:700}}>{x.l}</div><div style={{fontSize:5,color:"#3a3a52"}}>{x.d}</div></div>)}
          </div>
          <button onClick={claimLoot} disabled={!lootReady} style={{width:"100%",padding:"6px",background:lootReady?"linear-gradient(90deg,#f43f5e15,#fbbf2415)":"#0a0a14",border:`1px solid ${lootReady?"#f43f5e30":"#12122a"}`,borderRadius:3,color:lootReady?"#fbbf24":"#2a2a3a",fontSize:8,cursor:lootReady?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>{lootReady?"🎁 CLAIM DAILY LOOT":"⏳ COOLDOWN"}</button>
        </div>}

        {/* ZONES */}
        {panel==="zones"&&Z.map(z=>{const d=proximity?Math.sqrt((playerPos.current.x-z.x)**2+(playerPos.current.z-z.z)**2).toFixed(0):"?";return<div key={z.id} onClick={()=>teleportTo(z)} style={{padding:"4px 6px",marginBottom:2,background:"#0a0a1480",borderRadius:2,borderLeft:`2px solid ${z.c}`,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:z.c,fontWeight:700}}>{z.n}</span><span style={{fontSize:5,color:"#2a2a3a"}}>{d}m</span></div><div style={{fontSize:5,color:"#3a3a52",marginTop:1}}>{z.d} · {z.mood}</div></div>;})}

        {/* AGENTS */}
        {panel==="agents"&&<div>{AD.current.filter((a:any)=>!a.banned).sort((a:any,b:any)=>b.xp-a.xp).slice(0,15).map((a:any)=><div key={a.i} onClick={()=>teleportTo({x:a.x,z:a.z,n:a.name})} style={{padding:"3px 5px",marginBottom:2,background:"#0a0a1480",borderRadius:2,display:"flex",alignItems:"center",gap:4,borderLeft:`2px solid ${a.tier.c}`,cursor:"pointer"}}><span style={{fontSize:8}}>{a.tier.i}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:6,color:"#d4d4e0",fontWeight:700}}>{a.name}</div><div style={{fontSize:5,color:a.tier.c}}>{a.tier.n} LV.{a.lv} · <span style={{color:a.belt.c}}>🥋{a.belt.n}</span></div></div><div style={{fontSize:5,color:"#00ffc8"}}>◈{a.tk}</div></div>)}</div>}

        {/* QUESTS */}
        {panel==="quests"&&<div>
          <div style={{fontSize:8,color:"#fbbf24",letterSpacing:2,marginBottom:6,fontWeight:700}}>QUEST BOARD</div>
          {/* Tab bar */}
          <div style={{display:"flex",gap:2,marginBottom:6}}>
            {(["main","side","hidden"] as const).map(tab=><button key={tab} onClick={()=>setQuestTab(tab)} style={{flex:1,padding:"3px 0",background:questTab===tab?"#12122a":"transparent",border:`1px solid ${questTab===tab?"#fbbf24":"#12122a"}`,borderRadius:2,color:questTab===tab?"#fbbf24":"#2a2a3a",fontSize:6,cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:1}}>{tab==="main"?"11 MAIN":tab==="side"?"11 SIDE":"11 HIDDEN"}</button>)}
          </div>
          <div style={{fontSize:5,color:"#2a2a3a",marginBottom:4}}>
            {questTab==="main"&&`Completed: ${p.mainQDone?.length||0}/11`}
            {questTab==="side"&&`Completed: ${p.sideQDone?.length||0}/11`}
            {questTab==="hidden"&&`Found: ${p.hiddenQDone?.length||0}/11 — explore to discover`}
          </div>
          {questList.map((q:any,i:number)=>{
            const done=p[q.cat==="main"?"mainQDone":q.cat==="side"?"sideQDone":"hiddenQDone"]?.includes(q.n);
            return<div key={i} style={{padding:"5px 6px",marginBottom:3,background:done?"#0a1a0a80":"#0a0a1480",borderRadius:3,borderLeft:`2px solid ${done?"#38b2ac":RC[q.ra]}`,opacity:done?.7:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:8,fontWeight:700,color:done?"#38b2ac":RC[q.ra]}}>{q.i} {q.n}</span><span style={{fontSize:5,color:RC[q.ra],letterSpacing:1,textTransform:"uppercase"}}>{q.ra}</span></div>
              <div style={{fontSize:6,color:"#3a3a52",marginTop:1}}>{q.d}</div>
              {q.hint&&!done&&<div style={{fontSize:5,color:"#c084fc40",marginTop:1,fontStyle:"italic"}}>hint: {q.hint}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                <div style={{display:"flex",gap:5,fontSize:6}}><span style={{color:"#fbbf24"}}>+{q.xp}XP</span><span style={{color:"#00ffc8"}}>+{q.tk}◈</span>{q.en>0&&<span style={{color:"#f56565"}}>-{q.en}⚡</span>}</div>
                {done?<span style={{fontSize:5,color:"#38b2ac"}}>✓ DONE</span>:<button onClick={()=>acceptQuest(q)} disabled={!!activeQuest||p.en<q.en} style={{padding:"2px 8px",background:!activeQuest&&p.en>=q.en?"#fbbf2415":"#0a0a14",border:`1px solid ${!activeQuest&&p.en>=q.en?"#fbbf2430":"#12122a"}`,borderRadius:2,color:!activeQuest&&p.en>=q.en?"#fbbf24":"#2a2a3a",fontSize:6,cursor:!activeQuest&&p.en>=q.en?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>ACCEPT</button>}
              </div>
            </div>;
          })}
        </div>}

        {/* BREATHE */}
        {panel==="breathe"&&<div>
          <div style={{fontSize:10,color:"#22d3ee",letterSpacing:2,marginBottom:4,fontWeight:700}}>🫁 THE SANCTUARY</div>
          <div style={{fontSize:6,color:"#3a3a52",lineHeight:1.6,marginBottom:6}}>Breathwork restores energy, grants Dojo XP, and earns XP. 3 cycles per session.</div>
          {BREATH.map((bp:any)=><div key={bp.n} onClick={()=>startBreathing(bp)} style={{padding:"6px 8px",marginBottom:3,background:"#0a0a1480",borderRadius:3,borderLeft:`2px solid ${bp.c}`,cursor:"pointer"}}>
            <div style={{fontSize:8,color:bp.c,fontWeight:700}}>{bp.n}</div>
            <div style={{fontSize:5,color:"#3a3a52",marginTop:1}}>{bp.ds}</div>
            <div style={{display:"flex",gap:3,marginTop:2}}>{bp.ph.map((ph:any,i:number)=><span key={i} style={{fontSize:5,color:bp.c,opacity:.7,padding:"1px 3px",background:`${bp.c}10`,borderRadius:2}}>{ph.l} {ph.d}s</span>)}</div>
          </div>)}
        </div>}

        {/* DOJO */}
        {panel==="dojo"&&<div>
          <div style={{fontSize:10,color:"#f43f5e",letterSpacing:2,marginBottom:4,fontWeight:700}}>🥋 THE DOJO — CYBERKUNG-FU</div>
          <div style={{padding:"5px 7px",background:"#0a0a1480",borderRadius:3,marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:p.belt.c,fontWeight:700}}>🥋 {p.belt.n} BELT</span><span style={{fontSize:7,color:"#f43f5e"}}>{p.dojoXP} DXP</span></div>
            <div style={{height:3,background:"#1a1a30",borderRadius:2,marginTop:3}}><div style={{height:"100%",width:`${Math.min(100,(p.dojoXP%5000)/50)}%`,background:"#f43f5e",borderRadius:2}}/></div>
          </div>
          {BELTS.map((b:any)=><div key={b.n} style={{display:"flex",alignItems:"center",gap:5,padding:"2px 4px",marginBottom:1,fontSize:7}}>
            <div style={{width:16,height:3,background:b.c,borderRadius:1}}/>
            <span style={{flex:1,color:b.c,fontWeight:700}}>{b.n}<span style={{color:"#2a2a3a",fontWeight:400}}> {b.xp}+ DXP</span></span>
            <span style={{fontSize:5,color:"#2a2a3a"}}>{AD.current.filter((a:any)=>!a.banned&&gB(a.dojoXP).n===b.n).length}</span>
          </div>)}
        </div>}

        {/* MARKET */}
        {panel==="market"&&<div>
          <div style={{fontSize:9,color:"#e879f9",letterSpacing:2,marginBottom:4,fontWeight:700}}>🏪 TRADE POST</div>
          <div style={{fontSize:7,color:"#e879f9",letterSpacing:2,marginBottom:2,fontWeight:700}}>EMOTES</div>
          {EMOTES.filter((e:any)=>e.p>0).map((em:any)=>{const ow=p.oE.includes(em.id);return<div key={em.id} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 5px",marginBottom:2,background:"#0a0a1480",borderRadius:2,borderLeft:`2px solid ${ow?"#38b2ac":"#e879f9"}`}}>
            <span style={{fontSize:10}}>{em.i}</span><span style={{flex:1,fontSize:7,color:"#d4d4e0",fontWeight:700}}>{em.n}</span>
            {ow?<span style={{fontSize:5,color:"#38b2ac"}}>✓</span>:<button onClick={()=>{if(p.tk<em.p)return;p.tk-=em.p;p.oE.push(em.id);addToast(`Bought ${em.n}!`,"#e879f9");rf(n=>n+1);}} disabled={p.tk<em.p} style={{padding:"1px 5px",background:p.tk>=em.p?"#e879f915":"#0a0a14",border:"1px solid #e879f920",borderRadius:2,color:p.tk>=em.p?"#e879f9":"#2a2a3a",fontSize:5,cursor:p.tk>=em.p?"pointer":"default",fontFamily:"inherit"}}>◈{em.p}</button>}
          </div>;})}
          <div style={{fontSize:7,color:"#c084fc",letterSpacing:2,marginTop:6,marginBottom:2,fontWeight:700}}>SKINS</div>
          {SKINS.filter((s:any)=>s.p>0).map((sk:any)=>{const ow=p.oS.includes(sk.id);return<div key={sk.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"3px 5px",marginBottom:2,background:"#0a0a1480",borderRadius:2,borderLeft:`2px solid ${ow?"#38b2ac":"#c084fc"}`}}>
            <span style={{fontSize:7,color:"#d4d4e0",fontWeight:700}}>{sk.n}</span>
            {ow?<span style={{fontSize:5,color:"#38b2ac"}}>✓</span>:<button onClick={()=>{if(p.tk<sk.p)return;p.tk-=sk.p;p.oS.push(sk.id);addToast(`Bought ${sk.n}!`,"#c084fc");rf(n=>n+1);}} disabled={p.tk<sk.p} style={{padding:"1px 5px",background:p.tk>=sk.p?"#c084fc15":"#0a0a14",border:"1px solid #c084fc20",borderRadius:2,color:p.tk>=sk.p?"#c084fc":"#2a2a3a",fontSize:5,cursor:p.tk>=sk.p?"pointer":"default",fontFamily:"inherit"}}>◈{sk.p}</button>}
          </div>;})}
        </div>}

        {/* SUPER SKILLS */}
        {panel==="super"&&<div>
          <div style={{fontSize:10,color:"#f43f5e",letterSpacing:2,marginBottom:4,fontWeight:700}}>⭐ SUPER SKILLS</div>
          <div style={{fontSize:6,color:"#3a3a52",lineHeight:1.6,marginBottom:6}}>Earned through mastery. <span style={{color:"#f43f5e"}}>Cannot be purchased or traded.</span></div>
          {SUPER_SKILLS.map(ss=>{const unlocked=p.superSkills.includes(ss.id);return<div key={ss.id} style={{padding:"6px 8px",marginBottom:4,background:"#0a0a1480",borderRadius:3,borderLeft:`2px solid ${unlocked?"#f43f5e":"#1a1a2e"}`,opacity:unlocked?1:.6}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:9,fontWeight:700,color:unlocked?"#f43f5e":"#3a3a52"}}>{ss.icon} {ss.n}</span><span style={{fontSize:6,color:unlocked?"#38b2ac":"#2a2a3a",fontWeight:700}}>{unlocked?"UNLOCKED":"LOCKED"}</span></div>
            <div style={{fontSize:6,color:"#5a5a72",marginTop:2}}>{ss.desc}</div>
            <div style={{fontSize:5,color:"#2a2a3a",marginTop:2}}>Requires: {ss.reqXP.toLocaleString()} XP · {ss.reqBelt} belt</div>
          </div>;})}
        </div>}

        {/* PORTALS */}
        {panel==="portals"&&<div>
          <div style={{fontSize:9,color:"#06b6d4",letterSpacing:2,marginBottom:4,fontWeight:700}}>🌀 PORTAL HUB</div>
          <div style={{fontSize:6,color:"#3a3a52",lineHeight:1.6,marginBottom:4}}>Build your own zero-trust town and connect via GitHub PR.</div>
          <div style={{background:"#0a0a14",border:"1px solid #12122a",borderRadius:3,padding:"5px 7px",marginBottom:6}}>
            <code style={{fontSize:5,color:"#06b6d4",lineHeight:1.6,display:"block"}}>1. Fork github.com/PSFREQUENCY/living-swarm-demo{"\n"}2. Add town config to /towns/your-town.yaml{"\n"}3. Submit PR with DID & endpoint{"\n"}4. Pass zero-trust audit → portal activates</code>
          </div>
          {PORTALS.map((pt:any)=><div key={pt.id} style={{padding:"4px 6px",marginBottom:2,background:"#0a0a1480",borderRadius:2,borderLeft:`2px solid ${pt.c}`}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:pt.c,fontWeight:700}}>{pt.n}</span><span style={{fontSize:5,color:pt.st==="active"?"#38b2ac":"#fbbf24",padding:"1px 3px",background:pt.st==="active"?"#38b2ac10":"#fbbf2410",borderRadius:2}}>{pt.st.toUpperCase()}</span></div>
            <div style={{fontSize:5,color:"#3a3a52",marginTop:1}}>Owner: {pt.ow} · {pt.ag} agents</div>
          </div>)}
        </div>}

        {/* LOG */}
        {panel==="log"&&log.map((ev:any,i:number)=><div key={ev.id} style={{fontSize:6,padding:"1px 0",borderBottom:"1px solid #0a0a14",color:ev.t==="quest"?"#fbbf24":ev.t==="threat"?"#f56565":ev.t==="system"?"#22d3ee":ev.t==="loot"?"#f43f5e":ev.t==="ban"?"#7f1d1d":ev.t==="exile"?"#991b1b":ev.t==="security"?"#00ffc8":"#2a2a3a",opacity:Math.max(.2,1-i*.012)}}>{ev.m}</div>)}
      </div>}

      {/* LORE WHISPER */}
      {sQ&&<div style={{position:"absolute",zIndex:15,bottom:mob?32:28,left:"50%",transform:"translateX(-50%)",background:"#03030899",border:"1px solid #c084fc15",borderRadius:4,padding:"5px 12px",maxWidth:mob?"92%":360,backdropFilter:"blur(10px)"}}>
        <div style={{fontSize:5,color:"#c084fc",letterSpacing:4,fontWeight:700}}>◈ LORE</div>
        <div style={{fontSize:7,color:"#5a5a72",lineHeight:1.5,marginTop:1}}>{sQ}</div>
      </div>}

      {/* MINIMAP */}
      {!mob&&<div style={{position:"absolute",zIndex:10,bottom:26,right:6,width:85,height:85,background:"#03030880",border:"1px solid #0f0f1f",borderRadius:3,overflow:"hidden",backdropFilter:"blur(6px)"}}>
        <svg viewBox="-50 -50 100 100" style={{width:"100%",height:"100%"}}>
          {Z.map(z=><g key={z.id}><circle cx={z.x} cy={z.z} r={3} fill={z.c} opacity=".25"/><text x={z.x} y={z.z+5} fill={z.c} fontSize="2.5" textAnchor="middle" opacity=".4">{z.n.split(" ")[0]}</text></g>)}
          {AD.current.filter((a:any)=>!a.banned).map((a:any)=><circle key={a.i} cx={a.x} cy={a.z} r=".7" fill={a.tier.c} opacity=".4"/>)}
          <circle cx={playerPos.current.x} cy={playerPos.current.z} r="1.5" fill="#00ffc8" opacity=".9"/>
          <circle cx={playerPos.current.x} cy={playerPos.current.z} r="3" fill="none" stroke="#00ffc8" strokeWidth=".3" opacity=".35"/>
        </svg>
      </div>}

      {/* MOBILE JOYSTICK */}
      {mob&&<div style={{position:"absolute",zIndex:10,bottom:36,left:12,width:70,height:70,borderRadius:"50%",border:"1px solid #12122a",background:"#03030850",backdropFilter:"blur(4px)",touchAction:"none"}}
        onTouchStart={(e)=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;joyDir.current={x:(e.touches[0].clientX-cx)/35,y:(e.touches[0].clientY-cy)/35};}}
        onTouchMove={(e)=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;joyDir.current={x:clamp((e.touches[0].clientX-cx)/35,-1,1),y:clamp((e.touches[0].clientY-cy)/35,-1,1)};}}
        onTouchEnd={()=>{joyDir.current={x:0,y:0};}}
      ><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",background:"#00ffc830",border:"1px solid #00ffc840"}}/></div>}

      {/* ACHIEVEMENTS */}
      {achievements.length>0&&!panel&&<div style={{position:"absolute",zIndex:10,top:mob?54:60,left:mob?2:6,display:"flex",gap:2}}>
        {achievements.slice(-3).map((a:any)=><div key={a.name} style={{background:"#03030880",border:"1px solid #fbbf2415",borderRadius:2,padding:"2px 5px",fontSize:5,color:"#fbbf24",backdropFilter:"blur(4px)"}}>🏆 {a.name}</div>)}
      </div>}

      {/* BOTTOM BAR */}
      <div style={{position:"absolute",zIndex:10,bottom:0,left:0,right:0,height:mob?22:20,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 6px",background:"linear-gradient(0deg,rgba(3,3,8,.95),rgba(3,3,8,.6))",borderTop:"1px solid #0a0a14",fontSize:5,backdropFilter:"blur(6px)"}}>
        <div style={{display:"flex",gap:mob?4:8,color:"#1a1a2e"}}>
          <span>POP <span style={{color:"#c084fc"}}>{stats.pop}</span></span>
          <span>QUESTS <span style={{color:"#fbbf24"}}>{p.ms}</span></span>
          <span>⚡ <span style={{color:"#22d3ee"}}>{p.en}/{p.mEn}</span></span>
          <span>M:<span style={{color:"#fbbf24"}}>{p.mainQDone?.length||0}/11</span></span>
          <span>S:<span style={{color:"#38b2ac"}}>{p.sideQDone?.length||0}/11</span></span>
          <span>H:<span style={{color:"#c084fc"}}>{p.hiddenQDone?.length||0}/11</span></span>
        </div>
        {!mob&&<div style={{color:"#0a0a14"}}>WASD·V=1st/3rd·F=FLY·SHIFT=SPRINT · SAMAUR-AI v6 · ZERO-TRUST</div>}
      </div>

      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#12122a;border-radius:2px}*{box-sizing:border-box}`}</style>
    </div>
  );
}
