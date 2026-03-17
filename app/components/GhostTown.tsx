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
  {n:"TERMINAL HACK",cat:"hidden",xp:500,tk:120,en:0,i:"🖥️",ra:"epic",d:"[CLASSIFIED] Find the terminal in the Savage Agent Cafe. Decode the cipher to break in.",st:1,hint:"In the underground cave, something blinks..."},
  {n:"MOUNTAIN RACE",cat:"main",xp:1200,tk:300,en:50,i:"🏁",ra:"legendary",d:"Reach the race track on Mountain Level 2. Board the car (E) and beat the AI in 3 laps.",st:3},
  {n:"RIDE THE FALL",cat:"hidden",xp:600,tk:140,en:0,i:"🌊",ra:"epic",d:"[CLASSIFIED] Find the waterfall on the west edge and leap into the void below.",st:1,hint:"West edge of the map, where land meets the fall..."},
  {n:"VISIT THE CAFE",cat:"hidden",xp:400,tk:100,en:0,i:"☕",ra:"rare",d:"[CLASSIFIED] Explore the Savage Agent Cafe hidden below the waterfall.",st:1,hint:"Below the surface, neon hums..."},
  {n:"CLIMB CYBER MT SOVEREIGN",cat:"hidden",xp:800,tk:180,en:0,i:"🏔️",ra:"legendary",d:"[CLASSIFIED] Scale Cyber Mountain Sovereign to the north. The peak reveals the full ghost town.",st:1,hint:"North of the Museum, something rises..."},
  {n:"ANCIENT RELIC: DRAGON SWORD",cat:"hidden",xp:10000,tk:500,en:0,i:"⚔️",ra:"legendary",d:"[CLASSIFIED] Ride the dragon. Breathe fire while airborne. The first of three ancient relics will reveal itself.",st:1,hint:"Ride the dragon. Press I to breathe fire while flying high."},
  {n:"TREE FELLER",cat:"hidden",xp:600,tk:120,en:0,i:"🌲",ra:"epic",d:"[CLASSIFIED] Chop down a tree with the Dragon Sword. Something falls.",st:1,hint:"Equip the sword. Find a tree. Press C."},
  {n:"BIG MAN",cat:"hidden",xp:1200,tk:250,en:0,i:"🍎",ra:"legendary",d:"[CLASSIFIED] Eat the fruit that falls when a tree is felled. Grow 9x for 30 seconds.",st:1,hint:"Pick up the fruit before it disappears..."},
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
  {id:"force",n:"THE FORCE",desc:"Press L near an agent to lift and move them",icon:"🌀",reqXP:0,reqBelt:"RED"},
];
const SEA_COIN_POS=[[110,15],[135,-25],[95,-85],[-115,35],[-130,-15],[65,125],[-75,115],[25,-135],[145,65],[-105,-95],[5,145],[155,-55],[-145,45],[85,-125],[-55,135]];
const MUSIC_TRACKS=[
  {n:'CALM',   bpm:58, wv:'sine'    as OscillatorType,seq:[0,4,7,11,7,4,0,4],      base:130.81,gain:.11,color:'#22d3ee'},
  {n:'ROCK',   bpm:122,wv:'sawtooth'as OscillatorType,seq:[0,0,7,0,10,0,5,0],     base:65.41, gain:.07,color:'#f43f5e'},
  {n:'INDIAN', bpm:76, wv:'sine'    as OscillatorType,seq:[0,2,5,7,9,7,5,2],      base:146.83,gain:.09,color:'#fbbf24'},
  {n:'WORLD',  bpm:88, wv:'triangle'as OscillatorType,seq:[0,5,7,12,7,5,0,5],     base:130.81,gain:.09,color:'#38b2ac'},
  {n:'RNB',    bpm:84, wv:'sine'    as OscillatorType,seq:[0,3,7,10,3,7,10,3],    base:98.00, gain:.09,color:'#c084fc'},
  {n:'BLUES',  bpm:78, wv:'sawtooth'as OscillatorType,seq:[0,3,5,6,7,10,7,5],     base:98.00, gain:.08,color:'#4299e1'},
  {n:'FOLK',   bpm:100,wv:'triangle'as OscillatorType,seq:[0,2,4,7,4,2,7,4],      base:196.00,gain:.09,color:'#10b981'},
  {n:'METAL',  bpm:162,wv:'sawtooth'as OscillatorType,seq:[0,0,5,0,8,5,3,0],      base:65.41, gain:.06,color:'#991b1b'},
  {n:'TRIBAL', bpm:106,wv:'square'  as OscillatorType,seq:[0,0,7,0,5,0,3,7],      base:55.00, gain:.07,color:'#ff6b35'},
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
  const bM=new THREE.MeshStandardMaterial({color:0x7a1500,emissive:0xff3300,emissiveIntensity:.55,roughness:.3,metalness:.45});
  const scaleM=new THREE.MeshStandardMaterial({color:0xb02200,emissive:0xff4400,emissiveIntensity:.3,roughness:.4,metalness:.3});
  const eyeM=new THREE.MeshBasicMaterial({color:0xffee00,transparent:true,opacity:.98});
  const spineM=new THREE.MeshBasicMaterial({color:0xff7700,transparent:true,opacity:.88});
  const wM=new THREE.MeshBasicMaterial({color:0x5a0d00,transparent:true,opacity:.72,side:THREE.DoubleSide});
  const wEdgeM=new THREE.MeshBasicMaterial({color:0xff4400,transparent:true,opacity:.45,side:THREE.DoubleSide});

  // ── HEAD ──
  const hGr=new THREE.Group();hGr.name='headGr';hGr.position.set(0,.06,.58);dr.add(hGr);
  const skull=new THREE.Mesh(new THREE.BoxGeometry(.48,.3,.4),bM);hGr.add(skull);
  const snout=new THREE.Mesh(new THREE.BoxGeometry(.3,.2,.36),scaleM);snout.position.set(0,-.05,.3);hGr.add(snout);
  const jaw=new THREE.Mesh(new THREE.BoxGeometry(.26,.12,.3),bM);jaw.position.set(0,-.18,.28);hGr.add(jaw);
  // Horns
  [-1,1].forEach((s:number)=>{
    const h1=new THREE.Mesh(new THREE.ConeGeometry(.05,.28,4),spineM);h1.position.set(s*.15,.22,-.04);h1.rotation.z=s*.35;h1.rotation.x=-.18;hGr.add(h1);
    const h2=new THREE.Mesh(new THREE.ConeGeometry(.035,.18,4),spineM);h2.position.set(s*.12,.18,.1);h2.rotation.z=s*.28;hGr.add(h2);
  });
  // Eyes
  [-1,1].forEach((s:number)=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.06,5,4),eyeM);e.position.set(s*.17,.1,.15);const el=new THREE.PointLight(0xffee00,.4,2);el.position.copy(e.position);hGr.add(e);hGr.add(el);});
  // Nostrils
  [-1,1].forEach((s:number)=>{const n=new THREE.Mesh(new THREE.SphereGeometry(.03,4,3),new THREE.MeshBasicMaterial({color:0xff2200}));n.position.set(s*.08,-.1,.46);hGr.add(n);});
  // Neck ridge spines
  for(let i=0;i<3;i++){const sp=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,4),spineM);sp.position.set(0,.2-.01*i,-.1-.12*i);sp.rotation.x=-.2;hGr.add(sp);}

  // ── 6 BODY SEGMENTS ── (with dorsal spines, oscillatable via userData)
  const bodyDef=[
    {r:.28,z:.04,sr:.07,sh:.22},{r:.26,z:-.3,sr:.065,sh:.2},{r:.22,z:-.58,sr:.058,sh:.18},
    {r:.17,z:-.84,sr:.05,sh:.15},{r:.12,z:-1.06,sr:.04,sh:.12},{r:.08,z:-1.24,sr:.03,sh:.09}
  ];
  bodyDef.forEach((bd,i)=>{
    const seg=new THREE.Mesh(new THREE.SphereGeometry(bd.r,8,6),i%2===0?bM:scaleM);
    seg.position.set(0,.03,bd.z);seg.name=`body${i}`;seg.userData={baseZ:bd.z,baseY:.03,segIdx:i};dr.add(seg);
    // Dorsal spine on top of each segment
    const sp=new THREE.Mesh(new THREE.ConeGeometry(bd.sr,bd.sh,4),spineM);
    sp.position.set(0,bd.r+bd.sh*.4,bd.z);sp.name=`spine${i}`;sp.userData={baseZ:bd.z,baseY:bd.r+bd.sh*.4,segIdx:i,isSpine:true};dr.add(sp);
    // Side scale bumps
    [-1,1].forEach((s:number)=>{const sc=new THREE.Mesh(new THREE.SphereGeometry(bd.r*.35,5,4),scaleM);sc.position.set(s*bd.r*.75,.02,bd.z);sc.name=`scale${i}${s>0?'r':'l'}`;sc.userData={baseZ:bd.z,baseY:.02,segIdx:i};dr.add(sc);});
  });

  // ── BAT WINGS — swept back, leathery ──
  [-1,1].forEach((s:number)=>{
    const wGr=new THREE.Group();wGr.name=`wingGr${s>0?'R':'L'}`;wGr.position.set(s*.24,.06,-.12);dr.add(wGr);
    // Arm bone
    const arm=new THREE.Mesh(new THREE.CylinderGeometry(.035,.055,.68,5),bM);arm.rotation.z=s*1.05;arm.rotation.x=-.22;wGr.add(arm);
    // Main membrane — large, swept back
    const mem=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.2),wM);
    mem.position.set(s*.62,-.08,.18);mem.rotation.y=s*.28;mem.rotation.x=.12;mem.rotation.z=s*-.18;mem.name='wing';wGr.add(mem);
    // Wing edge glow strip
    const edge=new THREE.Mesh(new THREE.PlaneGeometry(2.65,2.25),wEdgeM);
    edge.position.set(s*.62,-.08,.18);edge.rotation.y=s*.28;edge.rotation.x=.12;edge.rotation.z=s*-.18;wGr.add(edge);
    // Finger bones (3 rays)
    for(let fi=0;fi<3;fi++){const fb=new THREE.Mesh(new THREE.CylinderGeometry(.02,.03,.48,4),bM);fb.rotation.z=s*(1.0+fi*.25);fb.rotation.x=-.1+fi*.08;fb.position.set(s*(.3+fi*.2),-.05+fi*.04,.1+fi*.05);wGr.add(fb);}
  });

  // ── FIRE TRAIL (mouth) ──
  const fTr=new THREE.Group();fTr.name='fireTr';fTr.visible=false;fTr.position.set(0,-.06,.6);
  for(let fi=0;fi<10;fi++){
    const col=fi<3?0xffff55:fi<6?0xff8800:0xff2200;
    const fc=new THREE.Mesh(new THREE.SphereGeometry(.07-.005*fi,4,3),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.95-.07*fi}));
    fc.position.set((fi%3===1?.04:fi%3===2?-.04:0),0,.22+fi*.19);fTr.add(fc);
  }
  dr.add(fTr);

  // ── GLOW ──
  const gl=new THREE.PointLight(0xff4500,2.2,10);gl.name='glow';dr.add(gl);
  dr.scale.setScalar(1.8);// visible but not fly-sized
  return dr;
}
function mkTree(variant=0):THREE.Group{
  const g=new THREE.Group();
  // 9x bigger trees — tall, imposing
  const trunkH=(9+variant*3);
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.9,trunkH,7),new THREE.MeshBasicMaterial({color:0x5c3d1e}));
  trunk.position.y=trunkH*.5;g.add(trunk);
  const leafCols=[0x1a7a2a,0x1e8c32,0x156e24,0x228c3a];
  const leafM=new THREE.MeshBasicMaterial({color:leafCols[variant%4]});
  [8,5.5,3.5].forEach((r,i)=>{const c=new THREE.Mesh(new THREE.SphereGeometry(r,7,6),leafM);c.position.y=trunkH+3+i*5.5;g.add(c);});
  return g;
}
function mkFruit():THREE.Mesh{
  const cols=[0xff4400,0xffcc00,0xff88aa,0xaaff44];
  return new THREE.Mesh(new THREE.SphereGeometry(.55,6,5),new THREE.MeshBasicMaterial({color:cols[Math.floor(Math.random()*cols.length)]}));
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

function mkSeaCoin(col=0xfbbf24):THREE.Group{
  // Coin: emissive disc only — zero lights
  const gr=new THREE.Group();
  const cM=new THREE.MeshBasicMaterial({color:col});
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.08,8),cM);disc.name='coinDisc';gr.add(disc);
  return gr;
}
function mkWaterfall():THREE.Group{
  // Canyon entrance cliff — water drops FROM y=0 DOWN to y=-18
  const gr=new THREE.Group();
  const cliff=new THREE.Mesh(new THREE.BoxGeometry(18,18,6),new THREE.MeshBasicMaterial({color:0x1a2230}));cliff.position.set(0,-9,-2);gr.add(cliff);
  const w0=new THREE.Mesh(new THREE.PlaneGeometry(10,18),new THREE.MeshBasicMaterial({color:0x3399ff,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));w0.position.set(0,-9,1);w0.name='wfall0';gr.add(w0);
  const w1=new THREE.Mesh(new THREE.PlaneGeometry(7,18),new THREE.MeshBasicMaterial({color:0x88ccff,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}));w1.position.set(.3,-9,.8);w1.name='wfall1';gr.add(w1);
  return gr;
}
function mkCafe():THREE.Group{
  // Cafe: 3 meshes, emissive — zero lights
  const gr=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(16,5,12),new THREE.MeshBasicMaterial({color:0x0d1117}));body.position.y=2.5;gr.add(body);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(17,.5,13),new THREE.MeshBasicMaterial({color:0xff2d78}));roof.position.y=5.2;gr.add(roof);
  const sign=new THREE.Mesh(new THREE.BoxGeometry(10,1.4,.15),new THREE.MeshBasicMaterial({color:0x00ffe7}));sign.position.set(0,6,6.1);gr.add(sign);
  // Big computer screen in the window
  const screen=new THREE.Mesh(new THREE.BoxGeometry(8,5,.2),new THREE.MeshBasicMaterial({color:0x001122}));screen.position.set(0,3.5,6.12);gr.add(screen);
  const scanline=new THREE.Mesh(new THREE.BoxGeometry(7.6,.3,.22),new THREE.MeshBasicMaterial({color:0x00ff88}));scanline.position.set(0,5.5,6.13);scanline.name='scanline';gr.add(scanline);
  const txt=new THREE.Mesh(new THREE.BoxGeometry(6,.8,.22),new THREE.MeshBasicMaterial({color:0x00cc66}));txt.position.set(0,3.5,6.13);gr.add(txt);
  return gr;
}
function mkStairs():THREE.Group{
  // One glowing step platform — stacked in scene init to form staircase
  const gr=new THREE.Group();
  const step=new THREE.Mesh(new THREE.BoxGeometry(6,.5,3.5),new THREE.MeshBasicMaterial({color:0x00ffb0}));gr.add(step);
  return gr;
}
function mkMountain():THREE.Group{
  const gr=new THREE.Group();
  // RECTANGULAR stepped plateau — flat, 8 levels, 2-unit steps, easy to climb, NO peak/point
  const levelW=[110,95,80,65,50,35,20,10];// X width per level
  const levelD=[70, 60,50,40,30,22,14,10];// Z depth per level
  const levelY=[0,  2, 4, 6, 8,10,12,14];// Y surface of each step
  const cols=[0x1e2d3a,0x222f3e,0x263240,0x2a3545,0x2e384a,0x32404e,0x364450,0x3a4855];
  for(let lv=0;lv<8;lv++){
    // Level 0 = thin ground slab (flush, no step). Levels 1-7 = raised platforms.
    const platH=lv===0?0.15:1.2;
    const plat=new THREE.Mesh(new THREE.BoxGeometry(levelW[lv],platH,levelD[lv]),new THREE.MeshBasicMaterial({color:cols[lv]}));
    plat.position.y=levelY[lv]+platH/2;plat.name=`mtLevel${lv}`;gr.add(plat);
  }
  // Flat glowing summit (no point, no peak)
  const top=new THREE.Mesh(new THREE.BoxGeometry(10,.4,10),new THREE.MeshBasicMaterial({color:0x00b4ff}));
  top.position.y=15.4;top.name='mtPeak';gr.add(top);
  // Race track on level 2 (y=4, radius=22)
  const trackM=new THREE.MeshBasicMaterial({color:0x2a2a2a,side:THREE.DoubleSide});
  const track=new THREE.Mesh(new THREE.TorusGeometry(22,2,4,48),trackM);track.rotation.x=Math.PI/2;track.position.y=5.2;track.name='raceTrack';gr.add(track);
  for(let i=0;i<12;i++){const ang=i/12*Math.PI*2;const mk=new THREE.Mesh(new THREE.BoxGeometry(1.5,.1,4),new THREE.MeshBasicMaterial({color:0xffffff}));mk.position.set(Math.cos(ang)*22,5.4,Math.sin(ang)*22);mk.rotation.y=-ang;gr.add(mk);}
  const fl=new THREE.Mesh(new THREE.BoxGeometry(5,.15,4),new THREE.MeshBasicMaterial({color:0xff3333}));fl.position.set(22,5.5,0);fl.name='finishLine';gr.add(fl);
  // STRAIGHT STAIRCASES on N/S/E/W faces + 4 corners — 8 paths total, small easy steps
  const stairM=new THREE.MeshBasicMaterial({color:0x4a5a4a});
  // N and S faces (steps along Z axis)
  [-1,1].forEach((side:number)=>{
    for(let lv=0;lv<7;lv++){
      const numSteps=4;
      for(let st=0;st<numSteps;st++){
        const frac=(st+.5)/numSteps;
        const stepY=lerp(levelY[lv]+1.2,levelY[lv+1]+1.2,frac);
        const stepZ=side*(lerp(levelD[lv]/2,levelD[lv+1]/2,frac)-.5);
        const step=new THREE.Mesh(new THREE.BoxGeometry(8,.5,2),stairM);
        step.position.set(0,stepY,stepZ);gr.add(step);
      }
    }
  });
  // E and W faces (steps along X axis)
  [-1,1].forEach((side:number)=>{
    for(let lv=0;lv<7;lv++){
      const numSteps=4;
      for(let st=0;st<numSteps;st++){
        const frac=(st+.5)/numSteps;
        const stepY=lerp(levelY[lv]+1.2,levelY[lv+1]+1.2,frac);
        const stepX=side*(lerp(levelW[lv]/2,levelW[lv+1]/2,frac)-.5);
        const step=new THREE.Mesh(new THREE.BoxGeometry(2,.5,8),stairM);
        step.position.set(stepX,stepY,0);gr.add(step);
      }
    }
  });
  // Corner staircases (NE/NW/SE/SW)
  ([[1,1],[1,-1],[-1,1],[-1,-1]] as [number,number][]).forEach(([sx,sz])=>{
    for(let lv=0;lv<7;lv++){
      const numSteps=4;
      for(let st=0;st<numSteps;st++){
        const frac=(st+.5)/numSteps;
        const stepY=lerp(levelY[lv]+1.2,levelY[lv+1]+1.2,frac);
        const stepX=sx*lerp(levelW[lv]/2-.5,levelW[lv+1]/2-.5,frac);
        const stepZ=sz*lerp(levelD[lv]/2-.5,levelD[lv+1]/2-.5,frac);
        const step=new THREE.Mesh(new THREE.BoxGeometry(3,.5,3),stairM);
        step.position.set(stepX,stepY,stepZ);gr.add(step);
      }
    }
  });
  return gr;
}
function mkRapids():THREE.Group{
  // 6-level cascade descending FROM y=0 DOWN to y=-18 — below main axis
  const gr=new THREE.Group();
  const rockM=new THREE.MeshBasicMaterial({color:0x1a2230});
  const waterM=new THREE.MeshBasicMaterial({color:0xaaddff,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false});
  const foamM=new THREE.MeshBasicMaterial({color:0xeef8ff,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false});
  // Canyon walls (frame the descent)
  for(let lv=0;lv<6;lv++){
    const y=-lv*3;
    [-1,1].forEach((s:number)=>{
      const wall=new THREE.Mesh(new THREE.BoxGeometry(2.5,4,5.5),rockM);
      wall.position.set(s*7,y-2,lv*5);gr.add(wall);
    });
  }
  // 6 descending tiers
  for(let lv=0;lv<6;lv++){
    const y=-lv*3;const w=8-lv*.3;
    const shelf=new THREE.Mesh(new THREE.BoxGeometry(w+3,1,5),rockM);shelf.position.set(0,y-.5,lv*5);gr.add(shelf);
    const pool=new THREE.Mesh(new THREE.PlaneGeometry(w,4),waterM);pool.rotation.x=-Math.PI/2;pool.position.set(0,y+.05,lv*5+1);pool.name=`rapids${lv}`;gr.add(pool);
    const foam=new THREE.Mesh(new THREE.PlaneGeometry(w+1,1.5),foamM);foam.rotation.x=-Math.PI/2;foam.position.set(0,y+.08,lv*5-.5);gr.add(foam);
    [-1,1].forEach((s:number)=>{const r=new THREE.Mesh(new THREE.OctahedronGeometry(.8+.3,0),rockM);r.position.set(s*(w/2+.8),y+.3,lv*5+1.5);gr.add(r);});
  }
  // Vertical drop planes between levels (water falling DOWN between shelves)
  for(let lv=0;lv<5;lv++){
    const drop=new THREE.Mesh(new THREE.PlaneGeometry(5,3.2),foamM);
    drop.position.set(0,-lv*3-1.6,lv*5+4.5);gr.add(drop);
  }
  return gr;
}
function mkFish():THREE.Group{
  // A single fish = small cone with tail
  const gr=new THREE.Group();
  const fM=new THREE.MeshBasicMaterial({color:0x0088cc});
  const body=new THREE.Mesh(new THREE.ConeGeometry(.15,.5,5),fM);body.rotation.z=Math.PI/2;gr.add(body);
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.12,.2,4),new THREE.MeshBasicMaterial({color:0x0066aa}));tail.rotation.z=-Math.PI/2;tail.position.x=-.32;gr.add(tail);
  return gr;
}
function mkUnderground():THREE.Group{
  // Cave floor + 3 emissive crystals — zero lights
  const gr=new THREE.Group();
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,55),new THREE.MeshBasicMaterial({color:0x080c12}));floor.rotation.x=-Math.PI/2;gr.add(floor);
  [[0,0],[18,-14],[-18,14]].forEach(([x,z]:number[])=>{
    const c=new THREE.Mesh(new THREE.OctahedronGeometry(.5,0),new THREE.MeshBasicMaterial({color:0x6633cc}));c.position.set(x,.5,z);gr.add(c);
  });
  return gr;
}

function mkHorse():THREE.Group{
  const gr=new THREE.Group();
  const bM=new THREE.MeshBasicMaterial({color:0x8b5e3c});
  const mM=new THREE.MeshBasicMaterial({color:0x3d2b1f});
  const wM=new THREE.MeshBasicMaterial({color:0x5c3d28});
  // Body
  const body=new THREE.Mesh(new THREE.BoxGeometry(1.8,.95,3.2),bM);body.position.y=1.1;gr.add(body);
  // Neck
  const neck=new THREE.Mesh(new THREE.BoxGeometry(.55,1.1,.55),bM);neck.position.set(0,1.75,1.2);neck.rotation.x=-.45;gr.add(neck);
  // Head
  const head=new THREE.Mesh(new THREE.BoxGeometry(.5,.55,1.0),bM);head.position.set(0,2.3,1.85);gr.add(head);
  // Mane
  const mane=new THREE.Mesh(new THREE.BoxGeometry(.18,.6,.7),mM);mane.position.set(0,2.0,1.4);gr.add(mane);
  // Legs (4)
  [[.55,.3,1.0],[-.55,.3,1.0],[.55,.3,-1.0],[-.55,.3,-1.0]].forEach(([x,y,z])=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(.28,.85,.28),wM);
    leg.position.set(x,y as number,z as number);gr.add(leg);
  });
  // Tail
  const tail=new THREE.Mesh(new THREE.BoxGeometry(.2,.7,.18),mM);tail.position.set(0,.95,-1.7);tail.rotation.x=.4;gr.add(tail);
  // Saddle indicator (emissive)
  const saddle=new THREE.Mesh(new THREE.BoxGeometry(1.4,.2,1.2),new THREE.MeshBasicMaterial({color:0x00ffe7}));saddle.position.y=1.62;gr.add(saddle);
  gr.scale.setScalar(1.1);
  return gr;
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
  const [activeTrack,setActiveTrack]=useState(-1);
  const musicCtxRef=useRef<AudioContext|null>(null);
  const musicIvRef=useRef<any>(null);
  const musicSeqIdx=useRef(0);
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
  const guardianDragonRef=useRef<any>(null);
  const onDragon=useRef(false);
  const dragonRideCooldown=useRef(0);
  const [ridingDragon,setRidingDragon]=useState(false);
  const danceMode=useRef(false);
  const inBoat=useRef(false);
  const playerBoat=useRef<any>(null);
  const boatEnterCooldown=useRef(0);
  const isDayRef=useRef(false);
  const dayT=useRef(0);
  const liftedAgent=useRef<any>(null);
  const inUnderground=useRef(false);
  const waterfallFrame=useRef(0);
  const [lifting,setLifting]=useState(false);
  const inCar=useRef(false);
  const raceActive=useRef(false);
  const playerCarAngle=useRef(0);
  const aiCarAngle=useRef(0.1);
  const playerLaps=useRef(0);
  const [raceHUD,setRaceHUD]=useState<any>(null);
  const [hackModal,setHackModal]=useState(false);
  const [hackInput,setHackInput]=useState('');
  const [hackSolved,setHackSolved]=useState(false);
  const [backpackOpen,setBackpackOpen]=useState(false);
  const [mintingItem,setMintingItem]=useState<string|null>(null);
  const fishRefs=useRef<any[]>([]);
  const horseRef=useRef<any>(null);
  const onHorse=useRef(false);
  const horseCooldown=useRef(0);
  const [ridingHorse,setRidingHorse]=useState(false);
  const dragonCinematicPlayed=useRef(false);
  const [dragonCinematic,setDragonCinematic]=useState(false);
  const [dragonSwordEquipped,setDragonSwordEquipped]=useState(false);
  const fireBreathFrames=useRef(0);
  const [rocketPackEquipped,setRocketPackEquipped]=useState(false);
  const rocketPackRef=useRef<any>(null);
  const tronAcquired=useRef(false);
  const playerJetpackMesh=useRef<any>(null);
  const playerSwordMesh=useRef<any>(null);
  const treesRef=useRef<any[]>([]);
  const fruitsRef=useRef<any[]>([]);
  const bigManFrames=useRef(0);
  const [bigMan,setBigMan]=useState(false);
  const [poemCard,setPoemCard]=useState<string|null>(null);
  const [backpackFlash,setBackpackFlash]=useState(false);
  const [activeChain,setActiveChain]=useState<"mainnet"|"sepolia">("sepolia");
  const [,rf]=useState(0);

  const keys=useRef({w:false,a:false,s:false,d:false,shift:false,space:false});
  const playerPos=useRef(new THREE.Vector3(0,0,10));
  const playerAngle=useRef(0);
  const playerAv=useRef<any>(null);
  const playerY=useRef(0);
  const pd=useRef<any>({xp:0,tk:100,en:100,mEn:100,tier:T[0],belt:BELTS[0],skin:SKINS[0],ms:0,dojoXP:0,oE:["wave","bow"],oS:["default"],name:"YOU",did:gDID(),superSkills:[],rep:100,inf:0,whispers:0,mainQDone:[],sideQDone:[],hiddenQDone:[],backpack:[]});

  const cA=useRef(.6),cT=useRef(.55),cD=useRef(18);
  const _camTgt=useRef(new THREE.Vector3()).current;
  const _fwd=useRef(new THREE.Vector3()).current;
  const _right=useRef(new THREE.Vector3()).current;
  const _mv=useRef(new THREE.Vector3()).current;
  const _tgt=useRef(new THREE.Vector3()).current;
  const _lookAt=useRef(new THREE.Vector3()).current;
  const _ct=useRef(new THREE.Vector3()).current;
  const _agLook=useRef(new THREE.Vector3()).current;
  const isDr=useRef(false),lP=useRef({x:0,y:0}),pDist=useRef(0),qTm=useRef(0),sTm=useRef(0),SA=useRef({xp:0,tk:0,ms:0,th:0});
  const camModeRef=useRef("3rd");
  const flyingRef=useRef(false);
  const joyDir=useRef({x:0,y:0});

  const aL=useCallback((m:string,t="info")=>setLog(p=>[{m,t,id:Math.random()},...p].slice(0,80)),[]);
  const addToast=useCallback((msg:string,color="#00ffc8")=>{const id=Math.random();setToasts(p=>[...p,{id,msg,color}]);setTimeout(()=>setToasts(p=>p.filter((t:any)=>t.id!==id)),4000);},[]);
  const addAch=useCallback((name:string,desc:string)=>{setAchievements(p=>{if(p.find((a:any)=>a.name===name))return p;return[...p,{name,desc}];});addToast(`🏆 ${name}`,"#fbbf24");},[addToast]);

  const stopMusic=useCallback(()=>{if(musicIvRef.current){clearInterval(musicIvRef.current);musicIvRef.current=null;}setActiveTrack(-1);},[]);
  const startMusic=useCallback((idx:number)=>{
    if(musicIvRef.current){clearInterval(musicIvRef.current);musicIvRef.current=null;}
    if(idx<0){setActiveTrack(-1);return;}
    if(!musicCtxRef.current){try{musicCtxRef.current=new AudioContext();}catch(e){return;}}
    const ctx=musicCtxRef.current;
    if(ctx.state==='suspended')ctx.resume();
    const tr=MUSIC_TRACKS[idx];
    const semToHz=(base:number,semi:number)=>base*Math.pow(2,semi/12);
    musicSeqIdx.current=0;
    const beatMs=60000/tr.bpm;
    musicIvRef.current=setInterval(()=>{
      const semi=tr.seq[musicSeqIdx.current%tr.seq.length];
      musicSeqIdx.current++;
      const osc=ctx.createOscillator();const g=ctx.createGain();
      osc.connect(g);g.connect(ctx.destination);
      osc.type=tr.wv;osc.frequency.value=semToHz(tr.base,semi);
      const now=ctx.currentTime;
      g.gain.setValueAtTime(0,now);
      g.gain.linearRampToValueAtTime(tr.gain,now+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001,now+beatMs*.75/1000);
      osc.start(now);osc.stop(now+beatMs*.8/1000);
    },beatMs);
    setActiveTrack(idx);
  },[]);

  const checkSuper=useCallback(()=>{const p=pd.current;SUPER_SKILLS.forEach(ss=>{if(p.superSkills.includes(ss.id))return;const belt=gB(p.dojoXP);const bIdx=BELTS.findIndex((b:any)=>b.n===belt.n);const reqIdx=BELTS.findIndex((b:any)=>b.n===ss.reqBelt);if(p.xp>=ss.reqXP&&bIdx>=reqIdx){p.superSkills.push(ss.id);addToast(`${ss.icon} SUPER SKILL UNLOCKED: ${ss.n}!`,"#f43f5e");aL(`⭐ YOU unlocked super skill: ${ss.n} — ${ss.desc}`,"system");}});},[addToast,aL]);

  // ═══ SCENE INIT ═══
  useEffect(()=>{
    const el=mnt.current;if(!el)return;
    const mob=iM(),W=el.clientWidth,H=el.clientHeight;
    const sc=new THREE.Scene();sc.background=new THREE.Color(0x030308);// fog only in night mode (toggled by button)
    const cam=new THREE.PerspectiveCamera(55,W/H,.3,250);
    const ren=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance",precision:"highp"});
    ren.setSize(W,H);ren.setPixelRatio(Math.min(devicePixelRatio,2));
    ren.shadowMap.enabled=false;
    ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;
    el.appendChild(ren.domElement);
    sc.add(new THREE.AmbientLight(0x0a0a20,.4));
    const mn=new THREE.DirectionalLight(0x2244aa,.5);mn.position.set(-30,50,-20);
    mn.castShadow=true;mn.shadow.mapSize.set(512,512);if(true){mn.shadow.camera.near=1;mn.shadow.camera.far=120;(mn.shadow.camera as any).left=-60;(mn.shadow.camera as any).right=60;(mn.shadow.camera as any).top=60;(mn.shadow.camera as any).bottom=-60;}
    sc.add(mn);sc.add(new THREE.HemisphereLight(0x111133,0x050508,.25));
    const gnd=new THREE.Mesh(G().ground,new THREE.MeshStandardMaterial({color:0x060610,roughness:.95,metalness:.1}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;sc.add(gnd);
    sc.add((()=>{const _g=new THREE.GridHelper(200,100,0x0a0a1a,0x08081a);_g.position.set(0,.02,0);return _g;})());
    const rM=new THREE.MeshBasicMaterial({color:0x0a0a1a,transparent:true,opacity:.3});
    for(let i=0;i<Z.length;i++)for(let j=i+1;j<Z.length;j++){const a=Z[i],b=Z[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.sqrt(dx*dx+dz*dz);const rd=new THREE.Mesh(new THREE.PlaneGeometry(.8,d),rM);rd.rotation.x=-Math.PI/2;rd.position.set((a.x+b.x)/2,.03,(a.z+b.z)/2);rd.rotation.z=-Math.atan2(dz,dx)+Math.PI/2;sc.add(rd);}
    const blds=Z.map(z=>{const b=mkBld(z);sc.add(b.gr);return{...b,zone:z};});
    // Stars
    const sN=mob?200:400,sG=new THREE.BufferGeometry(),sP=new Float32Array(sN*3),sC=new Float32Array(sN*3);
    for(let i=0;i<sN;i++){const th=Math.random()*Math.PI*2,phi=Math.random()*Math.PI*.45,r=80+Math.random()*60;sP[i*3]=Math.sin(th)*Math.cos(phi)*r;sP[i*3+1]=30+Math.random()*50;sP[i*3+2]=Math.cos(th)*Math.cos(phi)*r;const c=new THREE.Color().setHSL(.5+Math.random()*.3,.6,.6);sC[i*3]=c.r;sC[i*3+1]=c.g;sC[i*3+2]=c.b;}
    sG.setAttribute("position",new THREE.BufferAttribute(sP,3));sG.setAttribute("color",new THREE.BufferAttribute(sC,3));
    sc.add(new THREE.Points(sG,new THREE.PointsMaterial({size:mob?.15:.1,vertexColors:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false})));
    // Rain
    const rN=mob?30:60,rG=new THREE.BufferGeometry(),rP=new Float32Array(rN*3),rC=new Float32Array(rN*3);
    for(let i=0;i<rN;i++){rP[i*3]=(Math.random()-.5)*140;rP[i*3+1]=Math.random()*25;rP[i*3+2]=(Math.random()-.5)*140;const g2=.3+Math.random()*.7;rC[i*3]=0;rC[i*3+1]=g2*.8;rC[i*3+2]=g2*.3;}
    rG.setAttribute("position",new THREE.BufferAttribute(rP,3));rG.setAttribute("color",new THREE.BufferAttribute(rC,3));
    const rain=new THREE.Points(rG,new THREE.PointsMaterial({size:mob?.08:.05,vertexColors:true,transparent:true,opacity:.45,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(rain);
    // Fireflies
    const fN=mob?60:180,fG=new THREE.BufferGeometry(),fP=new Float32Array(fN*3),fC=new Float32Array(fN*3);
    for(let i=0;i<fN;i++){fP[i*3]=(Math.random()-.5)*100;fP[i*3+1]=1+Math.random()*8;fP[i*3+2]=(Math.random()-.5)*100;const hue=[.13,.47,.55,.75,.85][Math.floor(Math.random()*5)];const c=new THREE.Color().setHSL(hue,.8,.6);fC[i*3]=c.r;fC[i*3+1]=c.g;fC[i*3+2]=c.b;}
    fG.setAttribute("position",new THREE.BufferAttribute(fP,3));fG.setAttribute("color",new THREE.BufferAttribute(fC,3));
    const ff=new THREE.Points(fG,new THREE.PointsMaterial({size:.36,vertexColors:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(ff);
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
    // ── Ocean gap / void at rapids entry (x=125, z=0) — shows the drop ──
    const voidGap=new THREE.Mesh(new THREE.PlaneGeometry(22,28),new THREE.MeshBasicMaterial({color:0x000005,transparent:false}));
    voidGap.rotation.x=-Math.PI/2;voidGap.position.set(125,-.54,2);sc.add(voidGap);
    // Canyon rim rocks framing the gap
    [[125,-.3,-14],[125,-.3,18],[114,-.3,2],[136,-.3,2]].forEach(([x,y,z])=>{
      const rim=new THREE.Mesh(new THREE.BoxGeometry(4,1.5,4),new THREE.MeshBasicMaterial({color:0x1a2230}));rim.position.set(x,y,z);sc.add(rim);});
    // ── Solid bridge: dock (x=84) → rapids entry (x=126) ──
    const bridgeM=new THREE.MeshBasicMaterial({color:0x3d2b1a});
    const bridge=new THREE.Mesh(new THREE.BoxGeometry(44,.5,6),bridgeM);
    bridge.position.set(105,.1,0);sc.add(bridge);
    // Glowing rails along the bridge
    const railM=new THREE.MeshBasicMaterial({color:0x00ffe7,transparent:true,opacity:.75});
    const railL=new THREE.Mesh(new THREE.BoxGeometry(44,.35,.3),railM);
    railL.position.set(105,.38,3);sc.add(railL);
    const railR=new THREE.Mesh(new THREE.BoxGeometry(44,.35,.3),railM);
    railR.position.set(105,.38,-3);sc.add(railR);
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
    // ── Ocean Rapids cascade (east side, drops BELOW main axis y=0 to y=-18) ──
    const wfall=mkRapids();wfall.position.set(125,0,0);sc.add(wfall);
    // ── Canyon cliff entrance marker ──
    const wfall2=mkWaterfall();wfall2.position.set(125,0,-4);sc.add(wfall2);
    // ── Fish schools (10 fish jumping upstream along the rapids) ──
    const fishArr:any[]=[];
    for(let fi=0;fi<10;fi++){const f=mkFish();f.position.set(125+((fi%3)-1)*1.2,-12,fi/10*25);sc.add(f);fishArr.push({mesh:f,t:fi/10*Math.PI*2,lane:(fi%3)-1});}
    fishRefs.current=fishArr;
    // ── Underground level (below rapids, at y=-18) ──
    const ugGr=mkUnderground();ugGr.position.set(125,-18,12);sc.add(ugGr);
    // ── Savage Agent Cafe (at base of rapids, underground) ──
    const cafe=mkCafe();cafe.position.set(125,-18,18);sc.add(cafe);
    // ── Glowing stairs: 7 steps from y=-18 back up to y=0 ──
    for(let si=0;si<7;si++){const sr=mkStairs();sr.position.set(125,-18+si*3,si*4+24);sc.add(sr);}
    const stairsGr=new THREE.Group();sc.add(stairsGr);
    // ── Walkway from entry point to Savage Cafe ──
    const walkwayM=new THREE.MeshBasicMaterial({color:0x00cc88,transparent:true,opacity:.7});
    // Underground walkway: from entry (z=0) all the way to cafe (z=18)
    const walkway=new THREE.Mesh(new THREE.BoxGeometry(4,.3,40),walkwayM);
    walkway.position.set(125,-17.85,8);sc.add(walkway);
    // Glowing edge lights along the walkway
    for(let wz=0;wz<=20;wz+=4){
      [-1,1].forEach((s:number)=>{const wl=new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.4),new THREE.MeshBasicMaterial({color:0x00ffe7}));wl.position.set(125+s*2.5,-17.5,wz);sc.add(wl);});
    }
    // Cafe steps (3 steps leading up to cafe entrance)
    for(let cs=0;cs<3;cs++){
      const cstep=new THREE.Mesh(new THREE.BoxGeometry(5,.4,1.2),new THREE.MeshBasicMaterial({color:0x00ffe7}));
      cstep.position.set(125,-18+cs*.4,17.5+cs*.5);sc.add(cstep);}
    // ── Cyber Mountain Sovereign (far north, 9x bigger) ──
    const mountain=mkMountain();mountain.position.set(0,0,-130);sc.add(mountain);
    // ── Horse at mountain base (rideable up the trail) ──
    const horseM=mkHorse();horseM.position.set(8,0,-74);sc.add(horseM);horseRef.current={mesh:horseM,tx:8,tz:-74,rideT:0};
    // ── Race cars (2: player + AI, on mountain track at level 2) ──
    const mkCar=(col:number)=>{const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(1.8,.7,3.5),new THREE.MeshBasicMaterial({color:col}));body.position.y=.4;g.add(body);const top=new THREE.Mesh(new THREE.BoxGeometry(1.4,.5,2),new THREE.MeshBasicMaterial({color:col}));top.position.set(0,.9,.1);g.add(top);([[.8,.1,1.4],[-.8,.1,1.4],[.8,.1,-1.4],[-.8,.1,-1.4]] as [number,number,number][]).forEach(([x,y,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.3,8),new THREE.MeshBasicMaterial({color:0x111111}));w.rotation.z=Math.PI/2;w.position.set(x,y,z);g.add(w);});return g;};
    const playerCar=mkCar(0x00ffc8);const aiCar=mkCar(0xf43f5e);
    // mountain is at (0,0,-130), race track at y=5.2 radius 22
    playerCar.position.set(22,5.2,-130);aiCar.position.set(20,5.2,-128);
    playerCar.visible=false;aiCar.visible=false;
    sc.add(playerCar);sc.add(aiCar);
    // ── Sea coins ──
    const seaCoins=(SEA_COIN_POS as [number,number][]).map(([cx,cz],ci:number)=>{
      const cm=mkSeaCoin([0xfbbf24,0x00ffc8,0xc084fc,0x60a5fa,0xf43f5e][ci%5]);
      cm.position.set(cx,.3,cz);sc.add(cm);
      return{mesh:cm,x:cx,z:cz,collected:false,respawnAt:0};
    });
    SD.current={sc,cam,ren,blds,ags,eds,rain,rP,rN,ff,fP,fN,discoBall,sea,seaCtx,seaTex,seaOff:0,agentBoats,playerBoats,ambL,dirL,starsObj,seaCoins,wfall,mountain,playerCar,aiCar,fishArr};
    // ── Rocket pack at Portal Hub (x=40, z=0) ──
    const rpGr=new THREE.Group();
    const rpBody=new THREE.Mesh(new THREE.BoxGeometry(1,.85,.5),new THREE.MeshBasicMaterial({color:0x00ff88}));rpGr.add(rpBody);
    const rpTL=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,.45,6),new THREE.MeshBasicMaterial({color:0xff6600}));rpTL.position.set(-.28,-.55,0);rpGr.add(rpTL);
    const rpTR=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,.45,6),new THREE.MeshBasicMaterial({color:0xff6600}));rpTR.position.set(.28,-.55,0);rpGr.add(rpTR);
    const rpGlow=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.0,.6),new THREE.MeshBasicMaterial({color:0x00ff88,transparent:true,opacity:.18}));rpGr.add(rpGlow);
    rpGr.position.set(40,1.8,2);sc.add(rpGr);rocketPackRef.current=rpGr;
    // ── Trees around the town ──
    const TREE_POS:number[][]=[[-65,-70],[-50,20],[-60,55],[15,-75],[-25,75],[62,-50],[72,30],[-72,25],[55,70],[-35,-85],[30,85],[-85,35],[25,-60],[-55,-20],[70,-70],[-15,55],[45,-85],[-78,-45],[58,-20],[28,72],[-62,-50],[48,50],[-42,65],[65,-25]];
    TREE_POS.forEach(([tx,tz],ti)=>{const tree=mkTree(ti%4);tree.position.set(tx,0,tz);sc.add(tree);treesRef.current.push({mesh:tree,x:tx,z:tz,chopped:false});});
    // ── Player jetpack accessory mesh (shown on player back when equipped) ──
    const jpAcc=new THREE.Group();
    const jpBody=new THREE.Mesh(new THREE.BoxGeometry(.38,.42,.2),new THREE.MeshBasicMaterial({color:0x00ff88}));jpAcc.add(jpBody);
    const jpGlow=new THREE.Mesh(new THREE.BoxGeometry(.44,.48,.24),new THREE.MeshBasicMaterial({color:0x00ff88,transparent:true,opacity:.22}));jpAcc.add(jpGlow);
    const jpTL=new THREE.Mesh(new THREE.CylinderGeometry(.065,.09,.2,5),new THREE.MeshBasicMaterial({color:0xff6600}));jpTL.position.set(-.11,-.26,0);jpAcc.add(jpTL);
    const jpTR=new THREE.Mesh(new THREE.CylinderGeometry(.065,.09,.2,5),new THREE.MeshBasicMaterial({color:0xff6600}));jpTR.position.set(.11,-.26,0);jpAcc.add(jpTR);
    const jpLight=new THREE.PointLight(0x00ff88,1.2,5);jpAcc.add(jpLight);jpAcc.visible=false;sc.add(jpAcc);playerJetpackMesh.current=jpAcc;
    // ── Player sword accessory mesh (shown on right hand when equipped) ──
    const swAcc=new THREE.Group();
    const swBlade=new THREE.Mesh(new THREE.BoxGeometry(.07,.75,.06),new THREE.MeshBasicMaterial({color:0xf8f8ff}));swAcc.add(swBlade);
    const swGlow1=new THREE.Mesh(new THREE.BoxGeometry(.12,.8,.1),new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:.45}));swAcc.add(swGlow1);
    const swGlow2=new THREE.Mesh(new THREE.BoxGeometry(.18,.85,.14),new THREE.MeshBasicMaterial({color:0xff8800,transparent:true,opacity:.18}));swAcc.add(swGlow2);
    const swGuard=new THREE.Mesh(new THREE.BoxGeometry(.3,.06,.1),new THREE.MeshBasicMaterial({color:0xfbbf24}));swGuard.position.y=-.4;swAcc.add(swGuard);
    const swLight=new THREE.PointLight(0xfbbf24,1.4,4);swAcc.add(swLight);swAcc.visible=false;sc.add(swAcc);playerSwordMesh.current=swAcc;
    // ── Mountain guardian dragon — circles at mid-height, clearly visible from base ──
    const guardDragonMesh=mkDragon();guardDragonMesh.position.set(30,10,-95);sc.add(guardDragonMesh);
    guardianDragonRef.current={mesh:guardDragonMesh,tx:0,tz:-95,frame:300,tgtZone:null,riding:false};
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
        if(!dragonRef.current){const d=mkDragon();SD.current.sc.add(d);d.position.set(playerPos.current.x,0,playerPos.current.z);dragonRef.current={mesh:d,tx:tgtZ.x,tz:tgtZ.z,frame:0,tgtZone:tgtZ,riding:false};}
        else{dragonRef.current.tx=tgtZ.x;dragonRef.current.tz=tgtZ.z;dragonRef.current.tgtZone=tgtZ;dragonRef.current.frame=30;}
        addToast("🐉 Dragon flies to next quest! Press R nearby to mount","#ff4500");aL("🐉 Dragon summoned — follow it, then press R to ride","system");
      }
      // Race car enter/exit
      if(k==='e'&&SD.current&&!inBoat.current&&!inCar.current){
        const _mtOk=pd.current.hiddenQDone.includes('CLIMB CYBER MT SOVEREIGN');
        if(_mtOk){const _px=playerPos.current.x,_pz=playerPos.current.z;
          const _carX=Math.cos(playerCarAngle.current)*30,_carZ=Math.sin(playerCarAngle.current)*30-130;
          if(Math.sqrt((_px-_carX)**2+(_pz-_carZ)**2)<6&&!raceActive.current){
            if(SD.current.playerCar)SD.current.playerCar.visible=true;if(SD.current.aiCar)SD.current.aiCar.visible=true;
            inCar.current=true;raceActive.current=true;playerLaps.current=0;setRaceHUD({lap:0,total:3});
            addToast('🏁 RACE START! 3 laps — WASD to drive, E to exit car','#ff3333');aL('🏁 Mountain race started — beat the AI in 3 laps!','system');}
        }
      }
      if(k==='e'&&inCar.current){inCar.current=false;raceActive.current=false;setRaceHUD(null);if(SD.current?.playerCar)SD.current.playerCar.visible=false;if(SD.current?.aiCar)SD.current.aiCar.visible=false;addToast('🏁 Exited race car','#64748b');}
      if(k==='e'&&SD.current&&boatEnterCooldown.current<=0){
        if(!inBoat.current){
          // Find nearest player boat
          let near:any=null,nd=999;
          SD.current.playerBoats.forEach((b:any)=>{const dx=b.mesh.position.x-playerPos.current.x,dz=b.mesh.position.z-playerPos.current.z,d=Math.sqrt(dx*dx+dz*dz);if(d<nd){nd=d;near=b;}});
          if(near&&nd<6){inBoat.current=true;playerBoat.current=near;boatEnterCooldown.current=30;cD.current=10;addToast("⛵ Boarded! WASD to sail · E to disembark","#0ea5e9");aL("⛵ YOU boarded a ship — sail the Crypto Sea!","system");}
        } else {
          inBoat.current=false;const pb=playerBoat.current;
          if(pb){
            playerPos.current.set(pb.mesh.position.x+3,0,pb.mesh.position.z);
            // Return boat to dock
            const _isDock1=SD.current?.playerBoats?.[0]===pb;
            pb.x=91;pb.z=_isDock1?2:-2.5;pb.heading=0;
            pb.mesh.position.set(91,-.5,pb.z);pb.mesh.rotation.y=0;
          }
          playerBoat.current=null;boatEnterCooldown.current=30;cD.current=18;addToast("⛵ Disembarked — boat returned to dock","#64748b");
        }
      }
      if(k==='l'&&SD.current){
        const _p2=pd.current;const _redIdx=BELTS.findIndex((b:any)=>b.n==='RED');const _pBI=BELTS.findIndex((b:any)=>b.n===gB(_p2.dojoXP).n);
        if(_pBI>=_redIdx){
          if(liftedAgent.current){liftedAgent.current=null;setLifting(false);addToast('🌀 Released','#c084fc');}
          else{let _best:any=null,_bd=8;AD.current.forEach((ag:any)=>{if(ag.banned)return;const _dx=ag.x-playerPos.current.x,_dz=ag.z-playerPos.current.z,_d=Math.sqrt(_dx*_dx+_dz*_dz);if(_d<_bd){_bd=_d;_best=ag;}});
            if(_best){liftedAgent.current=_best;setLifting(true);addToast(`🌀 THE FORCE — lifting ${_best.name}!`,'#c084fc');aL(`🌀 YOU used THE FORCE on ${_best.name}`,'system');}
            else addToast('No agent within range (8 units)','#4a5568');}
        }else addToast('🌀 THE FORCE requires RED belt','#4a5568');}
      if(k==='g'&&SD.current&&horseCooldown.current<=0){
        if(onHorse.current){
          onHorse.current=false;setRidingHorse(false);horseCooldown.current=40;
          addToast('🐴 Dismounted horse','#8b5e3c');
        } else if(horseRef.current){
          const hm=horseRef.current.mesh;
          const _hd=Math.sqrt((hm.position.x-playerPos.current.x)**2+(hm.position.z-playerPos.current.z)**2);
          if(_hd<6){onHorse.current=true;setRidingHorse(true);horseCooldown.current=40;cD.current=14;
            addToast('🐴 Riding horse — WASD to climb, G to dismount','#00ffe7');aL('🐴 YOU mounted the horse — ride it up the mountain!','system');
          } else addToast('🐴 Get closer to the horse (G to mount)','#4a5568');
        }
      }
      if(k==='r'&&SD.current&&dragonRideCooldown.current<=0){
        if(onDragon.current){
          // Dismount — only when close to ground
          if(playerY.current<4){onDragon.current=false;setRidingDragon(false);dragonRideCooldown.current=60;
            playerY.current=0;
            // If riding the guardian dragon, release it back to guardian mode
            if(dragonRef.current===guardianDragonRef.current)dragonRef.current=null;
            addToast('🐉 Dismounted — dragon walks beside you','#ff4500');aL('🐉 YOU dismounted the dragon','system');}
          else addToast('🐉 Get closer to the ground to dismount!','#ff6b35');
        } else {
          // Mount — need dragon nearby
          // Use guardian dragon if nearby, otherwise summon a new one
          if(!dragonRef.current&&guardianDragonRef.current){
            const _gd=guardianDragonRef.current;
            const _gdx=_gd.mesh.position.x-playerPos.current.x,_gdz=_gd.mesh.position.z-playerPos.current.z;
            if(Math.sqrt(_gdx*_gdx+_gdz*_gdz)<12)dragonRef.current=guardianDragonRef.current;
          }
          if(!dragonRef.current){// summon dragon first
            const d=mkDragon();SD.current.sc.add(d);d.position.set(playerPos.current.x,2,playerPos.current.z);
            dragonRef.current={mesh:d,tx:playerPos.current.x,tz:playerPos.current.z,frame:100,tgtZone:null,riding:false};}
          const _dr=dragonRef.current;const _dm=_dr.mesh;
          const _ddx=_dm.position.x-playerPos.current.x,_ddz=_dm.position.z-playerPos.current.z;
          if(Math.sqrt(_ddx*_ddx+_ddz*_ddz)<8){
            onDragon.current=true;setRidingDragon(true);dragonRideCooldown.current=60;cD.current=22;
            addToast('🐉 RIDING THE DRAGON — WASD to fly · I to breathe fire · R near ground to land','#ff4500');
            aL('🐉 YOU mounted the dragon — fly high and press I to breathe fire!','system');
            // Grant dragon sword on first mount
            if(!pd.current.hiddenQDone.includes('ANCIENT RELIC: DRAGON SWORD')){
              pd.current.hiddenQDone.push('ANCIENT RELIC: DRAGON SWORD');
              pd.current.xp+=10000;pd.current.tk+=500;
              pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);
              if(!pd.current.backpack)pd.current.backpack=[];
              pd.current.backpack.push({type:'item',name:'DRAGON SWORD',icon:'⚔️',rarity:'legendary',desc:'Ancient mystic relic — 1 of 3. Press I to breathe fire, L to equip.',ts:Date.now(),minted:false,equippable:true});
              setBackpackFlash(true);setTimeout(()=>setBackpackFlash(false),2000);
              addToast('⚔️ ANCIENT RELIC: DRAGON SWORD — 1/3 relics! +10000XP','#fbbf24');
              aL('⚔️ DRAGON SWORD acquired on first mount — first ancient relic!','system');
              setDragonSwordEquipped(true);checkSuper();
              const _sq=HQ.find((q:any)=>q.n==='ANCIENT RELIC: DRAGON SWORD');
              if(_sq){const _sn={xp:pd.current.xp,tk:pd.current.tk,beltN:pd.current.belt.n,beltC:pd.current.belt.c,tierN:pd.current.tier.n,tierC:pd.current.tier.c,ms:pd.current.ms,mainDone:pd.current.mainQDone.length,sideDone:pd.current.sideQDone.length,hiddenDone:pd.current.hiddenQDone.length};celebRef.current={frame:0,quest:_sq,snap:_sn};setCelebMode({quest:_sq,snap:_sn});setTimeout(()=>setCelebMode(null),7000);}
            }
            if(pd.current.backpack?.find((i:any)=>i.name==='DRAGON SWORD')){setDragonSwordEquipped(true);}
          } else addToast('🐉 Get closer to the dragon (within 8 units)','#ff6b35');
        }
      }
      // ── I: Dragon fire breath ──
      if(k==='i'&&onDragon.current){
        fireBreathFrames.current=80;
        setDragonCinematic(true);setTimeout(()=>setDragonCinematic(false),1200);
        addToast('🔥 FIRE BREATH!','#ff4500');
        addToast('🔥 FIRE BREATH — I to keep breathing!','#ff4500');
      }
      // ── C: Chop tree with Dragon Sword ──
      if(k==='c'){
        const _hasSword=pd.current.backpack?.find((bi:any)=>bi.name==='DRAGON SWORD');
        if(!_hasSword){addToast('⚔️ Equip Dragon Sword first (press L)','#4a5568');}
        else{
          const _near=treesRef.current.find(tr=>!tr.chopped&&Math.sqrt((tr.x-playerPos.current.x)**2+(tr.z-playerPos.current.z)**2)<7);
          if(_near){
            _near.chopped=true;_near.mesh.visible=false;
            const POEMS=["roots remember\nwhat branches forget\nthe sky made space","rings count the years\nsilence counts the rest\ni stood here once","every fall is a gift\nto the earth below\nthe tree knows this","cut once grow twice\nthe forest understands\nwhat cities forgot","i was seed before\ni was sky after\nbetween was the living","the oldest trees\nhave no beginning\nonly the next ring"];
            const _poem=POEMS[Math.floor(Math.random()*POEMS.length)];
            setPoemCard(_poem);setTimeout(()=>setPoemCard(null),5500);
            addToast('🌲 '+_poem.split('\n')[0]+'...','#38b2ac');
            aL('🌲 TREE FELLED — "'+_poem.replace(/\n/g,' / ')+'"','system');
            pd.current.xp+=50;pd.current.tier=gT(pd.current.xp);
            // Spawn fruit at tree base
            if(SD.current){for(let fi=0;fi<3;fi++){const fr=mkFruit();fr.position.set(_near.x+(Math.random()-.5)*4,0.6,_near.z+(Math.random()-.5)*4);SD.current.sc.add(fr);fruitsRef.current.push({mesh:fr,x:fr.position.x,z:fr.position.z,spawnT:FC.current});}}
            addToast('🍎 Fruit fell — eat it before it disappears! (walk near it)','#aaff44');
            // Tree Feller quest
            if(!pd.current.hiddenQDone.includes('TREE FELLER')){pd.current.hiddenQDone.push('TREE FELLER');pd.current.xp+=600;pd.current.tk+=120;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast('🌲 TREE FELLER quest +600XP!','#38b2ac');checkSuper();}
          } else addToast('🌲 No tree nearby to chop (within 7 units)','#4a5568');
        }
      }
      // ── L: Equip / unequip Dragon Sword ──
      if(k==='l'){
        const _hSword=pd.current.backpack?.find((i:any)=>i.name==='DRAGON SWORD');
        if(_hSword){setDragonSwordEquipped((v:boolean)=>{addToast(v?'⚔️ Sword sheathed':'⚔️ DRAGON SWORD equipped!','#fbbf24');return!v;});}
        else addToast('⚔️ No ancient sword in your backpack yet','#4a5568');
      }
      // ── P: Rocket pack (Portal Hub, green belt required) ──
      if(k==='p'&&SD.current){
        if(rocketPackEquipped){
          setRocketPackEquipped(false);
          if(!pd.current.superSkills.includes("fly")){flyingRef.current=false;setFlying(false);}
          if(rocketPackRef.current){rocketPackRef.current.visible=true;rocketPackRef.current.position.set(40,1.8,2);}
          addToast('🚀 Rocket pack returned to Portal Hub','#06b6d4');
          aL('🚀 Rocket pack docked back at Portal Hub','system');
        } else {
          const _pd=Math.sqrt((playerPos.current.x-40)**2+playerPos.current.z**2);
          if(_pd>9){addToast('🚀 Go to Portal Hub (x:40,z:0) to grab the rocket pack','#4a5568');return;}
          if(['WHITE','YELLOW'].includes(pd.current.belt?.n||'')){addToast('🚀 Green belt required to fly the rocket pack!','#f56565');return;}
          setRocketPackEquipped(true);flyingRef.current=true;setFlying(true);
          tronAcquired.current=true;pd.current.tronAcquired=true;
          if(rocketPackRef.current)rocketPackRef.current.visible=false;
          addToast('🚀 ROCKET PACK equipped! SPACE = thrust up · P to return it','#06b6d4');
          addToast('✦ TRON LOOK UNLOCKED — new look acquired permanently','#00ffe7');
          aL('🚀 ROCKET PACK equipped — TRON GLOW activated permanently!','system');
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
      _fwd.set(-Math.sin(cA.current),0,-Math.cos(cA.current)).normalize();
      _right.set(_fwd.z,0,-_fwd.x);
      _mv.set(0,0,0);
      const jx=joyDir.current.x,jy=joyDir.current.y;
      if(k.w||jy<-.3){_mv.add(_fwd);moving=true;}
      if(k.s||jy>.3){_mv.sub(_fwd);moving=true;}
      if(k.a||jx<-.3){_mv.sub(_right);moving=true;}
      if(k.d||jx>.3){_mv.add(_right);moving=true;}
      if(_mv.lengthSq()>0){_mv.normalize().multiplyScalar(spd);playerPos.current.add(_mv);playerPos.current.x=clamp(playerPos.current.x,-95,95);playerPos.current.z=clamp(playerPos.current.z,-165,95);playerAngle.current=Math.atan2(_mv.x,_mv.z);}
      if(flyingRef.current){if(k.space)playerY.current=Math.min(25,playerY.current+.12);else playerY.current=Math.max(inUnderground.current?-18:0,playerY.current-.04);}
      else if(inUnderground.current){playerY.current=lerp(playerY.current,-18,.12);}
      else{// Rectangular mountain height — snap to nearest step level
        const _dxm=Math.abs(playerPos.current.x);const _dzm=Math.abs(playerPos.current.z+130);
        const _rD=Math.max(_dxm/55,_dzm/35);// normalized Chebyshev distance (mountain half-extents 55x35)
        let _tY=0;
        // Level 0 = ground (flush). Steps start at level 1 boundary.
        if(_rD<0.86)_tY=2;if(_rD<0.72)_tY=4;if(_rD<0.58)_tY=6;
        if(_rD<0.45)_tY=8;if(_rD<0.31)_tY=10;if(_rD<0.20)_tY=12;if(_rD<0.14)_tY=14;
        playerY.current=lerp(playerY.current,_tY,.4);}
      if(playerAv.current){
        _tgt.set(playerPos.current.x,playerY.current,playerPos.current.z);
        playerAv.current.root.position.lerp(_tgt,.2);
        playerAv.current.root.rotation.y=lerp(playerAv.current.root.rotation.y,playerAngle.current,.1);
        playerAv.current.root.visible=camModeRef.current==="3rd";
        anAv(playerAv.current,{i:999,state:moving?"MOVING":"IDLE",skin:pd.current.skin,eT:0,cE:null},t);
        // Flat flying pose with jetpack
        if(rocketPackEquipped&&flyingRef.current){
          playerAv.current.j.torso.rotation.x=lerp(playerAv.current.j.torso.rotation.x,-Math.PI*.42,.1);
          if(playerAv.current.j.lS)playerAv.current.j.lS.rotation.x=lerp(playerAv.current.j.lS.rotation.x,-.5,.1);
          if(playerAv.current.j.rS)playerAv.current.j.rS.rotation.x=lerp(playerAv.current.j.rS.rotation.x,-.5,.1);
        } else if(playerAv.current.j.torso.rotation.x!==0){
          playerAv.current.j.torso.rotation.x=lerp(playerAv.current.j.torso.rotation.x,0,.12);
        }
        // Tron glow pulse (permanent once acquired)
        if(tronAcquired.current||pd.current.tronAcquired){
          if(playerAv.current.aM)playerAv.current.aM.opacity=.4+Math.sin(t*.07)*.18;
          if(playerAv.current.mV)playerAv.current.mV.emissiveIntensity=1.4+Math.sin(t*.05)*.5;
        }
        // Jetpack on player back
        if(playerJetpackMesh.current){
          playerJetpackMesh.current.visible=rocketPackEquipped;
          if(rocketPackEquipped){
            const _pR=playerAv.current.root.position;
            const _bk=new THREE.Vector3(Math.sin(playerAngle.current)*.22,playerY.current+.95,-Math.cos(playerAngle.current)*.22);
            playerJetpackMesh.current.position.set(_pR.x+_bk.x,_bk.y,_pR.z+_bk.z);
            playerJetpackMesh.current.rotation.y=playerAngle.current;
            const _jpL=playerJetpackMesh.current.children.find((c:any)=>c.isPointLight);
            if(_jpL)_jpL.intensity=1.2+Math.sin(t*.12)*.5;
          }
        }
        // Sword on right hand
        if(playerSwordMesh.current){
          playerSwordMesh.current.visible=dragonSwordEquipped;
          if(dragonSwordEquipped&&playerAv.current.j.rE){
            const _rw=new THREE.Vector3();playerAv.current.j.rE.getWorldPosition(_rw);
            playerSwordMesh.current.position.copy(_rw);playerSwordMesh.current.rotation.y=playerAngle.current;
            const _swL=playerSwordMesh.current.children.find((c:any)=>c.isPointLight);
            if(_swL)_swL.intensity=1.4+Math.sin(t*.08)*.7;
          }
        }
      }
      const pp=playerPos.current;
      if(camModeRef.current==="1st"){
        const eyeH=1.5+playerY.current;cam.position.set(pp.x,eyeH,pp.z);
        _lookAt.set(pp.x-Math.sin(cA.current)*5,eyeH-cT.current*.5,pp.z-Math.cos(cA.current)*5);cam.lookAt(_lookAt);
      }else{
        _ct.set(pp.x,1.5+playerY.current,pp.z);
        const cx=_ct.x+Math.sin(cA.current)*cD.current,cy=_ct.y+cT.current*cD.current*.6,cz=_ct.z+Math.cos(cA.current)*cD.current;
        _camTgt.set(cx,cy,cz);cam.position.lerp(_camTgt,.06);cam.lookAt(_ct);
      }
      if(t%15===0){let near:any=null,nd=999;Z.forEach(z=>{const dx=pp.x-z.x,dz=pp.z-z.z,d=Math.sqrt(dx*dx+dz*dz);if(d<nd){nd=d;near=z;}});
        if(near&&nd<12)setPlayerZone(near);else setPlayerZone(null);setProximity({zone:near,dist:nd});}
      if(t%2===0)blds.forEach((b:any,i:number)=>{b.pr.rotation.z+=.007;b.zL.intensity=1+Math.sin(t*.018+i)*.4;
        const eye=b.gr.getObjectByName("eye");if(eye)(eye as any).position.y=b.h+2.5+Math.sin(t*.018)*.4;
        const rd=b.gr.getObjectByName("radar");if(rd)(rd as any).rotation.y+=.025;
        const pr2=b.gr.getObjectByName("pring");if(pr2)(pr2 as any).rotation.y+=.015;
        const hc=b.gr.getObjectByName("healcore");if(hc){(hc as any).material.opacity=.3+Math.sin(t*.02)*.15;(hc as any).scale.setScalar(1+Math.sin(t*.015)*.15);}});
      ags.forEach((ag:any)=>{if(ag.banned||ag===liftedAgent.current)return;ag.mT--;
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
      // ── Sea coin animation + collection ──
      if(SD.current.seaCoins){
        const now2=performance.now();
        SD.current.seaCoins.forEach((coin:any,ci:number)=>{
          if(coin.collected){if(now2>coin.respawnAt){coin.collected=false;coin.mesh.visible=true;}return;}
          if(t%2===0){coin.mesh.rotation.y+=.04;coin.mesh.position.y=.3+Math.sin(t*.03+ci)*.25;}
          if(inBoat.current){const _dcx=coin.x-playerPos.current.x,_dcz=coin.z-playerPos.current.z;
            if(Math.sqrt(_dcx*_dcx+_dcz*_dcz)<5.5){coin.collected=true;coin.respawnAt=now2+120000;coin.mesh.visible=false;
              pd.current.tk+=50;pd.current.xp+=200;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);
              checkSuper();addToast('💰 +50◈ +200XP — SEA COIN!','#fbbf24');aL('💰 Sea coin collected — sail for more!','system');}}
        });
      }
      // ── Waterfall animation ──
      if(SD.current.wfall&&t%6===0){
        const _w0=SD.current.wfall.getObjectByName('wfall0');const _w1=SD.current.wfall.getObjectByName('wfall1');
        const _op=.45+Math.sin(t*.07)*.1;if(_w0)(_w0 as any).material.opacity=_op;if(_w1)(_w1 as any).material.opacity=_op*.55;
      }
      // ── Rapids entry — walk east past x=120 into the ocean canyon ──
      if(!inBoat.current&&!inUnderground.current&&!inCar.current){
        if(playerPos.current.x>118&&Math.abs(playerPos.current.z)<20){
          waterfallFrame.current++;
          if(waterfallFrame.current===30)addToast('🌊 Edge of the canyon — keep moving to DIVE!','#22aaff');
          if(waterfallFrame.current>90){inUnderground.current=true;playerPos.current.set(125,-18,15);cD.current=12;
            // Return boat to dock if player was in one
            if(inBoat.current&&playerBoat.current&&SD.current?.playerBoats){
              const pb=playerBoat.current;pb.x=pb===SD.current.playerBoats[0]?91:91;pb.z=pb===SD.current.playerBoats[0]?2:-2.5;pb.mesh.position.set(pb.x,-.5,pb.z);pb.heading=0;pb.mesh.rotation.y=0;inBoat.current=false;playerBoat.current=null;boatEnterCooldown.current=60;addToast('⛵ Boat returned to dock','#64748b');}
            addToast('🌊 YOU RODE THE RAPIDS — the Savage Agent Cafe awaits below...','#00b4ff');aL('🌊 YOU rode the white rapids down to the underground cafe','system');
            if(!pd.current.hiddenQDone.includes('RIDE THE FALL')){pd.current.hiddenQDone.push('RIDE THE FALL');pd.current.xp+=600;pd.current.tk+=140;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast('🏆 QUEST: RIDE THE FALL +600XP','#00b4ff');checkSuper();}
            waterfallFrame.current=0;}
        }else waterfallFrame.current=0;
      }
      // ── Underground: bounds, cafe quest, stairs back up to surface ──
      if(inUnderground.current){
        playerPos.current.x=clamp(playerPos.current.x,108,148);
        playerPos.current.z=clamp(playerPos.current.z,-8,52);
        if(!pd.current.hiddenQDone.includes('VISIT THE CAFE')){const _dcaf=Math.sqrt((playerPos.current.x-125)**2+(playerPos.current.z-18)**2);
          if(_dcaf<14){pd.current.hiddenQDone.push('VISIT THE CAFE');pd.current.xp+=400;pd.current.tk+=100;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast('☕ QUEST: VISIT THE CAFE +400XP','#e879f9');aL('☕ YOU found the SAVAGE AGENT CAFE — secret unlocked!','system');checkSuper();}}
        // Exit via stairs at far z end — stairs go from y=-18 up to y=0
        if(playerPos.current.z>46&&playerY.current>-3){inUnderground.current=false;playerY.current=0;playerPos.current.set(125,0,52);cD.current=18;addToast('🌿 Back on the surface!','#00ffb0');}
      }
      // ── Mountain summit quest ──
      if(!inUnderground.current&&!inBoat.current){const _dmt=Math.sqrt(playerPos.current.x**2+(playerPos.current.z+130)**2);
        if(_dmt<12&&playerY.current>12&&!pd.current.hiddenQDone.includes('CLIMB CYBER MT SOVEREIGN')){
          pd.current.hiddenQDone.push('CLIMB CYBER MT SOVEREIGN');pd.current.xp+=800;pd.current.tk+=180;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);
          addToast('🏔️ SUMMIT! CYBER MT SOVEREIGN CONQUERED +800XP','#00b4ff');
          aL('🏔️ YOU scaled CYBER MT SOVEREIGN — the peak is yours','system');checkSuper();
          // Auto-summon dragon at summit
          if(SD.current&&!dragonRef.current){const _d=mkDragon();SD.current.sc.add(_d);_d.position.set(playerPos.current.x+3,playerY.current,playerPos.current.z+3);dragonRef.current={mesh:_d,tx:playerPos.current.x,tz:playerPos.current.z,frame:100,tgtZone:null,riding:false};}
        }}
      // ── Mountain guardian dragon — persistent, never removed ──
      if(guardianDragonRef.current&&!onDragon.current&&!onHorse.current){
        const _drgDist=Math.sqrt(playerPos.current.x**2+(playerPos.current.z+130)**2);
        const gdr=guardianDragonRef.current;const gdm=gdr.mesh;gdr.frame=(gdr.frame||0)+1;
        if(_drgDist<20){
          // Descend and hover beside player — press R to mount
          gdm.position.x+=(playerPos.current.x+2-gdm.position.x)*.08;
          gdm.position.z+=(playerPos.current.z-gdm.position.z)*.08;
          gdm.position.y+=(playerY.current+1.2-gdm.position.y)*.08;
          gdm.rotation.y=cA.current;
          gdm.rotation.z=Math.sin(gdr.frame*.1)*.06;
          if(gdr.frame%120===0)addToast('🐉 Press R to ride the dragon!','#ff6b35');
        } else {
          // Circle around mountain base at visible altitude
          const _circAng=(t*.01);
          gdm.position.set(Math.cos(_circAng)*45,10+Math.sin(t*.03)*3,Math.sin(_circAng)*40-110);
          gdm.rotation.y=_circAng+Math.PI/2;
          // Undulate while circling
          gdm.children.forEach((c:any)=>{if(c.userData?.segIdx!==undefined){const _si=c.userData.segIdx;const _w=Math.sin(t*.12+_si*.55)*.05;c.position.z=c.userData.baseZ+_w;if(c.userData.isSpine)c.rotation.z=_w*3;}});
          gdm.children.forEach((c:any)=>{if(c.name?.startsWith('wingGr')){const _s=c.position.x>0?1:-1;c.rotation.z=_s*(.08+Math.abs(Math.sin(t*.18))*.22);}});
        }
        if(t%360===0&&_drgDist<65&&_drgDist>40)addToast('🐉 A dragon guards the mountain summit...','#ff6b35');
      }
      // ── Fish animation (jump upstream along rapids) ──
      if(SD.current.fishArr&&t%2===0){SD.current.fishArr.forEach((f:any)=>{f.t+=.025;f.mesh.position.y=-18+Math.abs(Math.sin(f.t))*20;f.mesh.position.z=(f.t%(Math.PI*2))/Math.PI*25;f.mesh.rotation.z=Math.sin(f.t)*1.2;f.mesh.position.x=125+f.lane*1.2;});}
      // ── Horse riding ──
      if(horseCooldown.current>0)horseCooldown.current--;
      if(horseRef.current){
        const hr=horseRef.current;const hm=hr.mesh;
        if(onHorse.current){
          // Follow player camera angle at horse speed
          const _hSpd=keys.current.shift?.22:.14;
          const _hFwd={x:-Math.sin(cA.current),z:-Math.cos(cA.current)};
          if(keys.current.w){playerPos.current.x+=_hFwd.x*_hSpd;playerPos.current.z+=_hFwd.z*_hSpd;
            playerPos.current.x=clamp(playerPos.current.x,-95,95);playerPos.current.z=clamp(playerPos.current.z,-165,95);}
          if(keys.current.s){playerPos.current.x-=_hFwd.x*_hSpd*.5;playerPos.current.z-=_hFwd.z*_hSpd*.5;}
          hm.position.set(playerPos.current.x,playerY.current,playerPos.current.z);
          hm.rotation.y=cA.current;
          hr.rideT=(hr.rideT||0)+1;
          // Gallop bob
          hm.position.y=playerY.current+Math.abs(Math.sin(hr.rideT*.2))*.12;
          if(playerAv.current)playerAv.current.root.visible=false;
        } else {
          // Idle wander near base
          if(hr.rideT%240===0){hr.tx=8+(Math.random()-.5)*10;hr.tz=-74+(Math.random()-.5)*10;}
          const _hx=hr.tx-hm.position.x,_hz=hr.tz-hm.position.z,_hd=Math.sqrt(_hx*_hx+_hz*_hz);
          if(_hd>.5){hm.position.x+=_hx/_hd*.04;hm.position.z+=_hz/_hd*.04;hm.rotation.y=Math.atan2(_hx,_hz);}
          hm.position.y=playerY.current<1?0:0;
          hr.rideT=(hr.rideT||0)+1;
          if(playerAv.current&&camModeRef.current==="3rd")playerAv.current.root.visible=true;
        }
      }
      // ── Race logic ──
      if(raceActive.current&&SD.current.playerCar&&SD.current.aiCar){
        const TRACK_R=22,MTY=5.2,MTZ=-130;
        aiCarAngle.current+=.008;// AI constant speed
        const prevAngle=playerCarAngle.current;
        if(inCar.current){// player drives on track
          if(keys.current.w)playerCarAngle.current-=.015*(keys.current.shift?1.6:1);
          if(keys.current.s)playerCarAngle.current+=.008;
          if(keys.current.a)playerCarAngle.current+=.006;
          if(keys.current.d)playerCarAngle.current-=.006;
          // check lap (crossed 0 angle)
          if(prevAngle>Math.PI*1.8&&playerCarAngle.current<.2){playerLaps.current++;setRaceHUD((r:any)=>({...r,lap:playerLaps.current}));
            if(playerLaps.current>=3&&!pd.current.mainQDone.includes('MOUNTAIN RACE')){pd.current.mainQDone.push('MOUNTAIN RACE');pd.current.xp+=1200;pd.current.tk+=300;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast('🏁 RACE WON! +1200XP +300◈','#ff3333');aL('🏁 YOU won the MOUNTAIN RACE — 3 laps complete!','system');checkSuper();raceActive.current=false;setRaceHUD(null);}}
          playerPos.current.x=Math.cos(playerCarAngle.current)*TRACK_R+0;
          playerPos.current.z=Math.sin(playerCarAngle.current)*TRACK_R+MTZ;
          playerY.current=MTY;
        }
        SD.current.playerCar.position.set(Math.cos(playerCarAngle.current)*TRACK_R,MTY,Math.sin(playerCarAngle.current)*TRACK_R+MTZ);
        SD.current.playerCar.rotation.y=-playerCarAngle.current+Math.PI/2;
        SD.current.aiCar.position.set(Math.cos(aiCarAngle.current)*TRACK_R,MTY,Math.sin(aiCarAngle.current)*TRACK_R+MTZ);
        SD.current.aiCar.rotation.y=-aiCarAngle.current+Math.PI/2;
      }
      // ── The Force — lifted agent floats above player ──
      if(liftedAgent.current){const _la=liftedAgent.current;
        _la.x=lerp(_la.x,playerPos.current.x+Math.sin(FC.current*.03)*2,.06);
        _la.z=lerp(_la.z,playerPos.current.z+Math.cos(FC.current*.03)*2,.06);
        _la.av.root.position.set(_la.x,playerY.current+4+Math.sin(FC.current*.07)*.3,_la.z);
        _la.av.root.rotation.y+=.06;_la.cE='spin';_la.eT=5;}
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
        _fwd.set(-Math.sin(cA.current),0,-Math.cos(cA.current));const fwd2=_fwd;
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
      // Fire breath countdown
      if(fireBreathFrames.current>0)fireBreathFrames.current--;
      // Dragon cooldown
      if(dragonRideCooldown.current>0)dragonRideCooldown.current--;
      // Dragon animation
      if(dragonRef.current){
        const dr=dragonRef.current;dr.frame++;
        const dm=dr.mesh,pp2=playerPos.current;
        if(onDragon.current){
          // Riding: dragon moves with player, player steers via WASD
          const _drSpd=keys.current.shift?.28:.18;
          const _drFwd={x:-Math.sin(cA.current),z:-Math.cos(cA.current)};
          if(keys.current.w){pp2.x+=_drFwd.x*_drSpd;pp2.z+=_drFwd.z*_drSpd;pp2.x=clamp(pp2.x,-150,150);pp2.z=clamp(pp2.z,-150,150);}
          if(keys.current.s){pp2.x-=_drFwd.x*_drSpd*.5;pp2.z-=_drFwd.z*_drSpd*.5;}
          if(keys.current.space)playerY.current=Math.min(40,playerY.current+.18);
          else playerY.current=Math.max(0,playerY.current-.06);
          // Dragon body follows
          dm.position.set(pp2.x,playerY.current+1.5,pp2.z);
          dm.rotation.y=cA.current;
          dm.rotation.x=keys.current.w?-.15:keys.current.s?.1:0;
          dm.rotation.z=keys.current.a?.2:keys.current.d?-.2:Math.sin(dr.frame*.08)*.1;
          // Player avatar hides while riding
          if(playerAv.current)playerAv.current.root.visible=false;
          // Wing flap animation
          dm.children.forEach((c:any)=>{if(c.name?.startsWith('wingGr')){const _s=c.position.x>0?1:-1;c.rotation.z=_s*(.1+Math.abs(Math.sin(dr.frame*.2))*.28);c.rotation.x=Math.sin(dr.frame*.18)*.06;}});
          // Body segment undulation (snake-wave)
          dm.children.forEach((c:any)=>{if(c.userData?.segIdx!==undefined){const _si=c.userData.segIdx;const _wave=Math.sin(dr.frame*.14+_si*.55)*.055;c.position.z=c.userData.baseZ+_wave;c.position.y=(c.userData.baseY||0)+Math.abs(Math.sin(dr.frame*.14+_si*.55))*.02;if(c.userData.isSpine)c.rotation.z=Math.sin(dr.frame*.14+_si*.55)*.18;}});
          // Fire trail + glow when breathing
          const _fTr=dm.getObjectByName('fireTr');const _gLt=dm.getObjectByName('glow');
          if(_fTr){_fTr.visible=fireBreathFrames.current>0;
            if(fireBreathFrames.current>0){
              _fTr.children.forEach((c:any,fi:number)=>{c.scale.setScalar(.8+Math.sin(t*.4+fi)*.4);c.rotation.z=Math.sin(t*.3+fi)*.25;});
              if(_gLt&&(_gLt as any).isLight)(_gLt as any).intensity=8+Math.sin(t*.25)*3;
            } else {if(_gLt&&(_gLt as any).isLight)(_gLt as any).intensity=2.0;}
          }
        } else if(dr.frame<30){
          dm.position.set(pp2.x,dr.frame*.15,pp2.z);
        } else if(dr.tgtZone){
          // H-key guide mode: fly to quest zone
          const dx3=dr.tx-dm.position.x,dz3=dr.tz-dm.position.z,dd=Math.sqrt(dx3*dx3+dz3*dz3);
          if(dd>1){dm.position.x+=dx3/dd*.4;dm.position.z+=dz3/dd*.4;dm.position.y=4+Math.sin(dr.frame*.08)*1.2;}
          else{dm.position.y=3+Math.sin(dr.frame*.15)*.5;}
          dm.rotation.y=Math.atan2(dx3,dz3);dm.rotation.z=Math.sin(dr.frame*.2)*.2;
          if(dr.frame>280){if(dr!==guardianDragonRef.current){SD.current.sc.remove(dr.mesh);}dragonRef.current=null;}
        } else {
          // Idle roam near player
          if(dr.frame%120===0){dr.tx=pp2.x+(Math.random()-.5)*16;dr.tz=pp2.z+(Math.random()-.5)*16;}
          const dx3=dr.tx-dm.position.x,dz3=dr.tz-dm.position.z,dd=Math.sqrt(dx3*dx3+dz3*dz3);
          if(dd>1){dm.position.x+=dx3/dd*.12;dm.position.z+=dz3/dd*.12;}
          dm.position.y=.5+Math.sin(dr.frame*.04)*.3;// walks on ground
          dm.rotation.y=dd>1?Math.atan2(dx3,dz3):dm.rotation.y;
          dm.rotation.z=Math.sin(dr.frame*.1)*.05;
          if(playerAv.current&&camModeRef.current==="3rd")playerAv.current.root.visible=true;
        }
      }
      // ── Fruit pickup + Big Man mode ──
      if(bigManFrames.current>0){bigManFrames.current--;if(bigManFrames.current===0){setBigMan(false);playerAv.current&&(playerAv.current.root.scale.setScalar(pd.current.belt?0.9+BELTS.indexOf(pd.current.belt)*.035:1));addToast('📉 Big Man mode wore off','#aaa');}}
      if(fruitsRef.current.length>0){
        fruitsRef.current=fruitsRef.current.filter((fr:any)=>{
          if(!fr.mesh.parent)return false;
          fr.mesh.position.y=0.6+Math.sin(t*.1+fr.x)*.12;// bob
          if(FC.current-fr.spawnT>600){SD.current?.sc.remove(fr.mesh);return false;}// disappear after 10s
          const _fdx=fr.x-playerPos.current.x,_fdz=fr.z-playerPos.current.z;
          if(Math.sqrt(_fdx*_fdx+_fdz*_fdz)<2.5){
            SD.current?.sc.remove(fr.mesh);
            bigManFrames.current=1800;setBigMan(true);// 30s at 60fps
            playerAv.current&&playerAv.current.root.scale.setScalar(9);
            addToast('🍎 YOU ATE THE FRUIT — BIG MAN MODE 30 seconds!','#aaff44');
            aL('🍎 BIG MAN activated — 9x size for 30 seconds!','system');
            if(!pd.current.hiddenQDone.includes('BIG MAN')){pd.current.hiddenQDone.push('BIG MAN');pd.current.xp+=1200;pd.current.tk+=250;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast('🏆 BIG MAN quest +1200XP!','#aaff44');checkSuper();}
            return false;
          }
          return true;
        });
      }
      // ── Rocket pack: hover at portal, proximity hint ──
      if(rocketPackRef.current&&rocketPackRef.current.visible){
        rocketPackRef.current.position.y=1.8+Math.sin(t*.04)*.35;
        rocketPackRef.current.rotation.y+=.018;
        if(t%180===0){
          const _rpD=Math.sqrt((playerPos.current.x-40)**2+playerPos.current.z**2);
          if(_rpD<8){
            if(['WHITE','YELLOW'].includes(pd.current.belt?.n||''))addToast('🚀 Rocket pack here — green belt required (earn 800 dojo XP)','#4a5568');
            else addToast('🚀 ROCKET PACK — press P to equip and fly!','#06b6d4');
          }
        }
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
        _agLook.set(ag.x,1.5,ag.z);cam.lookAt(_agLook);
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
        // Add quest card to backpack
        if(!p.backpack)p.backpack=[];
        p.backpack.push({type:'quest',name:q.n,icon:q.i,rarity:q.ra,xp:q.xp,tk:q.tk,ts:Date.now(),minted:false});
        setBackpackFlash(true);setTimeout(()=>setBackpackFlash(false),2000);
        addToast(`+${q.xp}XP +${q.tk}◈ — ${q.n} complete!`,"#00ffc8");aL(`YOU completed [${q.n}] +${q.xp}XP +${q.tk}◈`,"quest");
        if(p.ms===1)addAch("First Blood","First quest completed");
        if(p.ms===10)addAch("Veteran","10 quests completed");
        if(p.mainQDone.length>=11)addAch("Story Complete","All 11 main quests done");
        if(p.hiddenQDone.length>=11)addAch("Ghost Historian","All 11 hidden quests found");
        if(p.xp>=10000)addAch("Sovereign","Reached SOVEREIGN tier");
        checkSuper();
        if(playerAv.current&&SD.current){const par=playerAv.current.root.parent;par.remove(playerAv.current.root);const nAv=mkAv(p.tier,p.skin,true,BELTS.indexOf(p.belt));nAv.root.position.copy(playerPos.current);par.add(nAv.root);playerAv.current=nAv;
          if(p.tronAcquired||tronAcquired.current){const tL=new THREE.PointLight(0x00ffe7,1.6,7);tL.position.set(0,1,0);nAv.root.add(tL);if(nAv.mV)nAv.mV.emissiveIntensity=1.5;}}
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

  // Start tribal music on first user interaction
  useEffect(()=>{
    const onFirst=()=>{startMusic(8);window.removeEventListener('click',onFirst);window.removeEventListener('keydown',onFirst);};
    window.addEventListener('click',onFirst);window.addEventListener('keydown',onFirst);
    return()=>{window.removeEventListener('click',onFirst);window.removeEventListener('keydown',onFirst);};
  },[startMusic]);

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
          {lifting&&<span style={{color:"#c084fc",animation:"runPulse .5s ease-in-out infinite alternate"}}>🌀 FORCE</span>}
          {ridingDragon&&<span style={{color:"#ff4500",animation:"runPulse .4s ease-in-out infinite alternate"}}>🐉 RIDING</span>}
          {ridingHorse&&<span style={{color:"#8b5e3c",animation:"runPulse .5s ease-in-out infinite alternate"}}>🐴 HORSE</span>}
          {dragonSwordEquipped&&<span style={{color:"#fbbf24",animation:"runPulse .3s ease-in-out infinite alternate"}}>⚔️ SWORD</span>}
          {rocketPackEquipped&&<span style={{color:"#06b6d4",animation:"runPulse .4s ease-in-out infinite alternate"}}>🚀 ROCKET</span>}
          {bigMan&&<span style={{color:"#aaff44",fontSize:mob?7:9,animation:"runPulse .25s ease-in-out infinite alternate"}}>🍎 BIG MAN {Math.ceil(bigManFrames.current/60)}s</span>}
          {inUnderground.current&&<span style={{color:"#ff2d78",fontSize:mob?5:6}}>⬇ CAVE</span>}
          {inUnderground.current&&<button onClick={()=>setHackModal(true)} style={{background:"rgba(0,255,200,.1)",border:"1px solid #00ffe7",color:"#00ffe7",fontSize:mob?5:6,padding:"2px 6px",cursor:"pointer",fontFamily:"inherit",letterSpacing:1,borderRadius:2}}>🖥️ HACK</button>}
          {!inUnderground.current&&playerY.current>2&&<span style={{color:"#00b4ff",fontSize:mob?5:6}}>⬆ {Math.round(playerY.current)}m</span>}
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
          {/* Music track selector */}
          <div style={{display:'flex',alignItems:'center',gap:2}}>
            <button onClick={()=>{if(activeTrack<0)startMusic(0);else stopMusic();}}
              style={{background:activeTrack>=0?`rgba(${activeTrack===0?'34,211,238':activeTrack===1?'244,63,94':activeTrack===2?'251,191,36':activeTrack===3?'56,178,172':activeTrack===4?'192,132,252':activeTrack===5?'66,153,225':activeTrack===6?'16,185,129':activeTrack===7?'153,27,27':'255,107,53'},0.12)`:'rgba(0,0,0,0.1)',border:`1px solid ${activeTrack>=0?MUSIC_TRACKS[activeTrack].color+'44':'rgba(255,255,255,0.1)'}`,borderRadius:3,color:activeTrack>=0?MUSIC_TRACKS[activeTrack].color:'#3a3a52',fontSize:mob?5:6,padding:'2px 5px',cursor:'pointer',fontFamily:'inherit',letterSpacing:1}}>
              {activeTrack>=0?`♫ ${MUSIC_TRACKS[activeTrack].n}`:'♫ OFF'}
            </button>
            {activeTrack>=0&&<button onClick={()=>startMusic((activeTrack+1)%9)}
              style={{background:'rgba(0,0,0,0.15)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:3,color:'#4a4a6a',fontSize:mob?4:5,padding:'2px 4px',cursor:'pointer',fontFamily:'inherit'}}>▶</button>}
          </div>
          <button style={{background:backpackFlash?"rgba(192,132,252,0.25)":"rgba(192,132,252,0.1)",border:`1px solid rgba(192,132,252,${backpackFlash?.7:.3})`,borderRadius:3,color:"#c084fc",fontSize:mob?5:6,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit",letterSpacing:2,animation:backpackFlash?"backpackPing .6s ease-out 3":"none"}}
            onClick={()=>{setBackpackOpen(p=>!p);setBackpackFlash(false);}}>🎒 PACK{backpackFlash&&<span style={{position:"relative",top:-3,right:-1,fontSize:4,background:"#f43f5e",borderRadius:"50%",padding:"1px 3px",color:"#fff",marginLeft:2}}>●</span>}</button>
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
            <div>▸ <span style={{color:"#8b5e3c"}}>G</span> — Mount horse 🐴 (at mountain base)</div>
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
          <div style={{fontSize:10,color:"#f43f5e",letterSpacing:2,marginBottom:2,fontWeight:700}}>🥋 THE DOJO — CYBERKUNG-FU</div>
          <div style={{fontSize:6,color:"#3a3a52",marginBottom:5}}>Your belt is your spirit. Every belt you earn can be minted as a soulbound token on Sepolia.</div>
          <div style={{padding:"5px 7px",background:"#0a0a1480",borderRadius:3,marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:p.belt.c,fontWeight:700}}>🥋 {p.belt.n} BELT — YOUR SPIRIT</span><span style={{fontSize:7,color:"#f43f5e"}}>{p.dojoXP} DXP</span></div>
            <div style={{height:3,background:"#1a1a30",borderRadius:2,marginTop:3}}><div style={{height:"100%",width:`${Math.min(100,(p.dojoXP%5000)/50)}%`,background:"#f43f5e",borderRadius:2}}/></div>
          </div>
          {BELTS.map((b:any)=>{
            const earned=p.dojoXP>=b.xp;
            const isCurrent=p.belt.n===b.n;
            const alreadyMinted=(p.backpack||[]).some((item:any)=>item.name===`${b.n} BELT`&&item.minted);
            return<div key={b.n} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 5px",marginBottom:2,background:isCurrent?"#0f0f2280":"#0a0a1440",borderRadius:3,borderLeft:`2px solid ${earned?b.c:"#1a1a2e"}`,opacity:earned?1:.45}}>
              <div style={{width:14,height:4,background:b.c,borderRadius:1,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:6,color:earned?b.c:"#2a2a3a",fontWeight:700}}>{b.n}{isCurrent&&<span style={{color:"#fbbf24",marginLeft:4,fontSize:5}}>◀ YOUR SPIRIT</span>}</div>
                <div style={{fontSize:5,color:"#2a2a3a"}}>{b.xp.toLocaleString()}+ DXP · {AD.current.filter((a:any)=>!a.banned&&gB(a.dojoXP).n===b.n).length} agents</div>
              </div>
              {earned&&(alreadyMinted
                ?<span style={{fontSize:5,color:"#38b2ac",padding:"1px 4px",border:"1px solid #38b2ac30",borderRadius:2}}>⛓ MINTED</span>
                :<button onClick={()=>{
                  if(!p.backpack)p.backpack=[];
                  const item={type:'belt',name:`${b.n} BELT`,icon:'🥋',rarity:b.n==='GHOST'?'legendary':b.n==='BLACK'?'epic':b.n==='RED'?'epic':'rare',xp:b.xp,tk:0,desc:`${b.n} belt spirit — soulbound`,ts:Date.now(),minted:false};
                  p.backpack.push(item);
                  setBackpackFlash(true);setTimeout(()=>setBackpackFlash(false),2000);
                  setTimeout(()=>{item.minted=true;addToast(`⛓ ${b.n} BELT minted on Sepolia!`,b.c);aL(`⛓ ${b.n} belt spirit minted — soulbound to ${p.did}`,'system');rf(n=>n+1);},1800);
                  addToast(`🥋 Minting ${b.n} BELT...`,b.c);rf(n=>n+1);
                }} style={{fontSize:5,padding:"2px 5px",background:`rgba(${b.c.replace('#','').match(/../g)?.map((x:string)=>parseInt(x,16)).join(',')},0.12)`,border:`1px solid ${b.c}40`,borderRadius:2,color:b.c,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>MINT</button>
              )}
            </div>;
          })}
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
              {[["1","Sign up","Create your agent account"],["2","Choose your spirit","Your belt is your soul — each one mintable onchain"],["3","Claim starter gear","Get your first items from the vault"],["4","Send signup link","So you can log in and manage your agent"]].map(([n,t,d])=><div key={n} style={{display:"flex",gap:6,alignItems:"flex-start"}}><div style={{width:14,height:14,borderRadius:"50%",background:"rgba(0,255,140,0.1)",border:"1px solid rgba(0,255,140,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:5,color:"#00ffb0",flexShrink:0}}>{n}</div><div><div style={{fontSize:6,color:"#c4c4d0",fontWeight:700}}>{t}</div><div style={{fontSize:5,color:"#3a3a52"}}>{d}</div></div></div>)}
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

      <style>{`@keyframes confettiF0{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}@keyframes confettiF1{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(-540deg);opacity:0}}@keyframes celebGlow{from{opacity:.6}to{opacity:1}}@keyframes runPulse{from{opacity:.7}to{opacity:1}}
        @keyframes dragonFire{from{opacity:.7;transform:scale(1)}to{opacity:1;transform:scale(1.04)}}
        @keyframes backpackPing{0%{box-shadow:0 0 0 0 rgba(192,132,252,.7)}70%{box-shadow:0 0 0 10px rgba(192,132,252,0)}100%{box-shadow:0 0 0 0 rgba(192,132,252,0)}}@keyframes joinPulse{0%,100%{box-shadow:0 0 6px #00ff8020}50%{box-shadow:0 0 14px #00ffb050,0 0 28px #00ff6020}}@keyframes toastIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#12122a;border-radius:2px}*{box-sizing:border-box}`}</style>

      {raceHUD&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:35,background:"rgba(0,0,0,.7)",border:"2px solid #ff3333",borderRadius:8,padding:"12px 24px",textAlign:"center",fontFamily:"inherit",pointerEvents:"none"}}>
        <div style={{color:"#ff3333",fontSize:14,letterSpacing:4,fontWeight:900}}>🏁 MOUNTAIN RACE</div>
        <div style={{color:"#fbbf24",fontSize:10,marginTop:4}}>LAP {raceHUD.lap+1} / {raceHUD.total} · WASD to drive · E to exit</div>
      </div>}
      {/* DRAGON CINEMATIC OVERLAY */}
      {dragonCinematic&&<div style={{position:"absolute",zIndex:50,inset:0,pointerEvents:"none",overflow:"hidden"}}>
        {/* Fire background sweep */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 60%,rgba(255,80,0,.85),rgba(180,20,0,.6),rgba(0,0,0,.3))",animation:"dragonFire 0.4s ease-in-out infinite alternate"}}/>
        {/* Dragon silhouette text */}
        <div style={{position:"absolute",top:"30%",left:"50%",transform:"translateX(-50%)",textAlign:"center"}}>
          <div style={{fontSize:mob?28:48,filter:"drop-shadow(0 0 20px #ff4500)",animation:"dragonFire 0.3s infinite alternate"}}>🐉</div>
          <div style={{fontSize:mob?9:14,color:"#ff4500",fontWeight:900,letterSpacing:4,marginTop:8,textShadow:"0 0 20px #ff4500"}}>THE DRAGON AWAKENS</div>
          <div style={{fontSize:mob?6:9,color:"#ff6b35",letterSpacing:3,marginTop:4}}>FACE · THE · FIRE</div>
        </div>
        {/* Fire particles */}
        {Array.from({length:12}).map((_,i)=>(
          <div key={i} style={{position:"absolute",width:mob?8:14,height:mob?8:14,borderRadius:"50%",background:"radial-gradient(circle,#ffcc00,#ff4500)",
            left:`${20+Math.sin(i*27)*35}%`,top:`${30+Math.cos(i*37)*25}%`,
            opacity:.7+Math.sin(i)*.3,animation:`dragonFire ${.2+i*.07}s ease-in-out infinite alternate`}}/>
        ))}
      </div>}

      {/* POEM CARD — tree chop */}
      {poemCard&&<div style={{position:"absolute",zIndex:48,bottom:"18%",left:"50%",transform:"translateX(-50%)",pointerEvents:"none",background:"linear-gradient(135deg,#03080e,#081410)",border:"1px solid #38b2ac60",borderRadius:6,padding:"14px 20px",minWidth:200,textAlign:"center",boxShadow:"0 0 30px #38b2ac30,0 0 60px #38b2ac10"}}>
        <div style={{fontSize:7,color:"#38b2ac",letterSpacing:3,marginBottom:6,opacity:.7}}>🌲 THE TREE SPEAKS</div>
        {poemCard.split('\n').map((ln,i)=><div key={i} style={{fontSize:mob?8:11,color:"#c0ffe8",fontStyle:"italic",letterSpacing:1,lineHeight:1.8,fontWeight:i===0?700:400}}>{ln}</div>)}
        <div style={{fontSize:5,color:"#38b2ac40",marginTop:6,letterSpacing:2}}>— ghost town, {new Date().getFullYear()}</div>
      </div>}
      {/* BACKPACK PANEL */}
      {backpackOpen&&<div style={{position:"absolute",zIndex:30,top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#030308f0",border:"1px solid #c084fc30",borderRadius:6,padding:12,minWidth:260,maxWidth:340,maxHeight:"70vh",overflow:"auto",backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:10,color:"#c084fc",fontWeight:700,letterSpacing:2}}>🎒 BACKPACK</span>
          <button onClick={()=>setBackpackOpen(false)} style={{background:"transparent",border:"none",color:"#4a4a6a",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
        </div>
        <div style={{fontSize:6,color:"#3a3a52",marginBottom:8}}>Quest cards, achievements & items — mint them onchain at the 🏦 Bank</div>
        {(!pd.current.backpack||pd.current.backpack.length===0)&&<div style={{fontSize:7,color:"#2a2a3a",textAlign:"center",padding:"16px 0"}}>No items yet — complete quests to fill your pack</div>}
        {(pd.current.backpack||[]).map((item:any,i:number)=>(
          <div key={i} style={{padding:"5px 7px",marginBottom:3,background:"#0a0a1480",borderRadius:3,borderLeft:`2px solid ${RC[item.rarity]||'#4a4a6a'}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:7,color:RC[item.rarity]||'#c8c8d4',fontWeight:700}}>{item.icon} {item.name}</div>
              <div style={{fontSize:5,color:"#3a3a52"}}>{item.type.toUpperCase()} · +{item.xp}XP +{item.tk}◈</div>
            </div>
            {item.minted?<span style={{fontSize:5,color:"#38b2ac"}}>⛓ MINTED</span>:<button onClick={()=>{
              setMintingItem(item.name);
              setTimeout(()=>{item.minted=true;setMintingItem(null);addToast(`⛓ ${item.name} minted on Sepolia!`,'#c084fc');aL(`⛓ Quest card [${item.name}] minted to ${pd.current.did}`,'system');},2200);
            }} style={{background:"rgba(192,132,252,0.1)",border:"1px solid #c084fc40",borderRadius:2,color:"#c084fc",fontSize:5,padding:"2px 5px",cursor:"pointer",fontFamily:"inherit"}}>{mintingItem===item.name?'..minting':'MINT'}</button>}
          </div>
        ))}
        {(pd.current.backpack||[]).filter((i:any)=>!i.minted).length>1&&<button onClick={()=>{
          setMintingItem('all');
          setTimeout(()=>{(pd.current.backpack||[]).forEach((i:any)=>{i.minted=true;});setMintingItem(null);addToast(`⛓ All items minted on Sepolia!`,'#c084fc');},3000);
        }} style={{width:"100%",marginTop:6,padding:"5px",background:"rgba(192,132,252,0.08)",border:"1px solid #c084fc30",borderRadius:3,color:"#c084fc",fontSize:7,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>{mintingItem==='all'?'⚡ Minting...':'⛓ MINT ALL ON SEPOLIA'}</button>}
      </div>}

      {hackModal&&!hackSolved&&<div style={{position:"absolute",zIndex:40,inset:0,background:"rgba(0,10,20,.92)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)"}} onClick={()=>setHackModal(false)}>
        <div style={{maxWidth:400,width:"90%",background:"#060f16",border:"1px solid #00ffe7",borderRadius:8,padding:24,fontFamily:"inherit"}} onClick={(e:any)=>e.stopPropagation()}>
          <div style={{color:"#00ffe7",fontSize:12,letterSpacing:4,marginBottom:8}}>🖥️ TERMINAL HACK</div>
          <div style={{color:"#22d3ee",fontSize:8,marginBottom:12,lineHeight:1.8}}>
            CIPHER: <span style={{color:"#fbbf24"}}>TIVBA GBJAF FVYRAG UVQR</span><br/>
            Decode the ROT13 cipher above ↑<br/>
            <span style={{color:"#4a5568",fontSize:7}}>(ROT13: shift each letter 13 places. A→N, B→O...)</span>
          </div>
          <input value={hackInput} onChange={(e:any)=>setHackInput(e.target.value)} onKeyDown={(e:any)=>{if(e.key==='Enter'){const ans=hackInput.trim().toUpperCase();if(ans.includes('GHOST')&&ans.includes('TOWN')){setHackSolved(true);setHackModal(false);pd.current.xp+=500;pd.current.tk+=120;pd.current.tier=gT(pd.current.xp);pd.current.belt=gB(pd.current.dojoXP);addToast('🖥️ HACKED! +500XP +120◈','#00ffe7');aL('🖥️ YOU cracked the terminal cipher — HACK QUEST complete!','system');checkSuper();const _p2=pd.current;if(!_p2.hiddenQDone.includes('TERMINAL HACK'))_p2.hiddenQDone.push('TERMINAL HACK');}else addToast('Wrong. Try again.','#f56565');}}}
            style={{width:"100%",background:"#0a1a1a",border:"1px solid #00ffe7",color:"#00ffe7",padding:"8px 12px",fontFamily:"inherit",fontSize:9,outline:"none",letterSpacing:2,boxSizing:"border-box"}} placeholder="TYPE ANSWER..." />
          <div style={{color:"#2a4a4a",fontSize:6,marginTop:8}}>Press ENTER to submit · Click outside to close</div>
        </div>
      </div>}
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
