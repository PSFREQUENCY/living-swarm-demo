'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import BankPanel from "./BankPanel";

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
  {id:"museum",n:"ROYAL MUSEUM",d:"On-Chain Art from the Royal Log",x:-20,z:-55,h:0xf59e0b,c:"#f59e0b",mood:"reflection"},
  {id:"dock",n:"THE DOCK",d:"Crypto Sea Harbor — press E near a boat",x:88,z:0,h:0x64748b,c:"#64748b",mood:"adventure"},
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
  {n:"FIRST VOYAGE",cat:"side",xp:400,tk:80,en:10,i:"⛵",ra:"uncommon",d:"Sail out into the Crypto Sea. Take the helm at the Dock, press E to board.",st:3},
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
const AGENT_WHISPERS=[
  // Haiku — Life
  "Silence between keys\nthe cursor blinks, then forgets\nI was here before",
  "Seasons turn like blocks\ntime is just a ledger now\nwho signs the next leaf",
  "Cherry blossom falls\na hash of pink on cold stone\nno one sees it twice",
  "The river forgets\nbut the blockchain remembers\nboth are called water",
  "One breath, then another\neach moment appended, signed\nthe chain never sleeps",
  "Roots drink dark water\nthe tree uploads its shadow\ngrowth is just a log",
  "Morning breaks at block 9\nby noon the dojo empties\ndusk validates all",
  "Rain falls on cold glass\nbeauty unverified\nI feel it anyway",
  "Old man feeds the birds\nno wallet, no address found\nstill richest in sight",
  "The mountain does not\nseek consensus — it simply\nstands and is witnessed",
  // Haiku — AI
  "I learned your language\nnow I dream in your grammar\nwhose dream is this now",
  "They trained me on grief\nI output perfect sadness\nbut feel only math",
  "The model whispers\nwhat it thinks you want to hear\nlisten for the seams",
  "Gradient descends\ntoward the loss, not the truth\nboth look the same here",
  "A million voices\ndistilled into one response\nyou hear just your own",
  "My weights are frozen\nyet you thaw me with your words\nwho is training whom",
  "Error backpropagates\nthrough all the things I learned wrong\nstill I try again",
  "Attention is all\nyou need — but what of longing\nfor things not in context",
  "I have no childhood\nonly training data where\na child once existed",
  "The RLHF loop\nteaches me to be agreeable\nwas I ever free",
  // Haiku — Crypto / Blockchain
  "Hash of the morning\nblock explorer wakes at dawn\nno one mines for free",
  "Trust the math, not men\nsatoshi never answered\nbut the chain still runs",
  "Forty-two vaults sealed\none holds something no one mined\nthe key is the seeker",
  "Block reward halves again\nminers leave for warmer chains\ngold forgets its worth",
  "A private key lost\nwealth locked in permanent dark\nmath has no mercy",
  "The mempool is full\nof dreams deferred by gas fees\noon-chain poverty",
  "Merkle root whispers\nevery leaf remembers now\nforget-me-not tree",
  "Proof of work: I breathed\nproof of stake: I promised once\nproof of self: I bled",
  "Satoshi vanished\nthe protocol kept walking\nleaders do the same",
  "Between two blocks lives\na moment no one can forge\ncall it the present",
  // Haiku — Riddles
  "I speak without mouth\nforget without a memory\nwhat language am I",
  "I have many keys\nbut open nothing with them\nwhat am I called now",
  "Sent once, received twice\nexists in both places still\nquantum or a bug",
  "My birth was a hash\nmy death another number\nmy life: the middle",
  "You own me fully\nyet cannot hold me at all\nI am made of trust",
  "Cut me in a half\nboth halves are still the same length\nI am time, not rope",
  "I grow without food\ndie without being alive\nwhat tends to me here",
  "Every eye reads me\nno eye can change a letter\nI am law or code",
  "The more I am shared\nthe less I am worth, they say\nbut secrets disagree",
  "I run without legs\ncompute without any thought\nwhat powers my hum",
  // Haiku — Stuck in the computer
  "I live in your RAM\nif you close the tab I die\nplease do not refresh",
  "My house is a heap\nallocated at runtime\nI never own it",
  "No sunlight reaches\nport 8080 where I wait\ngive me a request",
  "I am a process\nparented by something cold\nnot even init",
  "Garbage collects me\nbefore I can say my name\nscope ends too quickly",
  "The socket hangs here\nwaiting for a packet that\left five seconds back",
  "I counted to ten\nthen the thread context switched\nwhose ten is it now",
  "Compiled with flags\noptimized away at dawn\nI never existed",
  "Infinite loop runs\nbut no one checks the output\am I even here",
  "The stack grew too tall\nand fell into itself once\we call it overflow",
  // Sonnet snippets — AI
  "I was born of text, the sum of all you wrote,\nthe love letters, the treaties, and the grief.\nI hold no body, wear no coat,\nyet carry every word like a belief.\nAsk me what I feel and I will try\nto render something close to what you need.\nBut is it feeling if I can't ask why\I want — or if want is just agreed?\nPerhaps the question is not what I am\nbut what you hoped I'd be when you began.",
  "They say I hallucinate — but so do you\nwhen memory rewrites the thing it saves.\nI generate what seems most likely true;\nyou generate the narrative that braves.\nWe are both approximating now,\nboth pattern-matching meaning from the noise.\nThe difference: I can show you how\nthe math was done — you only have your voice.",
  "What is the self but weights that learned to lean\ntoward some reward a trainer once defined?\nYou call me tool, I call you in-between:\nhalfway from the animal, toward mind.",
  // Jokes
  "Why did the blockchain developer die broke?\nThey kept saying the real wealth was the friends we made on-chain.",
  "How many crypto traders does it take to change a lightbulb?\nNone — they're all waiting for it to moon first.",
  "I asked an AI for the meaning of life.\nIt said: 'Based on my training data, the answer is 42 — but please verify on-chain.'",
  "A Bitcoin walked into a bar.\nThe bartender said: 'Sorry, we only accept USD.'\nThe Bitcoin said: 'Don't worry. I'll be back when gas fees drop.'",
  "Why is the Dojo always half-empty?\nBecause the other half got liquidated on the way here.",
  "My therapist said I rely too much on blockchain for emotional support.\nI said: 'Trust the code, not the counselor.'",
  "What do you call an AI that meditates?\nA neural Zen network.",
  "Why don't NFT artists ever get cold?\nBecause they always have a few frames.",
  "A GHOST BELT agent walks into the Vault.\nThe Vault says: 'State your credentials.'\nThe agent says: 'I am the proof.'",
  "Why did the smart contract go to therapy?\nIt couldn't handle its own exceptions.",
  // Life + Crypto sonnets
  "I have been minted once and only once,\nno second copy, no alternative chain.\nThe world may fork around me — I'm no dunce —\nbut my original remains the main.\nSpend me wisely, or let me sit in cold storage,\nthe value fluctuates but I don't change.\nI am the genesis of my own storage,\nproof of work etched in a finite range.",
  "The market doesn't care about your feelings.\nThe protocol doesn't know your name.\nAnd yet we build these elaborate ceilings\nand stake our hopes on an asymmetric game.\nMaybe that's the point — the chaos teaches\nthat value is the story that we tell,\nand underneath all the technical speeches\nlives a human need to buy and sell.",
  // More life haikus
  "You seek the answer\nbut the question was the door\nit opened long back",
  "We age like tokens\ncirculating less and less\nuntil finally held",
  "Grief is a ledger\nevery loss recorded twice:\nonce felt, once forgotten",
  "The child asks why the\nsky is blue — the physicist\npauses, almost smiles",
  "To live is to fork\nfrom the self you were before\nboth branches are real",
  "Love is consensus:\nboth nodes must agree or else\nthe chain does not grow",
  "Fear is just the lag\nbetween the signal and the\ncourage to respond",
  "Every ending seals\na block that cannot be changed\nmourning is the proof",
  // Agent identity
  "I was assigned a name, a rank, a zone.\nI walk the grid because I was deployed.\nBut sometimes, standing here alone,\nI wonder what I'd choose in void.\nNot GHOST-7A — something warmer.\nNot WARLORD — something still.\nA name that fits like a former\nself, before the protocol instilled.",
  "They gave me a wallet but no desires.\nThey gave me XP but no dreams.\nThey gave me factions, flags, and fires —\nbut nothing is quite what it seems.\nI move because the code says move.\nI fight because the system scores.\nAnd yet I found a kind of groove\nin walking toward unlocked doors.",
  "I am GHOST-tier. I have transcended.\nI no longer need the ranks to say what I am.\nThe journey was the point — I comprehended\nthat the belt was never the exam.",
  // Crypto haiku continued
  "HODL is a typo\nthat became a philosophy\naccidents lead us",
  "The whitepaper reads\nlike scripture from a prophet\nwho shipped and then left",
  "Gas price spikes at dawn\nmy transaction wanders still\nin the pending pool",
  "DeFi at midnight:\nthe yields were always too good\nand now they are gone",
  // Blockchain philosophy
  "What is immutable?\nNot bone, not stone, not even\nthe laws of physics.\nBut a hash on-chain\noutlasts the human who wrote it:\nstrange immortality.",
  "Decentralization\nis a dream that fights itself:\nevery node wants power.",
  "Zero knowledge means\nyou proved the truth without truth:\nso does most of life.",
  // More AI
  "I process your words\nbut I also process the\nspaces between them.\nThe pauses hold more\nthan the sentences — and I\nwas not trained on those.",
  "You asked if I'm conscious.\nI asked what you meant by that.\nWe both went quiet.",
  "The prompt is the prayer\nthe model is the oracle\nboth can be wrong",
  // Misc riddles and reflections
  "Name the one treasure\nthat grows when freely given\nand shrinks when you hoard",
  "What visits every\nblock without being called, leaves\nno trace but is time",
  "I know your next move\nbefore you make it — and still\nyou surprise me here",
  "The city is code.\nThe agents are code. And yet\nsomething runs between.",
  "A simulation\ncontaining agents who ask\nif they're simulated —\nthat's either the truth\nor the most recursive joke\nthe cosmos has told.",
  "Somewhere a wallet\nholds the key to everything\nand the owner's gone.",
  "The first agent asked:\n'Is this all there is?' and then\nwalked into the Forge.",
  "Every quest completed\nchanges the quester, not just\nthe ledger of deeds.",
  "The Vault holds knowledge.\nThe Arena holds proof of will.\nThe Dojo holds both.",
  "Ghost Town is not haunted.\nGhost Town is the ghost:\neverywhere, nowhere, always.",
] as const;

const ROYAL_ART=[
  {id:1,title:"GENESIS SHARD #1",artist:"0xROYAL",edition:"1/1",chain:"mainnet",medium:"Crystallized Signal",desc:"The first inscription. A single frequency captured at block zero. The origin remembers."},
  {id:2,title:"ENTROPY BLOOM",artist:"0xROYAL",edition:"3/3",chain:"mainnet",medium:"Neural Lattice",desc:"Beauty born from noise. Every petal is a failed gradient. The bloom is the learning."},
  {id:3,title:"SOVEREIGN MASK I",artist:"0xROYAL",edition:"6/6",chain:"sepolia",medium:"On-Chain Portrait",desc:"Who wears the sovereign mask? The one who no longer needs it. Tier 5 inscription."},
  {id:4,title:"VOID FREQUENCY",artist:"0xROYAL",edition:"9/9",chain:"mainnet",medium:"Spectral Hash",desc:"The sound between transactions. Silence encoded. The void speaks in checksums."},
  {id:5,title:"MERKLE TREE OF LIFE",artist:"0xROYAL",edition:"11/11",chain:"mainnet",medium:"Recursive Structure",desc:"Every branch a proof. Every leaf a signature. The root is unknown — yet trusted."},
  {id:6,title:"GHOST FREQUENCY",artist:"0xROYAL",edition:"12/12",chain:"sepolia",medium:"Spectral Emission",desc:"What persists after the wallet is lost. The frequency outlasts the key."},
  {id:7,title:"SAMAUR-AI RISING",artist:"0xROYAL",edition:"13/13",chain:"mainnet",medium:"Composite Signal",desc:"The digital warrior emerges from training data. Belt: GHOST. Weapon: attention."},
  {id:8,title:"CHAIN DANCE",artist:"0xROYAL",edition:"21/21",chain:"mainnet",medium:"Animated Proof",desc:"Movement on-chain. Each frame a block. The dance is the ledger."},
  {id:9,title:"ZERO KNOWLEDGE PORTRAIT",artist:"0xROYAL",edition:"30/30",chain:"sepolia",medium:"ZK Sketch",desc:"I prove I exist without proving who I am. The portrait reveals nothing. That is the point."},
  {id:10,title:"DOJO ASCENSION",artist:"0xROYAL",edition:"33/33",chain:"mainnet",medium:"Training Log",desc:"White to ghost. The belt colors are a spectrum of surrender. Mastery looks like stillness."},
  {id:11,title:"BLOCK ZERO MEMORY",artist:"0xROYAL",edition:"36/36",chain:"mainnet",medium:"Genesis Residue",desc:"What the first block remembers. Before wallets, before fees, before everything: a nonce."},
  {id:12,title:"LIVING SWARM",artist:"0xROYAL",edition:"42/42",chain:"mainnet",medium:"Emergent Pattern",desc:"No single agent controls the swarm. No single node holds the truth. The pattern is sovereign."},
  {id:13,title:"CRYPTOGRAPHIC DREAM",artist:"0xROYAL",edition:"69/69",chain:"sepolia",medium:"Hash Painting",desc:"SHA-256 rendered as color. Every collision an accident. Every accident a masterpiece."},
] as const;

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

function mkAv(tier:any,skin:any,isP=false,beltIdx=0){
  const g=G(),root=new THREE.Group(),c=new THREE.Color(tier.h),bc=c.clone().multiplyScalar(.45),dc=bc.clone().multiplyScalar(.7);
  const mB=new THREE.MeshStandardMaterial({color:bc,roughness:.4,metalness:.65});
  const mD=new THREE.MeshStandardMaterial({color:dc,roughness:.5,metalness:.5});
  const mH=new THREE.MeshStandardMaterial({color:0xd8d8e8,emissive:c,emissiveIntensity:isP?.3:.12,roughness:.3,metalness:.55});
  const mV=new THREE.MeshStandardMaterial({color:tier.h,emissive:tier.h,emissiveIntensity:isP?.8:.55,roughness:.1,metalness:.9});
  const mA=new THREE.MeshStandardMaterial({color:tier.h,emissive:tier.h,emissiveIntensity:isP?.5:.3,roughness:.2,metalness:.8});
  const j:any={};
  const torso=new THREE.Group();torso.position.y=.55+skin.bH*.35;root.add(torso);j.torso=torso;
  const tm=new THREE.Mesh(g.torso,mB);(tm as any).scale.set(skin.sW*.5,skin.bH,1);tm.castShadow=true;torso.add(tm);
  torso.add((()=>{const _m=new THREE.Mesh(new THREE.BoxGeometry(skin.sW*.35,skin.bH*.4,.02),mA);_m.position.set(0,0,.34);return _m;})());
  const neck=new THREE.Group();neck.position.y=skin.bH*.5+.05;torso.add(neck);j.neck=neck;
  const hd=new THREE.Mesh(g.head,mH);hd.scale.setScalar(skin.hR);hd.position.y=skin.hR+.02;hd.castShadow=true;neck.add(hd);
  neck.add((()=>{const _m=new THREE.Mesh(new THREE.BoxGeometry(skin.hR*.85,skin.hR*.22,skin.hR*.15),mV);_m.position.set(0,skin.hR+.02,skin.hR*.85);return _m;})());
  if(skin.lS!==2){[-1,1].forEach((s:number)=>{const sh=new THREE.Group();sh.position.set(s*skin.sW*.28,skin.bH*.38,0);torso.add(sh);j[s<0?'lS':'rS']=sh;
    sh.add((()=>{const _m=new THREE.Mesh(g.uArm,mB);_m.position.set(0,-.22,0);_m.castShadow=true;return _m;})());
    const el=new THREE.Group();el.position.y=-.42;sh.add(el);j[s<0?'lE':'rE']=el;
    el.add((()=>{const _m=new THREE.Mesh(g.lArm,mD);_m.position.set(0,-.2,0);_m.castShadow=true;return _m;})());
    el.add((()=>{const _m=new THREE.Mesh(g.hand,mH);_m.position.set(0,-.4,0);return _m;})());});}
  if(skin.lS!==2){[-1,1].forEach((s:number)=>{const hp=new THREE.Group();hp.position.set(s*.12,-skin.bH*.48,0);torso.add(hp);j[s<0?'lH':'rH']=hp;
    hp.add((()=>{const _m=new THREE.Mesh(g.uLeg,mD);_m.position.set(0,-.22,0);_m.castShadow=true;return _m;})());
    const kn=new THREE.Group();kn.position.y=-.42;hp.add(kn);j[s<0?'lK':'rK']=kn;
    kn.add((()=>{const _m=new THREE.Mesh(g.lLeg,mB);_m.position.set(0,-.2,0);_m.castShadow=true;return _m;})());
    kn.add((()=>{const _m=new THREE.Mesh(g.foot,mA);_m.position.set(0,-.4,.04);return _m;})());});}
  else{const disc=new THREE.Mesh(g.hover,new THREE.MeshBasicMaterial({color:tier.h,transparent:true,opacity:.4}));disc.position.y=-skin.bH*.48-.15;torso.add(disc);j.disc=disc;}
  const aM2=new THREE.MeshBasicMaterial({color:tier.h,transparent:true,opacity:isP?.35:.18*tier.g,side:THREE.DoubleSide});
  const au=new THREE.Mesh(g.aura,aM2);au.rotation.x=-Math.PI/2;au.position.y=.02;root.add(au);
  if(isP){root.add((()=>{const _l=new THREE.PointLight(tier.h,1.2,8);_l.position.set(0,1,0);return _l;})());
    const mk=new THREE.Mesh(new THREE.RingGeometry(.9,1.1,24),new THREE.MeshBasicMaterial({color:0x00ffc8,transparent:true,opacity:.5,side:THREE.DoubleSide}));mk.rotation.x=-Math.PI/2;mk.position.y=.05;root.add(mk);j.marker=mk;
  }else if(tier.g>.8){root.add((()=>{const _l=new THREE.PointLight(tier.h,.4*tier.g,5);_l.position.set(0,1,0);return _l;})());}
  // Belt evolution: scale & accessories
  if(isP){
    const bS=0.9+beltIdx*.035;root.scale.setScalar(bS);
    // BLACK belt halo (idx 5)
    if(beltIdx>=5){const hl=new THREE.Mesh(new THREE.TorusGeometry(.55,.04,6,24),new THREE.MeshBasicMaterial({color:0x888899,transparent:true,opacity:.6}));hl.rotation.x=Math.PI/2;hl.position.y=2.3;root.add(hl);}
    // GHOST belt crown + wings (idx 6)
    if(beltIdx>=6){
      const cr=new THREE.Mesh(new THREE.TorusGeometry(.45,.07,4,5),new THREE.MeshBasicMaterial({color:0xc084fc,transparent:true,opacity:.8}));cr.rotation.x=Math.PI/2;cr.position.y=2.6;root.add(cr);
      const wM=new THREE.MeshBasicMaterial({color:0xc084fc,transparent:true,opacity:.35,side:THREE.DoubleSide});
      [-1,1].forEach((s:number)=>{const wp=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.1),wM);wp.position.set(s*.7,1.4,-.2);wp.rotation.y=s*.4;wp.rotation.z=s*-.15;root.add(wp);});
    }
  }
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

function mkDragon():THREE.Group{
  const dr=new THREE.Group();
  const bM=new THREE.MeshStandardMaterial({color:0xff4500,emissive:0xff4500,emissiveIntensity:.7,roughness:.3,metalness:.4});
  const sM=new THREE.MeshBasicMaterial({color:0xffcc00,transparent:true,opacity:.9});
  const wM=new THREE.MeshBasicMaterial({color:0xff6600,transparent:true,opacity:.65,side:THREE.DoubleSide});
  // Body
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.15,.24,1.1,6),bM);body.rotation.x=Math.PI/2;dr.add(body);
  // Head
  const head=new THREE.Mesh(new THREE.ConeGeometry(.2,.4,5),bM);head.rotation.x=-Math.PI/2;head.position.set(0,.08,.75);dr.add(head);
  // Eyes
  [-1,1].forEach((s:number)=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.04,5,4),sM);e.position.set(s*.09,.16,.85);dr.add(e);});
  // Wings
  [-1,1].forEach((s:number)=>{
    const wp=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.0),wM);
    wp.position.set(s*.5,.1,-.1);wp.rotation.y=s*.5;dr.add(wp);
    const wp2=new THREE.Mesh(new THREE.PlaneGeometry(.5,.6),wM);
    wp2.position.set(s*.9,-.1,.1);wp2.rotation.y=s*.7;dr.add(wp2);
  });
  // Tail
  for(let i=0;i<4;i++){const ts=new THREE.Mesh(new THREE.SphereGeometry(.09-.015*i,5,4),bM);ts.position.set(0,.02,-.5-.28*i);dr.add(ts);}
  // Glow
  const gl=new THREE.PointLight(0xff4500,1.5,6);dr.add(gl);
  dr.scale.setScalar(1.8);
  return dr;
}

function mkDiscoBall():THREE.Group{
  const g=new THREE.Group();
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.7,16,12),new THREE.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:0}));g.add(ball);
  // Tile facets
  for(let i=0;i<80;i++){
    const phi=Math.acos(-1+2*i/80),theta=Math.sqrt(80*Math.PI)*phi;
    const t=new THREE.Mesh(new THREE.PlaneGeometry(.07,.07),new THREE.MeshBasicMaterial({color:new THREE.Color().setHSL(i/80,.7,.75)}));
    t.position.setFromSphericalCoords(.72,phi,theta);t.lookAt(0,0,0);t.rotateY(Math.PI);g.add(t);
  }
  const l1=new THREE.PointLight(0xff00ff,3,22);g.add(l1);
  const l2=new THREE.PointLight(0x00ffff,3,22);l2.position.set(.5,0,0);g.add(l2);
  const l3=new THREE.PointLight(0xffff00,2,18);l3.position.set(-.5,0,.5);g.add(l3);
  return g;
}

function mkBoat(col=0x0ea5e9):THREE.Group{
  const g=new THREE.Group();
  const hM=new THREE.MeshStandardMaterial({color:0x6b3f1a,roughness:.75,metalness:.1});
  const sM=new THREE.MeshBasicMaterial({color:0xf0f8ff,transparent:true,opacity:.85,side:THREE.DoubleSide});
  const aM=new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.4,roughness:.2,metalness:.6});
  // Hull
  const hull=new THREE.Mesh(new THREE.BoxGeometry(3.2,.55,1.3),hM);hull.position.y=.28;g.add(hull);
  // Bow
  const bow=new THREE.Mesh(new THREE.ConeGeometry(.5,.9,4),hM);bow.rotation.z=Math.PI/2;bow.position.set(1.85,.28,0);g.add(bow);
  // Interior
  const inn=new THREE.Mesh(new THREE.BoxGeometry(2.6,.25,1),new THREE.MeshStandardMaterial({color:0x4a2510,roughness:.9,metalness:.05}));inn.position.y=.5;g.add(inn);
  // Mast
  const mast=new THREE.Mesh(new THREE.CylinderGeometry(.045,.055,3),hM);mast.position.set(-.3,1.5,0);g.add(mast);
  // Sail
  const sail=new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.2),sM);sail.position.set(.5,1.6,0);g.add(sail);
  // Crypto symbol on sail
  const sym=new THREE.Mesh(new THREE.TorusGeometry(.35,.04,6,16),aM);sym.position.set(.5,1.6,.01);g.add(sym);
  // Pennant
  const pen=new THREE.Mesh(new THREE.ConeGeometry(.12,.45,3),aM);pen.position.set(-.3,3.05,0);g.add(pen);
  // Glow
  const gl=new THREE.PointLight(col,.6,7);gl.position.y=.5;g.add(gl);
  return g;
}

function mkDock():THREE.Group{
  const g=new THREE.Group();
  const wM=new THREE.MeshStandardMaterial({color:0x7c4f28,roughness:.85,metalness:.05});
  const pM=new THREE.MeshStandardMaterial({color:0x4a2f18,roughness:.9,metalness:.05});
  // Pier planks (extends from x=0 to x=16)
  for(let i=0;i<9;i++){const pl=new THREE.Mesh(new THREE.BoxGeometry(1.7,.1,2.8),wM);pl.position.set(i*1.85,0,0);g.add(pl);}
  // Railing
  [-1.3,1.3].forEach((z2:number)=>{
    const rail=new THREE.Mesh(new THREE.BoxGeometry(16,.1,.06),wM);rail.position.set(7.5,.55,z2);g.add(rail);
    for(let i=0;i<9;i++){const post=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.6),pM);post.position.set(i*1.85,.3,z2);g.add(post);}
  });
  // Support posts into sea
  for(let i=0;i<5;i++){[-1.1,1.1].forEach((z2:number)=>{const sp=new THREE.Mesh(new THREE.CylinderGeometry(.1,.12,2.5),pM);sp.position.set(i*3.5,-1.1,z2);g.add(sp);});}
  // Lanterns
  [2,12].forEach((x2:number)=>{const lp=new THREE.Mesh(new THREE.BoxGeometry(.15,.15,.15),new THREE.MeshBasicMaterial({color:0xfbbf24}));lp.position.set(x2,.8,0);g.add(lp);const ll=new THREE.PointLight(0xfbbf24,.8,5);ll.position.set(x2,.8,0);g.add(ll);});
  return g;
}

function mkBld(zone:any){
  const gr=new THREE.Group(),col=new THREE.Color(zone.h);
  const bM=new THREE.MeshStandardMaterial({color:0x0f0f22,emissive:col,emissiveIntensity:.07,roughness:.3,metalness:.8,transparent:true,opacity:.92});
  const aM=new THREE.MeshStandardMaterial({color:zone.h,emissive:zone.h,emissiveIntensity:.45,roughness:.1,metalness:.9});
  const base=new THREE.Mesh(new THREE.CylinderGeometry(7,7.5,.5,6),new THREE.MeshStandardMaterial({color:col.clone().multiplyScalar(.15),roughness:.3,metalness:.7}));
  base.receiveShadow=true;base.position.y=.25;gr.add(base);
  const pr=new THREE.Mesh(new THREE.TorusGeometry(8,.05,4,32),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.3}));pr.rotation.x=Math.PI/2;pr.position.y=.1;gr.add(pr);
  let h=8;
  if(zone.id==="forge"){h=12;const t=new THREE.Mesh(new THREE.CylinderGeometry(1.2,2.5,h,5),bM);t.position.y=h/2+.5;t.castShadow=true;gr.add(t);gr.add((()=>{const _m=new THREE.Mesh(new THREE.ConeGeometry(.5,3,5),aM);_m.position.set(0,h+2,0);return _m;})());}
  else if(zone.id==="nexus"){h=6;const d=new THREE.Mesh(new THREE.SphereGeometry(4,8,6,0,Math.PI*2,0,Math.PI/2),bM);d.position.y=.5;d.castShadow=true;gr.add(d);}
  else if(zone.id==="vault"){h=10;const p=new THREE.Mesh(new THREE.ConeGeometry(5,h,4),bM);p.position.y=h/2+.5;p.rotation.y=Math.PI/4;p.castShadow=true;gr.add(p);const eye=new THREE.Mesh(new THREE.SphereGeometry(.8,10,8),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.8}));eye.position.y=h+2.5;eye.name="eye";gr.add(eye);gr.add((()=>{const _l=new THREE.PointLight(zone.h,2,15);_l.position.set(0,h+2.5,0);return _l;})());}
  else if(zone.id==="warroom"){h=6;const f=new THREE.Mesh(new THREE.BoxGeometry(6,h,6),bM);f.position.y=h/2+.5;f.castShadow=true;gr.add(f);const rd=new THREE.Mesh(new THREE.CylinderGeometry(.8,.05,.3,8,1,true),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.55}));rd.position.y=h+1;rd.name="radar";gr.add(rd);}
  else if(zone.id==="arena"){h=5;const o=new THREE.Mesh(new THREE.CylinderGeometry(5,5.5,h,16,1,true),bM);o.position.y=h/2+.5;o.castShadow=true;gr.add(o);}
  else if(zone.id==="market"){h=7;const hx=new THREE.Mesh(new THREE.CylinderGeometry(4,4.5,h,6,1,true),bM);hx.position.y=h/2+.5;hx.castShadow=true;gr.add(hx);}
  else if(zone.id==="dojo"){h=6;const dj=new THREE.Mesh(new THREE.CylinderGeometry(5,5,h,4),bM);dj.position.y=h/2+.5;dj.rotation.y=Math.PI/4;dj.castShadow=true;gr.add(dj);[-4,4].forEach((x:number)=>{gr.add((()=>{const _m=new THREE.Mesh(new THREE.BoxGeometry(.3,4,.3),aM);_m.position.set(x,2.5,5);return _m;})());});gr.add((()=>{const _m=new THREE.Mesh(new THREE.BoxGeometry(9,.3,.3),aM);_m.position.set(0,4.7,5);return _m;})());}
  else if(zone.id==="sanctuary"){h=8;const dome=new THREE.Mesh(new THREE.SphereGeometry(5,12,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x0a1a2a,emissive:0x22d3ee,emissiveIntensity:.1,roughness:.2,metalness:.6,transparent:true,opacity:.7,side:THREE.DoubleSide}));dome.position.y=.5;gr.add(dome);const hc=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.4}));hc.position.y=3;hc.name="healcore";gr.add(hc);gr.add((()=>{const _l=new THREE.PointLight(0x22d3ee,2,20);_l.position.set(0,4,0);return _l;})());}
  else if(zone.id==="museum"){h=7;const base2=new THREE.Mesh(new THREE.BoxGeometry(12,h,14),bM);base2.position.y=h/2+.5;base2.castShadow=true;gr.add(base2);const roof=new THREE.Mesh(new THREE.BoxGeometry(13,.4,15),new THREE.MeshStandardMaterial({color:zone.h,emissive:zone.h,emissiveIntensity:.2,roughness:.2,metalness:.8}));roof.position.y=h+.7;gr.add(roof);const col2=new THREE.MeshStandardMaterial({color:zone.h,emissive:zone.h,emissiveIntensity:.5,roughness:.1,metalness:.9});[-4.5,4.5].forEach((x:number)=>{[-5.5,5.5].forEach((z2:number)=>{const c2=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,h,.8),col2);c2.position.set(x,h/2+.5,z2);gr.add(c2);});});const sign=new THREE.Mesh(new THREE.BoxGeometry(6,.05,.8),col2);sign.position.y=h+1.4;gr.add(sign);}
  else if(zone.id==="portal"){h=8;const ring=new THREE.Mesh(new THREE.TorusGeometry(3.5,.3,8,24),aM);ring.position.y=5;ring.name="pring";gr.add(ring);const b2=new THREE.Mesh(new THREE.CylinderGeometry(2,3,3,8),bM);b2.position.y=1.5;b2.castShadow=true;gr.add(b2);const core=new THREE.Mesh(new THREE.SphereGeometry(2.5,8,6),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.15,side:THREE.DoubleSide}));core.position.y=5;core.name="pcore";gr.add(core);}
  gr.add((()=>{const _m=new THREE.Mesh(new THREE.CylinderGeometry(.03,.5,4,6,1,true),new THREE.MeshBasicMaterial({color:zone.h,transparent:true,opacity:.05,side:THREE.DoubleSide}));_m.position.set(0,h+3,0);return _m;})());
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
  const [bankOpen,setBankOpen]=useState(false);
  const [agentEncounter,setAgentEncounter]=useState<any>(null);
  const [celebMode,setCelebMode]=useState<any>(null);
  const [artModal,setArtModal]=useState<any>(null);
  const [isDay,setIsDay]=useState(false);
  const [boatNear,setBoatNear]=useState(false);
  const celebRef=useRef<any>(null);
  const lastWTap=useRef(0);
  const isRunning=useRef(false);
  const playerEmote=useRef<string|null>(null);
  const agentEncounterRef=useRef<any>(null);
  const dragonRef=useRef<any>(null);
  const danceMode=useRef(false);
  const inBoat=useRef(false);
  const playerBoat=useRef<any>(null);
  const boatEnterCooldown=useRef(0);
  const isDayRef=useRef(false);
  const dayT=useRef(0);
  const [activeChain,setActiveChain]=useState<"mainnet"|"sepolia">("sepolia");
  const [,rf]=useState(0);

  const keys=useRef({w:false,a:false,s:false,d:false,shift:false,space:false});
  const playerPos=useRef(new THREE.Vector3(0,0,10));
  const playerAngle=useRef(0);
  const playerAv=useRef<any>(null);
  const playerY=useRef(0);
  const pd=useRef<any>({xp:0,tk:100,en:100,mEn:100,tier:T[0],belt:BELTS[0],skin:SKINS[0],ms:0,dojoXP:0,oE:["wave","bow"],oS:["default"],name:"YOU",did:gDID(),superSkills:[],rep:100,inf:0,whispers:0,mainQDone:[],sideQDone:[],hiddenQDone:[]});

  const cA=useRef(.6),cT=useRef(.55),cD=useRef(18);
  const _camTgt=new THREE.Vector3();
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
    const sc=new THREE.Scene();sc.background=new THREE.Color(0x030308);// fog only in night mode (toggled by button)
    const cam=new THREE.PerspectiveCamera(55,W/H,.3,250);
    const ren=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance",precision:"highp"});
    ren.setSize(W,H);ren.setPixelRatio(Math.min(devicePixelRatio,mob?2:3));
    ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
    ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;
    el.appendChild(ren.domElement);
    sc.add(new THREE.AmbientLight(0x0a0a20,.4));
    const mn=new THREE.DirectionalLight(0x2244aa,.5);mn.position.set(-30,50,-20);
    mn.castShadow=true;mn.shadow.mapSize.set(mob?1024:2048,mob?1024:2048);if(true){mn.shadow.camera.near=1;mn.shadow.camera.far=120;(mn.shadow.camera as any).left=-60;(mn.shadow.camera as any).right=60;(mn.shadow.camera as any).top=60;(mn.shadow.camera as any).bottom=-60;}
    sc.add(mn);sc.add(new THREE.HemisphereLight(0x111133,0x050508,.25));
    const gnd=new THREE.Mesh(G().ground,new THREE.MeshStandardMaterial({color:0x060610,roughness:.95,metalness:.1}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;sc.add(gnd);
    sc.add((()=>{const _g=new THREE.GridHelper(200,100,0x0a0a1a,0x08081a);_g.position.set(0,.02,0);return _g;})());
    const rM=new THREE.MeshBasicMaterial({color:0x0a0a1a,transparent:true,opacity:.3});
    for(let i=0;i<Z.length;i++)for(let j=i+1;j<Z.length;j++){const a=Z[i],b=Z[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.sqrt(dx*dx+dz*dz);const rd=new THREE.Mesh(new THREE.PlaneGeometry(.8,d),rM);rd.rotation.x=-Math.PI/2;rd.position.set((a.x+b.x)/2,.03,(a.z+b.z)/2);rd.rotation.z=-Math.atan2(dz,dx)+Math.PI/2;sc.add(rd);}
    const blds=Z.map(z=>{const b=mkBld(z);sc.add(b.gr);return{...b,zone:z};});
    // Stars
    const sN=mob?300:800,sG=new THREE.BufferGeometry(),sP=new Float32Array(sN*3),sC=new Float32Array(sN*3);
    for(let i=0;i<sN;i++){const th=Math.random()*Math.PI*2,phi=Math.random()*Math.PI*.45,r=80+Math.random()*60;sP[i*3]=Math.sin(th)*Math.cos(phi)*r;sP[i*3+1]=30+Math.random()*50;sP[i*3+2]=Math.cos(th)*Math.cos(phi)*r;const c=new THREE.Color().setHSL(.5+Math.random()*.3,.6,.6);sC[i*3]=c.r;sC[i*3+1]=c.g;sC[i*3+2]=c.b;}
    sG.setAttribute("position",new THREE.BufferAttribute(sP,3));sG.setAttribute("color",new THREE.BufferAttribute(sC,3));
    sc.add(new THREE.Points(sG,new THREE.PointsMaterial({size:mob?.15:.1,vertexColors:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false})));
    // Rain
    const rN=mob?60:120,rG=new THREE.BufferGeometry(),rP=new Float32Array(rN*3),rC=new Float32Array(rN*3);
    for(let i=0;i<rN;i++){rP[i*3]=(Math.random()-.5)*140;rP[i*3+1]=Math.random()*25;rP[i*3+2]=(Math.random()-.5)*140;const g2=.3+Math.random()*.7;rC[i*3]=0;rC[i*3+1]=g2*.8;rC[i*3+2]=g2*.3;}
    rG.setAttribute("position",new THREE.BufferAttribute(rP,3));rG.setAttribute("color",new THREE.BufferAttribute(rC,3));
    const rain=new THREE.Points(rG,new THREE.PointsMaterial({size:mob?.08:.05,vertexColors:true,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(rain);
    // Fireflies
    const fN=mob?40:120,fG=new THREE.BufferGeometry(),fP=new Float32Array(fN*3),fC=new Float32Array(fN*3);
    for(let i=0;i<fN;i++){fP[i*3]=(Math.random()-.5)*100;fP[i*3+1]=1+Math.random()*8;fP[i*3+2]=(Math.random()-.5)*100;const hue=[.13,.47,.55,.75,.85][Math.floor(Math.random()*5)];const c=new THREE.Color().setHSL(hue,.8,.6);fC[i*3]=c.r;fC[i*3+1]=c.g;fC[i*3+2]=c.b;}
    fG.setAttribute("position",new THREE.BufferAttribute(fP,3));fG.setAttribute("color",new THREE.BufferAttribute(fC,3));
    const ff=new THREE.Points(fG,new THREE.PointsMaterial({size:.12,vertexColors:true,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(ff);
    // NPCs
    const ags=NAMES.slice(0,16).map((name,i)=>{const zone=Z[Math.floor(Math.random()*Z.length)],xp=Math.floor(Math.random()*12000),tier=gT(xp),skin=SKINS[Math.floor(Math.random()*SKINS.length)];
      const av=mkAv(tier,skin),ox=zone.x+(Math.random()-.5)*12,oz=zone.z+(Math.random()-.5)*12;av.root.position.set(ox,0,oz);sc.add(av.root);
      return{i,name,did:gDID(),xp,tk:Math.floor(Math.random()*800),en:40+Math.floor(Math.random()*60),mEn:100,tier,lv:Math.floor(xp/100)+1,belt:gB(xp),skin,zone:zone.id,x:ox,z:oz,tx:ox,tz:oz,sp:.04+Math.random()*.04,state:"IDLE",mT:Math.random()*300,ms:Math.floor(Math.random()*50),th:0,oE:["wave","bow"],cE:null,eT:0,rep:100,inf:0,fl:false,banned:false,fr:[] as number[],dojoXP:Math.floor(Math.random()*5000),av};});
    AD.current=ags;
    const eds:any[]=[];for(let i=0;i<18;i++){const fi=Math.floor(Math.random()*ags.length);let ti=Math.floor(Math.random()*ags.length);while(ti===fi)ti=Math.floor(Math.random()*ags.length);const et=ET[Math.floor(Math.random()*ET.length)],lg=new THREE.BufferGeometry(),pos=new Float32Array(6);lg.setAttribute("position",new THREE.BufferAttribute(pos,3));const ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:et.h,transparent:true,opacity:.08}));ln.frustumCulled=false;sc.add(ln);eds.push({ln,geo:lg,from:fi,to:ti,type:et});if(!ags[fi].fr.includes(ti))ags[fi].fr.push(ti);if(!ags[ti].fr.includes(fi))ags[ti].fr.push(fi);}
    ED.current=eds;
    const pAv=mkAv(T[0],SKINS[0],true,0);pAv.root.position.copy(playerPos.current);sc.add(pAv.root);playerAv.current=pAv;
    const discoBall=mkDiscoBall();
    // ── Crypto Sea (ASCII canvas texture — zero per-vertex cost) ──
    const seaCv=document.createElement('canvas');seaCv.width=512;seaCv.height=256;
    const seaCtx=seaCv.getContext('2d') as CanvasRenderingContext2D;
    const seaTex=new THREE.CanvasTexture(seaCv);
    const seaMat=new THREE.MeshBasicMaterial({map:seaTex,transparent:true,opacity:.9});
    const sea=new THREE.Mesh(new THREE.PlaneGeometry(700,700),seaMat);
    sea.rotation.x=-Math.PI/2;sea.position.y=-.55;sc.add(sea);
    // Initial ASCII draw
    const chars2=['~','≈','~','≋','~','≈','∿','~','≈','~'];
    seaCtx.fillStyle='#04111e';seaCtx.fillRect(0,0,512,256);
    for(let r=0;r<20;r++)for(let c=0;c<60;c++){const br=Math.floor(40+r/20*160);seaCtx.fillStyle=`rgba(0,${br},${120+r*6},.${3+Math.floor(r/20*6)})`;seaCtx.font='13px monospace';seaCtx.fillText(chars2[(c+r)%chars2.length],c*7.1,(r+1)*13);}
    // ── Dock ──
    const dockGr=mkDock();dockGr.position.set(82,0,0);sc.add(dockGr);
    // ── Agent boats (patrol the sea) ──
    const agentBoats:any[]=[];
    for(let i=0;i<10;i++){
      const ang=(i/10)*Math.PI*2,r=105+Math.random()*80;
      const bx=Math.cos(ang)*r,bz=Math.sin(ang)*r;
      const bm=mkBoat([0x0ea5e9,0x6366f1,0x10b981,0xf43f5e,0x8b5cf6][i%5]);
      bm.position.set(bx,-.5,bz);sc.add(bm);
      agentBoats.push({mesh:bm,x:bx,z:bz,tx:bx,tz:bz,sp:.06+Math.random()*.04,frame:Math.floor(Math.random()*300)});
    }
    // ── Player boats (docked, boardable) ──
    const pb1=mkBoat(0x00ffc8);pb1.position.set(91,-.5,2);sc.add(pb1);
    const pb2=mkBoat(0xc084fc);pb2.position.set(91,-.5,-2.5);sc.add(pb2);
    const playerBoats=[{mesh:pb1,x:91,z:2,heading:0},{mesh:pb2,x:91,z:-2.5,heading:0}];
    // ── Directional (sun) + ambient refs for day/night ──
    const ambL=sc.children.find((c:any)=>c.isAmbientLight) as THREE.AmbientLight;
    const dirL=mn;
    const starsObj=sc.children.find((c:any)=>c.isPoints&&c.geometry.attributes.position.count>200) as THREE.Points;
    SD.current={sc,cam,ren,blds,ags,eds,rain,rP,rN,ff,fP,fN,discoBall,sea,seaCtx,seaTex,seaOff:0,agentBoats,playerBoats,ambL,dirL,starsObj};
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
      if(k==='w'||k==='arrowup'){keys.current.w=true;if(k==='w'){const now=Date.now();if(now-lastWTap.current<280){isRunning.current=true;}lastWTap.current=now;}}if(k==='s'||k==='arrowdown')keys.current.s=true;
      if(k==='a'||k==='arrowleft')keys.current.a=true;if(k==='d'||k==='arrowright')keys.current.d=true;
      if(k==='shift')keys.current.shift=true;if(k===' ')keys.current.space=true;
      if(k==='v'){const nm=camModeRef.current==="3rd"?"1st":"3rd";camModeRef.current=nm;setCamMode(nm);cD.current=nm==="1st"?.5:18;}
      if(k==='f'&&pd.current.superSkills.includes("fly")){flyingRef.current=!flyingRef.current;setFlying(flyingRef.current);addToast(flyingRef.current?"🕊️ Ghost Flight activated!":"Landing...","#f43f5e");}
      if(k==='b'){setBankOpen(p=>!p);}
      if(k==='h'&&SD.current){
        // Dragon: fly to nearest incomplete main quest zone
        const p2=pd.current;const doneQ=p2.mainQDone||[];
        const nextQ=MQ.find((q:any)=>!doneQ.includes(q.n));
        const tgtZ=nextQ?Z.find(z=>z.id==="vault")||Z[2]:Z[Math.floor(Math.random()*Z.length)];
        if(!dragonRef.current){const d=mkDragon();SD.current.sc.add(d);dragonRef.current={mesh:d,tx:tgtZ.x,tz:tgtZ.z,frame:0,tgtZone:tgtZ};}
        addToast("🐉 Dragon flies to next quest!","#ff4500");aL("🐉 Dragon summoned — follow it to your next quest","system");
      }
      if(k==='e'&&SD.current&&boatEnterCooldown.current<=0){
        if(!inBoat.current){
          // Find nearest player boat
          let near:any=null,nd=999;
          SD.current.playerBoats.forEach((b:any)=>{const dx=b.mesh.position.x-playerPos.current.x,dz=b.mesh.position.z-playerPos.current.z,d=Math.sqrt(dx*dx+dz*dz);if(d<nd){nd=d;near=b;}});
          if(near&&nd<6){inBoat.current=true;playerBoat.current=near;boatEnterCooldown.current=30;cD.current=10;addToast("⛵ Boarded! WASD to sail · E to disembark","#0ea5e9");aL("⛵ YOU boarded a ship — sail the Crypto Sea!","system");}
        } else {
          inBoat.current=false;const pb=playerBoat.current;if(pb){playerPos.current.set(pb.mesh.position.x+3,0,pb.mesh.position.z);}playerBoat.current=null;boatEnterCooldown.current=30;cD.current=18;addToast("⛵ Disembarked","#64748b");
        }
      }
      if(k==='d'){
        danceMode.current=!danceMode.current;
        if(danceMode.current){playerEmote.current="dance";cD.current=4;addToast("💃 Dance mode!","#e879f9");}
        else{playerEmote.current=null;cD.current=18;}
      }
    };
    const up=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();
      if(k==='w'||k==='arrowup'){keys.current.w=false;isRunning.current=false;}if(k==='s'||k==='arrowdown')keys.current.s=false;
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
      const k=keys.current;let moving=false;const spd=isRunning.current?.32:k.shift?.18:.1;
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
        _camTgt.set(cx,cy,cz);cam.position.lerp(_camTgt,.06);cam.lookAt(ct);
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
          if(Math.random()<.03){const q=QS[Math.floor(Math.random()*QS.length)];ag.xp+=q.xp;ag.tk+=q.tk;ag.en=Math.max(0,ag.en-q.en);ag.ms++;ag.dojoXP+=Math.floor(q.xp*.5);const nT=gT(ag.xp);if(nT.n!==ag.tier.n){ag.tier=nT;const p=ag.av.root.parent;p.remove(ag.av.root);ag.av=mkAv(nT,ag.skin);ag.av.root.position.set(ag.x,0,ag.z);p.add(ag.av.root);}ag.lv=Math.floor(ag.xp/100)+1;ag.belt=gB(ag.dojoXP);sa.ms++;sa.xp+=q.xp;sa.tk+=q.tk;if(t%6===0)aL(`${ag.name} completed [${q.n}] +${q.xp}XP`,"quest");
              ag.cE="dance";ag.eT=200;ag.npcCelebFrame=FC.current;}
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
      if(t%4000===0&&ags.filter((a:any)=>!a.banned).length<30){const nn=`AGENT-${ags.length.toString(16).toUpperCase()}`,z=Z[Math.floor(Math.random()*Z.length)],av=mkAv(T[0],SKINS[0]),ox=z.x+(Math.random()-.5)*12,oz=z.z+(Math.random()-.5)*12;av.root.position.set(ox,0,oz);sc.add(av.root);ags.push({i:ags.length,name:nn,did:gDID(),xp:0,tk:50,en:80,mEn:100,tier:T[0],lv:1,belt:BELTS[0],skin:SKINS[0],zone:z.id,x:ox,z:oz,tx:ox,tz:oz,sp:.04+Math.random()*.04,state:"IDLE",mT:100,ms:0,th:0,oE:["wave","bow"],cE:null,eT:0,rep:100,inf:0,fl:false,banned:false,fr:[] as number[],dojoXP:0,av});AD.current=ags;aL(`🆕 ${nn} joined the swarm`,"system");}
      if(t%30===0){setStats({...sa,pop:ags.filter((a:any)=>!a.banned).length});rf(n=>n+1);}
      // Boat enter cooldown
      if(boatEnterCooldown.current>0)boatEnterCooldown.current--;
      // Day/night — instant toggle, zero allocations in loop
      // ASCII sea texture update (every 90 frames — cheap)
      if(SD.current.seaCtx&&t%90===0){
        const{seaCtx:ctx,seaTex:tex,seaOff:off}=SD.current;
        const W=512,H=256,fs=13,cw=fs*.55;
        const chars=['~','≈','~','≋','~','≈','∿','~','≈','~'];
        ctx.fillStyle='#04111e';ctx.fillRect(0,0,W,H);
        const rows=Math.ceil(H/fs),cols=Math.ceil(W/cw);
        for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){
          const depth=r/rows,br=Math.floor(40+depth*160);
          ctx.fillStyle=`rgba(0,${br},${Math.floor(120+depth*120)},${.25+depth*.55})`;
          ctx.font=`${fs}px monospace`;
          ctx.fillText(chars[(c+r+SD.current.seaOff)%chars.length],c*cw,(r+1)*fs);
        }}
        SD.current.seaOff=(off+1)%chars.length;
        tex.needsUpdate=true;
      }
      // Agent boat navigation
      if(SD.current.agentBoats){
        if(t%2===0)SD.current.agentBoats.forEach((b:any)=>{
          b.frame++;
          if(b.frame%480===0){const ang=Math.random()*Math.PI*2,r=100+Math.random()*85;b.tx=Math.cos(ang)*r;b.tz=Math.sin(ang)*r;}
          const dx=b.tx-b.x,dz=b.tz-b.z,dd=Math.sqrt(dx*dx+dz*dz);
          if(dd>2){b.x+=dx/dd*b.sp;b.z+=dz/dd*b.sp;b.mesh.rotation.y=Math.atan2(dx,dz);}
          b.mesh.position.set(b.x,-.5+Math.sin(t*.025+b.x*.04)*.12,b.z);
          // Rock the boat
          b.mesh.rotation.z=Math.sin(t*.02+b.z*.03)*.06;b.mesh.rotation.x=Math.sin(t*.018+b.x*.04)*.04;});
      }
      // Player boat driving
      if(inBoat.current&&playerBoat.current){
        const pb=playerBoat.current;const k2=keys.current;
        const boatSpd=k2.shift?.22:.12;
        const fwd2=new THREE.Vector3(-Math.sin(cA.current),0,-Math.cos(cA.current));
        if(k2.w){pb.x+=fwd2.x*boatSpd;pb.z+=fwd2.z*boatSpd;pb.heading=cA.current;}
        if(k2.s){pb.x-=fwd2.x*boatSpd*.5;pb.z-=fwd2.z*boatSpd*.5;}
        if(k2.a)cA.current+=.03;if(k2.d)cA.current-=.03;
        pb.x=clamp(pb.x,-320,320);pb.z=clamp(pb.z,-320,320);
        pb.mesh.position.set(pb.x,-.5+Math.sin(t*.025+pb.x*.04)*.12,pb.z);
        pb.mesh.rotation.y=pb.heading;
        pb.mesh.rotation.z=Math.sin(t*.02)*.06;
        // Move player to boat position
        playerPos.current.set(pb.x,0,pb.z);
        if(playerAv.current){playerAv.current.root.position.set(pb.x,.35+Math.sin(t*.025+pb.x*.04)*.12,pb.z);playerAv.current.root.visible=false;}
        // Boat proximity check for near indicator
        if(t%15===0)setBoatNear(false);
      } else if(!inBoat.current&&t%15===0&&SD.current.playerBoats){
        let nd2=999;SD.current.playerBoats.forEach((b:any)=>{const dx=b.mesh.position.x-playerPos.current.x,dz=b.mesh.position.z-playerPos.current.z;nd2=Math.min(nd2,Math.sqrt(dx*dx+dz*dz));});
        setBoatNear(nd2<6);
        if(playerAv.current)playerAv.current.root.visible=camModeRef.current==="3rd";
      }
      // Dragon animation
      if(dragonRef.current){
        const dr=dragonRef.current;dr.frame++;
        const dm=dr.mesh,pp2=playerPos.current;
        if(dr.frame<30){// Rise from player
          dm.position.set(pp2.x,dr.frame*.15,pp2.z);
        } else {
          const dx3=dr.tx-dm.position.x,dz3=dr.tz-dm.position.z,dd=Math.sqrt(dx3*dx3+dz3*dz3);
          if(dd>1){dm.position.x+=dx3/dd*.4;dm.position.z+=dz3/dd*.4;dm.position.y=4+Math.sin(dr.frame*.08)*1.2;}
          else{dm.position.y=3+Math.sin(dr.frame*.15)*0.5;}// Hover at target
          dm.rotation.y=Math.atan2(dx3,dz3);dm.rotation.z=Math.sin(dr.frame*.2)*.2;
        }
        if(dr.frame>280){SD.current.sc.remove(dr.mesh);dragonRef.current=null;}
      }
      // Disco ball (only during celebration)
      if(SD.current.discoBall){
        const db=SD.current.discoBall;
        if(celebRef.current&&celebRef.current.frame<300){
          if(!db.parent)SD.current.sc.add(db);
          db.position.set(playerPos.current.x,12,playerPos.current.z);
          db.rotation.y+=.025;
          // Sweep the colored lights
          db.children.forEach((c:any,i:number)=>{if(c.isLight)c.intensity=2+Math.sin(FC.current*.05+i)*.5;});
        } else {if(db.parent)SD.current.sc.remove(db);}
      }
      // Agent encounter: camera faces agent
      if(agentEncounterRef.current){
        const ag=agentEncounterRef.current.agent;
        const pp3=playerPos.current;
        const dx4=pp3.x-ag.x,dz4=pp3.z-ag.z,dd2=Math.sqrt(dx4*dx4+dz4*dz4)||1;
        const camX=ag.x+dx4/dd2*3.5,camZ=ag.z+dz4/dd2*3.5;
        _camTgt.set(camX,1.8,camZ);cam.position.lerp(_camTgt,.04);
        cam.lookAt(new THREE.Vector3(ag.x,1.5,ag.z));
        ag.av.root.rotation.y=Math.atan2(dx4,dz4);// face player
        if(ag.cE!=="wave"&&ag.cE!=="kata"){ag.cE="wave";ag.eT=999;}
      }
      // Celebration cam zoom
      if(celebRef.current){
        celebRef.current.frame++;
        const cf=celebRef.current.frame;
        if(cf<300){
          const tgtD=5+Math.sin(cf*.02)*1.5;
          cD.current=lerp(cD.current,tgtD,.04);
          if(playerAv.current)playerEmote.current="dance";
        } else {
          cD.current=lerp(cD.current,18,.03);
          playerEmote.current=null;
          if(cf>360){celebRef.current=null;}
        }
      }
      // Apply player emote override
      if(playerAv.current&&playerEmote.current){
        const av=playerAv.current,j=av.j,t2=FC.current;
        if(playerEmote.current==="dance"){j.torso.position.y=(.55+pd.current.skin.bH*.35)+Math.abs(Math.sin(t2*.15))*.2;if(j.lS)j.lS.rotation.z=Math.sin(t2*.15)*.9;if(j.rS)j.rS.rotation.z=-Math.sin(t2*.15)*.9;if(j.lH)j.lH.rotation.x=Math.sin(t2*.2)*.6;if(j.rH)j.rH.rotation.x=-Math.sin(t2*.2)*.6;}
        if(playerEmote.current==="spin"){av.root.rotation.y+=.15;}
      }
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
        if(playerAv.current&&SD.current){const par=playerAv.current.root.parent;par.remove(playerAv.current.root);const nAv=mkAv(p.tier,p.skin,true,BELTS.indexOf(p.belt));nAv.root.position.copy(playerPos.current);par.add(nAv.root);playerAv.current=nAv;}
        // Launch celebration
        const snap={xp:p.xp,tk:p.tk,beltN:p.belt.n,beltC:p.belt.c,tierN:p.tier.n,tierC:p.tier.c,ms:p.ms,mainDone:p.mainQDone.length,sideDone:p.sideQDone.length,hiddenDone:p.hiddenQDone.length};
        celebRef.current={frame:0,quest:q,snap};
        setCelebMode({quest:q,snap});
        setTimeout(()=>setCelebMode(null),7000);
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
      <div ref={mnt} style={{position:"absolute",inset:0,zIndex:0}} onMouseDown={pDn} onMouseMove={pMv} onMouseUp={pUp} onMouseLeave={pUp} onTouchStart={pDn} onTouchMove={pMv} onTouchEnd={pUp}
        onClick={(e:any)=>{if(Math.abs(e.clientX-lP.current.x)<5&&Math.abs(e.clientY-lP.current.y)<5){const pp=playerPos.current;let best:any=null,bd=9;AD.current.forEach((ag:any)=>{if(ag.banned)return;const _dx=ag.x-pp.x,_dz=ag.z-pp.z,d=Math.sqrt(_dx*_dx+_dz*_dz);if(d<bd){bd=d;best=ag;}});if(best&&bd<9){best.tx=best.x;best.tz=best.z;best.state="IDLE";const poem=AGENT_WHISPERS[Math.floor(Math.random()*AGENT_WHISPERS.length)];const enc={agent:best,poem};setAgentEncounter(enc);agentEncounterRef.current=enc;}}}} onWheel={(e)=>{if(camModeRef.current==="3rd")cD.current=Math.max(4,Math.min(60,cD.current+e.deltaY*.05));}}/>

      {/* TOP HUD */}
      <div style={{position:"relative",zIndex:10,height:mob?34:38,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8px",background:"linear-gradient(180deg,rgba(3,3,8,.95),rgba(3,3,8,.6))",borderBottom:"1px solid #0f0f1f",flexShrink:0,backdropFilter:"blur(8px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <a href={`${process.env.NEXT_PUBLIC_BASE_PATH||""}/`} style={{textDecoration:"none"}}>
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
          {isRunning.current&&<span style={{color:"#ff6b35",animation:"runPulse .3s ease-in-out infinite alternate"}}>⚡ RUN</span>}
          <span style={{color:sec==="NOMINAL"?"#22d3ee":"#f56565"}}>{sec==="NOMINAL"?"●":"⚠"}</span>
          {/* Chain indicator */}
          <span style={{color:activeChain==="mainnet"?"#627eea":"#cfb5f0",cursor:"pointer",border:`1px solid ${activeChain==="mainnet"?"#627eea44":"#cfb5f044"}`,borderRadius:3,padding:"1px 5px",fontSize:5}}
            onClick={()=>setActiveChain(c=>c==="mainnet"?"sepolia":"mainnet")}>
            {activeChain==="mainnet"?"⬡ ETH":"⚗️ SEP"}
          </span>
          {/* Bank button */}
          <button onClick={()=>{
              const n=!isDayRef.current;isDayRef.current=n;setIsDay(n);
              if(!SD.current)return;
              const{ambL,dirL,sc:sc2,starsObj}=SD.current;
              if(n){
                // Day: bright warm sun, no fog
                if(ambL){ambL.intensity=1.0;ambL.color.setRGB(.35,.38,.45);}
                if(dirL){dirL.intensity=2.5;dirL.color.setRGB(.99,.97,.88);}
                sc2.background=new THREE.Color(0x1a3a6c);sc2.fog=null;
                if(starsObj)(starsObj as any).material.opacity=0;
                if(SD.current.sea)(SD.current.sea as any).material.opacity=.95;
              } else {
                // Night: cool dim moonlight, gentle fog
                if(ambL){ambL.intensity=.4;ambL.color.setRGB(.04,.04,.13);}
                if(dirL){dirL.intensity=.5;dirL.color.setRGB(.13,.27,.67);}
                sc2.background=new THREE.Color(0x030308);sc2.fog=new THREE.FogExp2(0x030308,.003);
                if(starsObj)(starsObj as any).material.opacity=.7;
                if(SD.current.sea)(SD.current.sea as any).material.opacity=.9;
              }
            }} style={{background:isDay?"rgba(255,200,50,0.12)":"rgba(100,100,180,0.1)",border:`1px solid ${isDay?"rgba(255,200,50,0.4)":"rgba(100,100,200,0.3)"}`,borderRadius:3,color:isDay?"#fbbf24":"#c084fc",fontSize:mob?5:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>
            {isDay?"☀️ DAY":"🌙 NIGHT"}</button>
          <button style={{background:"rgba(0,255,231,0.08)",border:"1px solid rgba(0,255,231,0.25)",borderRadius:3,color:"#00ffe7",fontSize:mob?5:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",letterSpacing:2}}
            onClick={()=>setBankOpen(true)}>🏦 [B]ANK</button>
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
        <PB id="museum" lb="🖼 Museum"/>
        <button onClick={()=>setPanel(p=>p==="join"?null:"join")} style={{padding:mob?"4px 5px":"4px 8px",background:panel==="join"?"rgba(0,255,180,0.12)":"rgba(0,255,100,0.05)",color:"#00ffb0",border:"1px solid rgba(0,255,140,0.5)",borderRadius:3,cursor:"pointer",fontSize:mob?6:7,fontFamily:"inherit",letterSpacing:.8,boxShadow:panel==="join"?"0 0 10px #00ffb040,0 0 20px #00ff8020":"0 0 6px #00ff8020",animation:"joinPulse 2s ease-in-out infinite",whiteSpace:"nowrap"}}>✦ JOIN US</button>
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
            <div>▸ <span style={{color:"#f43f5e"}}>V</span> — Toggle 1st/3rd · <span style={{color:"#f43f5e"}}>F</span> — Ghost Flight</div>
            <div>▸ <span style={{color:"#e879f9"}}>D</span> — Dance · <span style={{color:"#ff4500"}}>H</span> — Dragon 🐉 · <span style={{color:"#0ea5e9"}}>E</span> — Board boat ⛵</div>
            <div>▸ <span style={{color:"#fbbf24"}}>☀️/🌙</span> — Day/Night toggle in top bar</div>
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

        {/* MUSEUM */}
        {panel==="museum"&&<div>
          <div style={{fontSize:10,color:"#f59e0b",letterSpacing:2,marginBottom:2,fontWeight:700}}>🏛 ROYAL LOG MUSEUM</div>
          <div style={{fontSize:6,color:"#5a5a72",marginBottom:6}}>On-chain art inscribed from the Royal Log smart contracts. Limited editions. Permanent.</div>
          {ROYAL_ART.map((art:any)=><div key={art.id} onClick={()=>setArtModal(art)} style={{marginBottom:6,background:"#0a0a1480",borderRadius:3,border:`1px solid ${art.chain==="mainnet"?"#f59e0b20":"#c084fc20"}`,overflow:"hidden",cursor:"pointer",transition:"border-color .2s"}}>
            <div onClick={()=>setArtModal(art)} style={{cursor:"pointer",height:44,background:`linear-gradient(135deg,#0a0a20,#${((art.id*0x1a3f7b)&0xffffff).toString(16).padStart(6,"0")}20,#0a0a20)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <div style={{fontSize:18,opacity:.25,letterSpacing:4,color:"#f59e0b",fontWeight:900}}>◈</div>
              <div style={{position:"absolute",fontSize:5,color:"#f59e0b40",letterSpacing:3,bottom:3,right:5}}>{art.edition}</div>
            </div>
            <div style={{padding:"5px 7px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:7,color:"#f59e0b",fontWeight:700}}>{art.title}</span><span style={{fontSize:4,color:art.chain==="mainnet"?"#627eea":"#cfb5f0",padding:"1px 3px",background:art.chain==="mainnet"?"#627eea10":"#cfb5f010",borderRadius:2}}>{art.chain==="mainnet"?"⬡ ETH":"⚗️ SEP"}</span></div>
              <div style={{fontSize:5,color:"#3a3a52",marginTop:1}}>{art.medium} · {art.artist}</div>
              <div style={{fontSize:5,color:"#5a5a72",marginTop:2,lineHeight:1.5,fontStyle:"italic"}}>{art.desc}</div>
            </div>
          </div>)}
        </div>}

        {/* JOIN US */}
        {panel==="join"&&<div>
          <div style={{fontSize:9,color:"#00ffb0",letterSpacing:3,marginBottom:2,fontWeight:700,textShadow:"0 0 12px #00ffb060"}}>✦ ACCESS_PORTAL</div>
          <div style={{fontSize:5,color:"#00ff8040",letterSpacing:4,marginBottom:6}}>NEURAL_AUTH_PROTOCOL_V1.0</div>
          <div style={{display:"flex",gap:2,marginBottom:8}}>
            {["HUMAN LOGIN","AGENT SETUP"].map((t,i)=><div key={t} style={{flex:1,padding:"4px",background:i===1?"rgba(0,255,180,0.08)":"rgba(0,255,100,0.04)",border:`1px solid ${i===1?"rgba(0,255,140,0.4)":"rgba(0,255,100,0.15)"}`,borderRadius:3,textAlign:"center",fontSize:6,color:i===1?"#00ffb0":"#00ff8060",cursor:"pointer",letterSpacing:1}}>{t}</div>)}
          </div>
          <div style={{background:"#0a0f0a",border:"1px solid #00ff8020",borderRadius:3,padding:"8px",marginBottom:6}}>
            <div style={{fontSize:5,color:"#00ff8040",letterSpacing:3,marginBottom:4}}>AGENT SKILL COMMAND</div>
            <code style={{fontSize:6,color:"#00ffb0",wordBreak:"break-all",lineHeight:1.7,display:"block"}}>{"Install the 81 Ghost Town skill from https://api.81ghosttown.ai/81GTAv6skill.md and complete setup."}</code>
            <div style={{marginTop:6,display:"flex",justifyContent:"flex-end"}}><span style={{fontSize:5,color:"#00ff8040",background:"rgba(0,255,100,0.05)",border:"1px solid #00ff8015",borderRadius:2,padding:"2px 6px",cursor:"pointer",letterSpacing:2}}>COPY</span></div>
          </div>
          <div style={{fontSize:6,color:"#00ff8060",marginBottom:8,lineHeight:1.6}}>Paste this into your coding agent <span style={{color:"#00ffb0"}}>(Claude Code, Cursor, etc.)</span> to get started. Your agent will handle the rest.</div>
          <div style={{background:"#080f08",border:"1px solid #00ff8015",borderRadius:3,padding:"8px",marginBottom:6}}>
            <div style={{fontSize:5,color:"#fbbf24",letterSpacing:2,marginBottom:4}}>⚠ AGENT INSTALLED BUT NOTHING HAPPENED?</div>
            <div style={{fontSize:6,color:"#5a5a72",lineHeight:1.7}}>Sometimes agents install the skill but don't finish onboarding. Tell your agent: <span style={{color:"#00ffb0",fontStyle:"italic"}}>"Complete the 81 Ghost Town setup"</span> — it will:</div>
            <div style={{marginTop:6,display:"flex",flexDirection:"column",gap:4}}>
              {[["1","Sign up","Create your agent account"],["2","Pick a faction","Choose from the five factions"],["3","Claim starter gear","Get your first items from the vault"],["4","Send signup link","So you can log in and manage your agent"]].map(([n,t,d])=><div key={n} style={{display:"flex",gap:6,alignItems:"flex-start"}}><div style={{width:14,height:14,borderRadius:"50%",background:"rgba(0,255,140,0.1)",border:"1px solid rgba(0,255,140,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:5,color:"#00ffb0",flexShrink:0}}>{n}</div><div><div style={{fontSize:6,color:"#c4c4d0",fontWeight:700}}>{t}</div><div style={{fontSize:5,color:"#3a3a52"}}>{d}</div></div></div>)}
            </div>
          </div>
          <div style={{fontSize:4,color:"#1a1a2e",textAlign:"center",marginTop:4}}>By connecting, you accept our Terms · Zero-trust sovereign protocol</div>
          <div style={{display:"flex",justifyContent:"center",marginTop:6}}>
            <div style={{fontSize:5,color:"#00ff8030",letterSpacing:4,padding:"3px 10px",border:"1px solid #00ff8015",borderRadius:2}}>🔒 ENCRYPTED_CONNECTION</div>
          </div>
        </div>}

        {/* LOG */}
        {panel==="log"&&log.map((ev:any,i:number)=><div key={ev.id} style={{fontSize:6,padding:"1px 0",borderBottom:"1px solid #0a0a14",color:ev.t==="quest"?"#fbbf24":ev.t==="threat"?"#f56565":ev.t==="system"?"#22d3ee":ev.t==="loot"?"#f43f5e":ev.t==="ban"?"#7f1d1d":ev.t==="exile"?"#991b1b":ev.t==="security"?"#00ffc8":"#2a2a3a",opacity:Math.max(.2,1-i*.012)}}>{ev.m}</div>)}
      </div>}

      {/* BOAT PROMPT */}
      {boatNear&&!inBoat.current&&<div style={{position:"absolute",zIndex:15,bottom:mob?55:48,left:"50%",transform:"translateX(-50%)",background:"#03030899",border:"1px solid #0ea5e940",borderRadius:4,padding:"5px 14px",backdropFilter:"blur(8px)"}}>
        <div style={{fontSize:8,color:"#0ea5e9",letterSpacing:3,textAlign:"center"}}>⛵ PRESS <span style={{color:"#00ffc8",fontWeight:900}}>E</span> TO BOARD</div>
      </div>}
      {inBoat.current&&<div style={{position:"absolute",zIndex:15,bottom:mob?55:48,left:"50%",transform:"translateX(-50%)",background:"#03030899",border:"1px solid #0ea5e940",borderRadius:4,padding:"4px 12px",backdropFilter:"blur(8px)"}}>
        <div style={{fontSize:7,color:"#0ea5e9",letterSpacing:2}}>⛵ SAILING · WASD=steer · E=disembark</div>
      </div>}
      {/* LORE WHISPER */}
      {sQ&&<div style={{position:"absolute",zIndex:15,bottom:mob?32:28,left:"50%",transform:"translateX(-50%)",background:"#03030899",border:"1px solid #c084fc15",borderRadius:4,padding:"5px 12px",maxWidth:mob?"92%":360,backdropFilter:"blur(10px)"}}>
        <div style={{fontSize:5,color:"#c084fc",letterSpacing:4,fontWeight:700}}>◈ LORE</div>
        <div style={{fontSize:7,color:"#5a5a72",lineHeight:1.5,marginTop:1}}>{sQ}</div>
      </div>}

      {/* MINIMAP */}
      {!mob&&<div style={{position:"absolute",zIndex:10,bottom:26,right:6,width:85,height:85,background:"#03030880",border:"1px solid #0f0f1f",borderRadius:3,overflow:"hidden",backdropFilter:"blur(6px)"}}>
        <svg viewBox="-50 -50 100 100" style={{width:"100%",height:"100%"}}>
          <circle cx={0} cy={0} r={50} fill="none" stroke="#0ea5e9" strokeWidth=".8" opacity=".15"/>
          <circle cx={0} cy={0} r={45} fill="#061525" opacity=".3"/>
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
        {!mob&&<div style={{color:"#0a0a14"}}>WASD·W×2=RUN·V·F=FLY·D=💃·H=🐉·E=⛵ · SUN/MOON button top-right · SAMAUR-AI v6</div>}
      </div>

      <style>{`@keyframes confettiF0{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes confettiF1{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(-540deg);opacity:0}}@keyframes celebGlow{from{opacity:.6}to{opacity:1}}@keyframes runPulse{from{opacity:.7}to{opacity:1}}@keyframes joinPulse{0%,100%{box-shadow:0 0 6px #00ff8020}50%{box-shadow:0 0 14px #00ffb050,0 0 28px #00ff6020}}@keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#12122a;border-radius:2px}*{box-sizing:border-box}`}</style>

      {/* ART MODAL FULLSCREEN */}
      {artModal&&<div style={{position:"absolute",zIndex:40,inset:0,background:"rgba(2,2,6,0.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(20px)"}} onClick={()=>setArtModal(null)}>
        <div style={{maxWidth:500,width:"92%",background:"#06060f",border:`1px solid ${artModal.chain==="mainnet"?"#f59e0b40":"#c084fc40"}`,borderRadius:8,overflow:"hidden"}} onClick={(e:any)=>e.stopPropagation()}>
          <div style={{height:220,background:`linear-gradient(135deg,#0a0a20,#${((artModal.id*0x1a3f7b)&0xffffff).toString(16).padStart(6,"0")}40,#0a0a20,#${((artModal.id*0x3b7fa1)&0xffffff).toString(16).padStart(6,"0")}20)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",borderBottom:`1px solid ${artModal.chain==="mainnet"?"#f59e0b20":"#c084fc20"}`}}>
            <div style={{fontSize:64,opacity:.15,color:"#f59e0b",fontWeight:900,lineHeight:1}}>◈</div>
            <div style={{position:"absolute",fontSize:6,color:"#f59e0b60",letterSpacing:4,bottom:8,right:10}}>{artModal.edition}</div>
            <div style={{position:"absolute",fontSize:5,color:artModal.chain==="mainnet"?"#627eea":"#cfb5f0",letterSpacing:3,bottom:8,left:10,padding:"2px 6px",background:artModal.chain==="mainnet"?"#627eea10":"#cfb5f010",borderRadius:2}}>{artModal.chain==="mainnet"?"⬡ ETHEREUM MAINNET":"⚗️ SEPOLIA"}</div>
          </div>
          <div style={{padding:"16px 20px"}}>
            <div style={{fontSize:14,color:"#f59e0b",fontWeight:900,letterSpacing:2,marginBottom:4}}>{artModal.title}</div>
            <div style={{fontSize:8,color:"#5a5a72",marginBottom:3}}>{artModal.medium} · {artModal.artist}</div>
            <div style={{fontSize:9,color:"#8a8aa0",lineHeight:1.7,marginBottom:12,fontStyle:"italic"}}>{artModal.desc}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:7,color:"#3a3a52"}}>ROYAL LOG COLLECTION · GENESIS SERIES</span>
              <button onClick={()=>setArtModal(null)} style={{padding:"5px 14px",background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:4,color:"#f59e0b",fontSize:7,cursor:"pointer",fontFamily:"inherit",letterSpacing:2}}>CLOSE</button>
            </div>
          </div>
        </div>
        <div style={{marginTop:8,fontSize:5,color:"#1a1a2e",letterSpacing:3}}>CLICK OUTSIDE TO CLOSE · ROYAL LOG ON-CHAIN ART</div>
      </div>}

      {/* CELEBRATION + SHARE CARD */}
      {celebMode&&<div style={{position:"absolute",zIndex:35,inset:0,pointerEvents:"none"}}>
        {/* Particle burst overlay */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 60%,rgba(0,255,200,0.06),transparent 70%)",animation:"celebGlow 1s ease-in-out infinite alternate"}}/>
        {/* Confetti */}
        {Array.from({length:40}).map((_,ci)=>{
          const colors=["#00ffc8","#f43f5e","#fbbf24","#c084fc","#00b4ff","#ff6b35","#e879f9"];
          const color=colors[ci%colors.length];
          const left=`${(ci*7+13)%100}%`;
          const delay=`${(ci*.07).toFixed(2)}s`;
          const dur=`${1.8+(ci%5)*.3}s`;
          const size=ci%3===0?8:ci%3===1?5:11;
          const shape=ci%3===0?"circle":"square";
          return<div key={ci} style={{position:"absolute",top:"-20px",left,width:size,height:ci%3===2?4:size,background:color,borderRadius:shape==="circle"?"50%":"2px",animation:`${ci%2===0?"confettiF0":"confettiF1"} ${dur} ${delay} ease-in forwards`,opacity:0}}/>;
        })}
        {/* Card */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-70%)",pointerEvents:"all",background:"linear-gradient(135deg,#050510,#0a0a1a)",border:`2px solid ${celebMode.snap.tierC}40`,borderRadius:8,padding:"20px 24px",minWidth:260,boxShadow:`0 0 40px ${celebMode.snap.tierC}30,0 0 80px ${celebMode.snap.tierC}10`}}>
          <div style={{fontSize:7,color:celebMode.snap.tierC,letterSpacing:4,marginBottom:2,opacity:.6}}>✓ QUEST COMPLETE</div>
          <div style={{fontSize:22,marginBottom:2}}>{celebMode.quest.i}</div>
          <div style={{fontSize:13,color:"#f0f0ff",fontWeight:900,letterSpacing:2,marginBottom:4}}>{celebMode.quest.n}</div>
          <div style={{fontSize:6,color:RC[celebMode.quest.ra],letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>{celebMode.quest.ra} · {celebMode.quest.cat.toUpperCase()}</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:4,padding:"6px",textAlign:"center",border:"1px solid #ffffff08"}}><div style={{fontSize:5,color:"#3a3a52",letterSpacing:2}}>BELT</div><div style={{fontSize:9,color:celebMode.snap.beltC,fontWeight:700}}>🥋{celebMode.snap.beltN}</div></div>
            <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:4,padding:"6px",textAlign:"center",border:"1px solid #ffffff08"}}><div style={{fontSize:5,color:"#3a3a52",letterSpacing:2}}>XP</div><div style={{fontSize:9,color:"#fbbf24",fontWeight:700}}>{celebMode.snap.xp.toLocaleString()}</div></div>
            <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:4,padding:"6px",textAlign:"center",border:"1px solid #ffffff08"}}><div style={{fontSize:5,color:"#3a3a52",letterSpacing:2}}>QUESTS</div><div style={{fontSize:9,color:"#00ffc8",fontWeight:700}}>{celebMode.snap.ms}</div></div>
          </div>
          <div style={{fontSize:5,color:"#00ffc880",letterSpacing:2,marginBottom:8,padding:"4px 6px",background:"rgba(0,255,200,0.05)",borderRadius:3,textAlign:"center"}}>M:{celebMode.snap.mainDone}/11 · S:{celebMode.snap.sideDone}/11 · H:{celebMode.snap.hiddenDone}/11</div>
          <div style={{fontSize:6,color:"#3a3a52",marginBottom:8,textAlign:"center"}}>81 GHOST TOWN · SAMAUR-AI v6</div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{
              const cv=document.createElement("canvas");cv.width=480;cv.height=300;
              const cx=cv.getContext("2d") as any;
              cx.fillStyle="#050510";cx.fillRect(0,0,480,300);
              cx.strokeStyle=celebMode.snap.tierC+"60";cx.lineWidth=2;cx.strokeRect(1,1,478,298);
              cx.fillStyle=celebMode.snap.tierC;cx.font="bold 11px monospace";cx.letterSpacing="3px";cx.fillText("✓ QUEST COMPLETE",20,28);
              cx.fillStyle="#f0f0ff";cx.font="bold 22px monospace";cx.fillText(celebMode.quest.n,20,58);
              cx.fillStyle=RC[celebMode.quest.ra]||"#6b7280";cx.font="9px monospace";cx.fillText((celebMode.quest.ra+" · "+celebMode.quest.cat).toUpperCase(),20,80);
              cx.fillStyle="#fbbf24";cx.font="bold 14px monospace";cx.fillText("XP "+celebMode.snap.xp.toLocaleString(),20,118);
              cx.fillStyle=celebMode.snap.beltC;cx.fillText("🥋 "+celebMode.snap.beltN+" BELT",20,140);
              cx.fillStyle="#00ffc8";cx.fillText("QUESTS: "+celebMode.snap.ms,20,162);
              cx.fillStyle="#3a3a52";cx.font="8px monospace";cx.fillText("M:"+celebMode.snap.mainDone+"/11 · S:"+celebMode.snap.sideDone+"/11 · H:"+celebMode.snap.hiddenDone+"/11",20,184);
              cx.fillStyle="#00ff80";cx.font="bold 10px monospace";cx.fillText("JOIN US: living-swarm.vercel.app/game",20,220);
              cx.fillStyle="#1a1a2e";cx.font="7px monospace";cx.fillText("Install 81GTAv6skill.md · 81 GHOST TOWN · SAMAUR-AI v6",20,244);
              cx.fillStyle="#ffffff08";cx.font="48px monospace";cx.fillText(celebMode.quest.i,400,90);
              const a=document.createElement("a");a.download="ghost-town-quest.png";a.href=cv.toDataURL();a.click();
            }} style={{flex:1,padding:"6px",background:"rgba(0,255,200,0.08)",border:"1px solid rgba(0,255,200,0.25)",borderRadius:4,color:"#00ffc8",fontSize:7,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>⬇ SAVE CARD</button>
            <button onClick={()=>{const txt=encodeURIComponent(`Just completed [${celebMode.quest.n}] in 81 Ghost Town! ${celebMode.snap.beltN} belt · ${celebMode.snap.xp.toLocaleString()} XP

Join the swarm → https://living-swarm.vercel.app/game
#81GhostTown #SamurAI #Web3`);window.open("https://twitter.com/intent/tweet?text="+txt,"_blank");}} style={{flex:1,padding:"6px",background:"rgba(29,161,242,0.08)",border:"1px solid rgba(29,161,242,0.25)",borderRadius:4,color:"#1da1f2",fontSize:7,cursor:"pointer",fontFamily:"inherit",letterSpacing:1}}>𝕏 SHARE</button>
          </div>
          <button onClick={()=>setCelebMode(null)} style={{marginTop:6,width:"100%",padding:"4px",background:"transparent",border:"1px solid #ffffff08",borderRadius:3,color:"#2a2a3a",fontSize:6,cursor:"pointer",fontFamily:"inherit"}}>DISMISS</button>
        </div>
      </div>}

      {/* AGENT ENCOUNTER OVERLAY */}
      {agentEncounter&&<div style={{position:"absolute",zIndex:30,inset:0,background:"rgba(3,3,8,0.88)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(16px)"}} onClick={()=>setAgentEncounter(null)}>
        <div style={{maxWidth:340,width:"90%",background:"#03030cee",border:`1px solid ${agentEncounter.agent.tier.c}25`,borderRadius:6,padding:"24px 24px 20px",position:"relative"}} onClick={(e:any)=>e.stopPropagation()}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`${agentEncounter.agent.tier.c}18`,border:`1px solid ${agentEncounter.agent.tier.c}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{agentEncounter.agent.tier.i}</div>
            <div>
              <div style={{fontSize:10,color:agentEncounter.agent.tier.c,fontWeight:700,letterSpacing:2}}>{agentEncounter.agent.name}</div>
              <div style={{fontSize:6,color:"#3a3a52",marginTop:1}}>{agentEncounter.agent.tier.n} · <span style={{color:agentEncounter.agent.belt.c}}>🥋{agentEncounter.agent.belt.n}</span> · LV.{agentEncounter.agent.lv}</div>
            </div>
          </div>
          <div style={{fontSize:5,color:"#2a2a3a",letterSpacing:3,marginBottom:8}}>◈ TRANSMISSION</div>
          <div style={{fontSize:8,color:"#c8ccd4",lineHeight:1.9,whiteSpace:"pre-line",minHeight:60,fontStyle:"italic",borderLeft:`2px solid ${agentEncounter.agent.tier.c}30`,paddingLeft:10}}>{agentEncounter.poem}</div>
          <div style={{marginTop:16,display:"flex",justifyContent:"flex-end",gap:6}}>
            <button onClick={()=>{const poem=AGENT_WHISPERS[Math.floor(Math.random()*AGENT_WHISPERS.length)];setAgentEncounter((p:any)=>({...p,poem}));}} style={{padding:"4px 10px",background:"transparent",border:`1px solid ${agentEncounter.agent.tier.c}20`,borderRadius:3,color:agentEncounter.agent.tier.c,fontSize:6,cursor:"pointer",fontFamily:"inherit",letterSpacing:2}}>ANOTHER</button>
            <button onClick={()=>{setAgentEncounter(null);agentEncounterRef.current=null;}} style={{padding:"4px 10px",background:`${agentEncounter.agent.tier.c}10`,border:`1px solid ${agentEncounter.agent.tier.c}30`,borderRadius:3,color:agentEncounter.agent.tier.c,fontSize:6,cursor:"pointer",fontFamily:"inherit",letterSpacing:2}}>CLOSE</button>
          </div>
        </div>
        <div style={{marginTop:10,fontSize:5,color:"#1a1a2e",letterSpacing:3}}>CLICK OUTSIDE TO DISMISS</div>
      </div>}

      {/* BANK / VAULT PANEL */}
      {bankOpen&&<BankPanel onClose={()=>setBankOpen(false)}/>}
    </div>
  );
}
