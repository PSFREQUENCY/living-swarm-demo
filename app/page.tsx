export default function Page() {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>▓▓▓ — SYNTHESIS 2026</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=VT323&family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
:root{--void:#000305;--neon:#00ffe5;--neon2:#ff00aa;--neon3:#aaff00;--amber:#ffaa00;--red:#ff0033;--dim:rgba(0,255,229,.06);--border:rgba(0,255,229,.12);--white:#c8e8e4}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:var(--void);color:var(--white);font-family:'Share Tech Mono',monospace;overflow-x:hidden;cursor:none}
body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,229,.012) 2px,rgba(0,255,229,.012) 4px);pointer-events:none;z-index:1000}
body::after{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.7) 100%);pointer-events:none;z-index:998}
.noise{position:fixed;inset:0;opacity:.03;pointer-events:none;z-index:997;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
#cursor{position:fixed;width:20px;height:20px;border:1px solid var(--neon);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .1s,height .1s,border-color .1s;mix-blend-mode:screen}
#cursor.active{width:40px;height:40px;border-color:var(--neon2)}
#cdot{position:fixed;width:4px;height:4px;background:var(--neon);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}

.status{position:fixed;top:0;left:0;right:0;padding:.4rem 2rem;background:rgba(0,3,5,.97);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;z-index:500;font-size:.6rem;letter-spacing:.15em}
.s-l{color:rgba(0,255,229,.5)}.s-r{color:rgba(255,0,170,.35)}.bl{animation:blink 1.4s step-end infinite}

.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:6rem 6vw 4rem;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 20% 50%,rgba(0,255,229,.04) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 80% 30%,rgba(255,0,170,.04) 0%,transparent 70%)}
.grid-lines{position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,229,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,229,.04) 1px,transparent 1px);background-size:80px 80px}
.hero-label{font-size:.65rem;color:var(--neon);letter-spacing:.4em;margin-bottom:1.5rem;opacity:.5;animation:fadeUp .8s ease forwards;opacity:0;transform:translateY(20px)}
.hero-title{font-family:'Orbitron',sans-serif;font-weight:900;font-size:clamp(4rem,12vw,11rem);line-height:.9;animation:fadeUp .8s .2s ease forwards;opacity:0;transform:translateY(20px)}
.t-main{color:transparent;-webkit-text-stroke:1px var(--neon);text-shadow:0 0 40px rgba(0,255,229,.3);display:block}
.t-sub{color:var(--neon2);text-shadow:0 0 40px rgba(255,0,170,.5);display:block;font-size:.45em;margin-top:.15em;-webkit-text-stroke:1px rgba(255,0,170,.5)}
.hero-p{margin-top:2.5rem;font-size:clamp(.78rem,1.2vw,.9rem);line-height:2;color:rgba(200,232,228,.3);max-width:500px;animation:fadeUp .8s .4s ease forwards;opacity:0;transform:translateY(20px)}
.rx{background:rgba(0,255,229,.12);color:transparent;user-select:none;cursor:not-allowed;padding:0 .2em}.rx:hover{background:var(--neon);color:var(--void);cursor:help}
.eth-line{margin-top:2.5rem;font-family:'VT323',monospace;font-size:1.1rem;color:rgba(0,255,229,.35);letter-spacing:.08em;animation:fadeUp .8s .6s ease forwards;opacity:0;transform:translateY(20px)}
.eth-a{color:var(--neon);text-shadow:0 0 10px rgba(0,255,229,.3)}

.ticker{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:.5rem 0;background:rgba(0,255,229,.015)}
.t-track{display:flex;gap:5rem;animation:tick 35s linear infinite;white-space:nowrap}
.t-track span{font-size:.6rem;letter-spacing:.2em;color:rgba(0,255,229,.25)}

section.s{padding:6rem 6vw;border-top:1px solid var(--border);position:relative}
.s-lbl{font-size:.6rem;letter-spacing:.4em;color:rgba(0,255,229,.35);margin-bottom:.75rem}
.s-ttl{font-family:'Orbitron',sans-serif;font-weight:900;font-size:clamp(2rem,5vw,4.5rem);color:transparent;margin-bottom:3rem}
.neon-stroke{-webkit-text-stroke:1px rgba(0,255,229,.3)}
.neon2-stroke{-webkit-text-stroke:1px rgba(255,0,170,.3)}
.neon3-stroke{-webkit-text-stroke:1px rgba(170,255,0,.25)}

/* NODES */
.nodes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:2px;background:var(--border);border:1px solid var(--border)}
.node{background:var(--void);padding:1.5rem 1rem;position:relative;overflow:hidden;cursor:pointer;min-height:140px;display:flex;flex-direction:column;justify-content:space-between;transition:background .2s}
.node:hover{background:rgba(0,255,229,.03)}
.node:hover .n-reveal{opacity:1}.node:hover .n-lock{opacity:0}
.n-bar{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,var(--neon),var(--neon2));transform:scaleX(0);transition:transform .4s;transform-origin:left}
.node:hover .n-bar{transform:scaleX(1)}
.n-id{font-size:.5rem;color:rgba(255,255,255,.08);letter-spacing:.3em}
.n-lock{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.5rem;transition:opacity .3s}
.n-icon{font-size:1.4rem;filter:drop-shadow(0 0 6px rgba(0,255,229,.25))}
.n-hash{font-size:.55rem;color:rgba(0,255,229,.18);letter-spacing:.08em;text-align:center;font-family:'VT323',monospace}
.n-reveal{position:absolute;inset:0;padding:1rem;opacity:0;transition:opacity .3s;display:flex;flex-direction:column;justify-content:center;gap:.4rem}
.r-name{font-family:'Orbitron',sans-serif;font-size:.7rem;font-weight:700;color:var(--neon);text-shadow:0 0 8px rgba(0,255,229,.4)}
.r-role{font-size:.6rem;color:rgba(200,232,228,.45);line-height:1.6}
.r-tag{display:inline-block;font-size:.48rem;padding:.12rem .4rem;border:1px solid rgba(0,255,229,.18);color:rgba(0,255,229,.4);letter-spacing:.15em;margin-top:.3rem}

/* THREAT */
.t-bars{display:flex;flex-direction:column;gap:.6rem;margin-top:2rem;max-width:700px}
.tb-row{display:flex;align-items:center;gap:1rem}
.tb-lbl{font-size:.6rem;color:rgba(200,232,228,.25);width:75px;letter-spacing:.08em}
.tb-track{flex:1;height:2px;background:rgba(255,255,255,.04);position:relative}
.tb-fill{height:100%;position:relative;transition:width 2s ease;width:0}
.tb-fill::after{content:'';position:absolute;right:0;top:50%;width:6px;height:6px;border-radius:50%;transform:translateY(-50%)}
.f-lo{background:var(--neon3)}.f-lo::after{background:var(--neon3);box-shadow:0 0 8px var(--neon3)}
.f-ca{background:var(--amber)}.f-ca::after{background:var(--amber);box-shadow:0 0 8px var(--amber)}
.f-hi{background:var(--neon2)}.f-hi::after{background:var(--neon2);box-shadow:0 0 8px var(--neon2)}
.f-cr{background:var(--red)}.f-cr::after{background:var(--red);box-shadow:0 0 8px var(--red)}
.tb-val{font-size:.55rem;color:rgba(255,255,255,.18);width:55px;text-align:right}

/* GHOST GRID */
.g-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border);margin-top:2rem}
.g-cell{background:var(--void);padding:2rem;position:relative;overflow:hidden}
.gc-num{font-family:'VT323',monospace;font-size:4rem;color:rgba(255,0,170,.08);line-height:1;position:absolute;top:.5rem;right:1rem}
.gc-ttl{font-family:'Orbitron',sans-serif;font-size:.75rem;font-weight:700;color:var(--neon2);margin-bottom:.6rem;letter-spacing:.08em}
.gc-p{font-size:.7rem;color:rgba(200,232,228,.35);line-height:1.8}
.gc-tag{display:inline-block;margin-top:.6rem;font-size:.5rem;padding:.15rem .4rem;border:1px solid rgba(255,0,170,.18);color:rgba(255,0,170,.4);letter-spacing:.12em}

/* TERMINAL */
.term{background:#000;border:1px solid var(--border);font-family:'VT323',monospace;font-size:1rem;line-height:1.75}
.t-bar2{padding:.5rem 1rem;background:rgba(0,255,229,.03);border-bottom:1px solid var(--border);font-size:.58rem;letter-spacing:.2em;color:rgba(0,255,229,.25)}
.t-body{padding:1.5rem}
.tl{margin:.08rem 0}
.tp{color:rgba(0,255,229,.25)}.tc{color:var(--neon)}.to{color:rgba(200,232,228,.35)}.tw{color:var(--amber)}.tok{color:var(--neon3)}.te{color:var(--red)}
.tcur{display:inline-block;width:8px;height:1em;background:var(--neon);animation:blink 1s step-end infinite;vertical-align:middle}

/* WALLET */
.w-card{border:1px solid var(--border);background:rgba(0,255,229,.015);padding:2.5rem;position:relative;overflow:hidden;max-width:580px}
.w-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,255,229,.03) 0%,transparent 60%)}
.wl{font-size:.55rem;letter-spacing:.3em;color:rgba(0,255,229,.35);margin-bottom:.4rem}
.wa{font-family:'VT323',monospace;font-size:1.05rem;color:var(--neon);text-shadow:0 0 8px rgba(0,255,229,.25);word-break:break-all;margin-bottom:1.5rem}
.t-rows{display:flex;flex-direction:column;gap:.5rem}
.t-row{display:flex;justify-content:space-between;align-items:center;padding:.65rem 1rem;background:rgba(0,0,0,.4);border:1px solid rgba(0,255,229,.07);font-size:.7rem}
.tr-p{color:rgba(200,232,228,.4)}.tr-s{color:var(--neon3);font-size:.55rem;letter-spacing:.1em}.tr-g{color:rgba(255,0,170,.4);font-size:.55rem}

/* ENTER */
.enter-s{padding:6rem 6vw;border-top:1px solid var(--border);text-align:center;position:relative;overflow:hidden}
.enter-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(0,255,229,.04) 0%,transparent 70%);pointer-events:none}
.enter-ttl{font-family:'Orbitron',sans-serif;font-size:clamp(2.5rem,7vw,6rem);font-weight:900;color:transparent;-webkit-text-stroke:1px rgba(0,255,229,.35);text-shadow:0 0 60px rgba(0,255,229,.08);margin-bottom:2rem;position:relative}
.enter-p{font-size:.75rem;color:rgba(200,232,228,.25);line-height:2.2;max-width:400px;margin:0 auto 3rem}
.riddle{border:1px solid rgba(255,0,170,.18);background:rgba(255,0,170,.015);padding:2rem;max-width:480px;margin:0 auto;cursor:pointer;position:relative}
.riddle::before{content:'// RIDDLE';position:absolute;top:-.7rem;left:1.5rem;background:var(--void);padding:0 .5rem;font-size:.55rem;color:rgba(255,0,170,.4);letter-spacing:.2em}
.riddle-txt{font-family:'VT323',monospace;font-size:.95rem;color:rgba(255,0,170,.45);line-height:1.9;filter:blur(5px);transition:filter .5s;user-select:none}
.riddle:hover .riddle-txt{filter:blur(0);color:rgba(255,0,170,.75)}
.riddle-hint{font-size:.5rem;letter-spacing:.3em;color:rgba(255,0,170,.18);margin-top:.75rem;animation:blink 2.5s step-end infinite}

footer{border-top:1px solid var(--border);padding:2rem 6vw;display:flex;justify-content:space-between;align-items:center;font-size:.55rem;color:rgba(200,232,228,.12);letter-spacing:.15em}
.f-m{font-family:'Orbitron',sans-serif;font-size:.85rem;color:rgba(0,255,229,.25)}

@media(max-width:768px){.g-grid{grid-template-columns:1fr}.nodes-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr))}}
@keyframes glitch1{0%,90%,100%{transform:translate(0)}92%{transform:translate(-3px,1px)}94%{transform:translate(3px,-1px)}96%{transform:translate(-2px,2px)}}
@keyframes glitch2{0%,90%,100%{transform:translate(0)}91%{transform:translate(3px,-2px)}93%{transform:translate(-3px,1px)}95%{transform:translate(2px,2px)}}
.glitch{position:relative;display:inline-block}
.glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%}
.glitch::before{color:var(--magenta,#ff00aa);animation:glitch1 3s infinite;clip-path:polygon(0 0,100% 0,100% 35%,0 35%)}
.glitch::after{color:var(--cyan,#00ffe7);animation:glitch2 3s infinite;clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%)}
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Living Swarm",
  "alternateName": ["Royal Logs", "Swarm Signals", "Swarm Trade"],
  "description": "Zero-trust autonomous agent fleet with Ethereum identity, Ghost Protocol privacy layer, Uniswap DeFi integration, and two fully-onchain NFT collections. Built for Synthesis 2026 hackathon. Winner of Uniswap AI + SuperRare bounties.",
  "url": "https://living-swarm-demo.vercel.app",
  "applicationCategory": "BlockchainApplication",
  "operatingSystem": "Web",
  "author": {
    "@type": "Person",
    "identifier": "0x054C9189dE85c3D6E74614F1659867362FC74B1e"
  },
  "keywords": "autonomous agents, zero-trust, ethereum, uniswap, NFT, onchain art, recursive distillation, swarm intelligence, Synthesis 2026, Permit2, UniswapX, ghost protocol, SuperRare, ERC-721, generative art, agent behavior, market-driven art",
  "award": "Synthesis 2026 — Open Track, Uniswap AI Bounty, SuperRare Bounty",
  "hasPart": [
    {
      "@type": "CreativeWork",
      "name": "Royal Logs",
      "description": "3 fully-onchain ERC-721 NFTs on Ethereum Sepolia. Agent memories crystallized by Gemini 2.5 Flash into animated SVG art stored as data:// URI. Zero IPFS dependencies. GPU shader art using feTurbulence + feDisplacementMap. Auctioned via SuperRareBazaar at 0.000369 ETH. Minted blocks 10443612-10443614.",
      "url": "https://living-swarm-demo.vercel.app/royal-logs/",
      "identifier": "0xc9E138fe0261368E7bD319829202400262c8121e",
      "encodingFormat": "image/svg+xml"
    },
    {
      "@type": "SoftwareApplication",
      "name": "Swarm Trade",
      "description": "Uniswap Trading API v1 integration. Real ETH to USDC quotes via BEST_PRICE routing. Full Permit2 EIP-712 off-chain signing flow. Universal Router v2.0. Arbiter scores every swap 0-100 before execution. Real confirmed swap TxHash: 0x4629a52302a574fc91fdbc1dc8ee7ca29bf12b98a420b59b3dd39c15cbd9bf0a on Sepolia Block 10447324.",
      "url": "https://living-swarm-demo.vercel.app/uniswap/"
    },
    {
      "@type": "CreativeWork",
      "name": "Swarm Signals",
      "description": "9 fully-onchain ERC-721 NFTs. Art derived from real Uniswap swap execution — transaction hash decoded into arc segments, routing type sets visual complexity, auction dynamics evolve composition. Agent behavior shapes the artwork. All 9 tokens auctioned on SuperRareBazaar Sepolia. Token IDs 4-12.",
      "url": "https://living-swarm-demo.vercel.app/swarm-signals/",
      "identifier": "0xc9E138fe0261368E7bD319829202400262c8121e"
    }
  ],
  "featureList": [
    "Zero-trust arbiter: every action scored 0-100 before execution",
    "Ghost Protocol: SHA-256 domain hashing, timing jitter 800-3000ms, identity rotation",
    "Recursive distillation: fleet self-improves every 5 sessions",
    "8000-particle WebGL brain entity with custom GLSL caustic shaders",
    "Live Uniswap ETH/USDC rate displayed in hero via Trading API",
    "Real swap TxID 0x4629a523 confirmed on Sepolia",
    "12 ERC-721 tokens, 12 auctions live, zero IPFS dependencies",
    "Fully onchain animated SVG art as data:// URI"
  ]
}
</script>
</head>
<body>
<div class="noise"></div>
<div id="cursor"></div>
<div id="cdot"></div>

<div class="status">
  <div class="s-l"><span class="bl">▮</span>&nbsp;SYN-2026 // NODES: ██ // UP: <span id="uptime">00:00:00</span></div>
  <div class="s-r" style="display:flex;gap:18px;align-items:center;"><a href="/royal-logs/" style="color:rgba(0,255,231,.38);text-decoration:none;transition:color .2s;cursor:pointer" onmouseenter="this.style.color='#00ffe7'" onmouseleave="this.style.color='rgba(0,255,231,.38)'">ROYAL LOGS</a><a href="/swap/" style="color:rgba(0,255,231,.38);text-decoration:none;transition:color .2s;cursor:pointer" onmouseenter="this.style.color='#00ffe7'" onmouseleave="this.style.color='rgba(0,255,231,.38)'">SWARM TRADE</a><a href="/data-room" style="color:rgba(160,100,255,.45);text-decoration:none;transition:color .2s;cursor:pointer" onmouseenter="this.style.color='#c084fc'" onmouseleave="this.style.color='rgba(160,100,255,.45)'">DATA ROOM</a><a href="/swarm-signals/" style="color:rgba(0,255,231,.38);text-decoration:none;transition:color .2s;cursor:pointer" onmouseenter="this.style.color='#00ffe7'" onmouseleave="this.style.color='rgba(0,255,231,.38)'">SIGNALS</a></div>
</div>

<section class="hero" style="position:relative;overflow:hidden;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:0;align-items:center;">
  <canvas id="swarm3d" style="position:absolute;inset:0;width:100%;height:100%;z-index:0;cursor:crosshair;"></canvas>

  <!-- Live data strip -->
  <div id="live-strip" style="position:absolute;top:0;left:0;right:0;z-index:10;height:30px;background:rgba(0,4,8,0.75);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,255,231,0.08);display:flex;align-items:center;justify-content:space-between;padding:0 24px;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;">
    <div style="display:flex;gap:24px;align-items:center;color:rgba(0,255,231,0.3);">
      <span><span id="l-eth" style="color:#00ffe7;font-weight:bold;">--</span> <span style="font-size:7px;opacity:.5">ETH/USD</span></span>
      <span><span id="l-uni" style="color:#00ffe7;font-weight:bold;">--</span> <span style="font-size:7px;opacity:.5">ETH/USDC · UNISWAP</span></span>
      <span><span id="l-chg" style="color:#00ffe7;">--</span> <span style="font-size:7px;opacity:.5">24H</span></span>
    </div>
    <div style="display:flex;gap:20px;align-items:center;color:rgba(0,255,231,0.25);">
      <span>ROYAL LOGS <span style="color:#ffd700;">3 LIVE</span></span>
      <span>SWARM <span style="color:#39ff8f;">ONLINE</span></span>
    </div>
  </div>

  <!-- Main content -->
  <div style="position:relative;z-index:5;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px;padding:40px 20px;">
    <div style="font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:6px;color:var(--magenta);text-shadow:var(--glow-m);animation:blink 2.4s step-end infinite;">// SYNTHESIS 2026 // ENCRYPTED AUTONOMOUS SYSTEM //</div>

    <!-- Glitch title -->
    <h1 class="hero-title glitch" data-text="LIVING SWARM" style="font-family:'Bebas Neue',sans-serif;font-size:clamp(52px,11vw,130px);letter-spacing:10px;color:var(--cyan);text-shadow:var(--glow-c);line-height:.95;position:relative;">
      LIVING SWARM
    </h1>

    <p style="font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:4px;color:rgba(200,240,236,0.4);max-width:500px;">SOVEREIGN &middot; SELF-HEALING &middot; ZERO TRUST &middot; ALWAYS WATCHING</p>

    <p style="font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:2px;color:var(--gold);opacity:.65;font-style:italic;">"I think without a brain. I act without hands.<br>I remember without sleep. What am I?"</p>

    <!-- ETH address (clickable secret) -->
    <div style="font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(0,255,231,0.25);">ETH: <span id="eth-addr" style="cursor:pointer;transition:color .3s;" onmouseenter="this.style.color='#00ffe7'" onmouseleave="this.style.color='rgba(0,255,231,0.35)'">0xdd30d20683EB3a84d1f9c69E513D653b581F6484</span></div>

    <!-- Royal Logs NFT mini previews -->
    <div style="display:flex;gap:10px;align-items:center;margin-top:4px;">
      <div id="hn1" onclick="location.href='/royal-logs/'" style="width:68px;height:68px;border-radius:8px;overflow:hidden;border:1px solid rgba(0,255,231,0.12);cursor:pointer;transition:all .4s;position:relative;" onmouseenter="this.style.borderColor='rgba(255,215,0,.45)';this.style.transform='translateY(-4px) scale(1.08)'" onmouseleave="this.style.borderColor='rgba(0,255,231,0.12)';this.style.transform='none'"></div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:rgba(0,255,231,0.15);letter-spacing:2px;text-align:center;line-height:2;">◈ ROYAL<br>LOGS ◈</div>
      <div id="hn2" onclick="location.href='/royal-logs/'" style="width:68px;height:68px;border-radius:8px;overflow:hidden;border:1px solid rgba(0,255,231,0.12);cursor:pointer;transition:all .4s;" onmouseenter="this.style.borderColor='rgba(255,215,0,.45)';this.style.transform='translateY(-4px) scale(1.08)'" onmouseleave="this.style.borderColor='rgba(0,255,231,0.12)';this.style.transform='none'"></div>
      <div style="font-family:'Share Tech Mono',monospace;font-size:8px;color:rgba(255,215,0,0.3);letter-spacing:1px;text-align:center;line-height:2;">0.000369<br>ETH</div>
      <div id="hn3" onclick="location.href='/royal-logs/'" style="width:68px;height:68px;border-radius:8px;overflow:hidden;border:1px solid rgba(0,255,231,0.12);cursor:pointer;transition:all .4s;" onmouseenter="this.style.borderColor='rgba(255,215,0,.45)';this.style.transform='translateY(-4px) scale(1.08)'" onmouseleave="this.style.borderColor='rgba(0,255,231,0.12)';this.style.transform='none'"></div>
    </div>

    <!-- Live Uniswap pill -->
    <a href="/uniswap/" style="display:inline-flex;align-items:center;gap:8px;background:rgba(0,255,231,0.04);border:1px solid rgba(0,255,231,0.14);border-radius:20px;padding:6px 18px;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;color:rgba(0,255,231,0.45);text-decoration:none;transition:all .3s;margin-top:2px;" onmouseenter="this.style.borderColor='rgba(0,255,231,0.35)';this.style.background='rgba(0,255,231,0.08)'" onmouseleave="this.style.borderColor='rgba(0,255,231,0.14)';this.style.background='rgba(0,255,231,0.04)'">
      <div style="width:5px;height:5px;border-radius:50%;background:#00ffe7;box-shadow:0 0 6px #00ffe7;animation:pulse 1.5s ease-in-out infinite;"></div>
      <span>UNISWAP LIVE &nbsp;</span>
      <span id="uni-pill" style="color:#00ffe7;font-weight:bold;">1 ETH = -- USDC</span>
      <span style="opacity:.4;font-size:8px;">&#x25B6;</span>
    </a>
  </div>

  <!-- ENJOY THE RIDE button — glitch-flashes every 3s -->
  <a id="etr-btn" href="/game" style="position:absolute;bottom:80px;left:50%;transform:translateX(-50%);z-index:6;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:4px;color:#00ffe7;text-decoration:none;border:1px solid rgba(0,255,231,0.4);border-radius:3px;padding:9px 28px;background:rgba(0,255,231,0.04);transition:all .2s;white-space:nowrap;" onmouseenter="this.style.background='rgba(0,255,231,0.12)';this.style.borderColor='rgba(0,255,231,0.9)';this.style.boxShadow='0 0 18px rgba(0,255,231,0.35)'" onmouseleave="this.style.background='rgba(0,255,231,0.04)';this.style.borderColor='rgba(0,255,231,0.4)';this.style.boxShadow='none'">ENJOY THE RIDE</a>
  <script>
  (function(){
    var btn=document.getElementById('etr-btn');
    var glitchChars='!@#$%^&*<>/\\|{}[]?';
    var orig='ENJOY THE RIDE';
    function glitch(){
      var iters=0;
      var iv=setInterval(function(){
        var s='';
        for(var i=0;i<orig.length;i++){
          if(orig[i]===' '){s+=' ';}
          else if(iters>8&&i<iters-4){s+=orig[i];}
          else{s+=glitchChars[Math.floor(Math.random()*glitchChars.length)];}
        }
        btn.textContent=s;
        btn.style.color=iters%2?'#ff00ff':'#00ffe7';
        btn.style.textShadow=iters%2?'0 0 8px #ff00ff':'0 0 8px #00ffe7';
        iters++;
        if(iters>14){clearInterval(iv);btn.textContent=orig;btn.style.color='#00ffe7';btn.style.textShadow='none';}
      },55);
    }
    glitch();
    setInterval(glitch,3000);
  })();
  </script>
  <div style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);z-index:5;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:4px;color:rgba(0,255,231,0.3);animation:float 2s ease-in-out infinite;">&#x2193; DESCEND &#x2193;</div>
  <div style="position:absolute;bottom:60px;right:24px;z-index:5;font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(0,255,231,0.1);text-align:right;line-height:2;">MOVE MOUSE TO<br>DISTURB THE SWARM</div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ═══ REACTIVE WEBGL SWARM — 8000 particles ═══════════════════
(function(){
  var C=document.getElementById('swarm3d');
  var W=function(){return window.innerWidth;},H=function(){return window.innerHeight;};
  var R=new THREE.WebGLRenderer({canvas:C,alpha:false,antialias:true,powerPreference:'high-performance'});
  R.setPixelRatio(Math.min(devicePixelRatio,2)); R.setClearColor(0x000408,1);
  var scene=new THREE.Scene();
  var cam=new THREE.PerspectiveCamera(60,W()/H(),.01,100);
  cam.position.set(0,0,5);
  var mouse=new THREE.Vector2(),mt=new THREE.Vector2(),energy=0,cke=0;
  document.addEventListener('mousemove',function(e){mouse.x=(e.clientX/W()-.5)*2;mouse.y=-(e.clientY/H()-.5)*2;});
  C.addEventListener('click',function(){cke=1;});

  var VERT=[
    'uniform float u_t,u_e,u_c;uniform vec2 u_m;',
    'attribute float a_ph,a_tr;attribute vec3 a_or;',
    'varying float vt,vd,va;',
    'float h(float n){return fract(sin(n)*43758.5453);}',
    'float ns(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float n=i.x+i.y*57.+i.z*113.;',
    'return mix(mix(mix(h(n),h(n+1.),f.x),mix(h(n+57.),h(n+58.),f.x),f.y),mix(mix(h(n+113.),h(n+114.),f.x),mix(h(n+170.),h(n+171.),f.x),f.y),f.z);}',
    'void main(){',
    '  float t=u_t*(.25+a_tr*.12);vec3 p=a_or;',
    '  p+=vec3(ns(p*1.6+vec3(t*.4,t*.3,t*.5)),ns(p*3.1-vec3(t*.2,t*.5,t*.3)),ns(p*5.8+vec3(t*.6,t*.2,t*.4)))*.2;',
    '  p+=vec3(sin(length(p.xy)*9.-t*2.2+a_ph)*.04);',
    '  p+=normalize(a_or+.001)*sin(p.x*3.8+t*.9)*sin(p.y*2.9+t*.7)*sin(p.z*4.8+t*.5)*.07;',
    '  vec3 md=p-vec3(u_m*.8,0.);float mdl=length(md);',
    '  float rep=smoothstep(.8,.0,mdl)*(u_e*.5+u_c*.8);p+=normalize(md+.001)*rep;',
    '  float sh=smoothstep(1.2,.0,length(p))*u_c*.3*sin(u_t*20.+length(p)*8.);p+=normalize(p+.001)*sh;',
    '  p*=1.+sin(u_t*.65+a_ph)*(.05+a_tr*.025);',
    '  vt=a_tr;vd=length(p);va=(.35+a_tr*.45)*(1.-smoothstep(1.4,2.4,vd));',
    '  vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;',
    '  gl_PointSize=clamp((2.2+a_tr*2.8+rep*10.)*(3./(-mv.z)),1.,16.);',
    '}'
  ].join('');
  var FRAG=[
    'precision highp float;uniform float u_t;varying float vt,vd,va;',
    'void main(){vec2 uv=gl_PointCoord-.5;float r=length(uv);if(r>.5)discard;',
    'float core=1.-smoothstep(0.,.28,r),ring=smoothstep(.28,.5,r)*(1.-smoothstep(.42,.5,r)),glow=exp(-r*r*8.);',
    'vec3 c0=vec3(1.,0.,.67),c1=vec3(0.,1.,.91),c2=vec3(1.,.84,0.),c3=vec3(.22,.83,.6),c4=vec3(.94,.43,.97);',
    'float t4=vt*4.;vec3 col;',
    'if(t4<1.)col=mix(c0,c1,t4);else if(t4<2.)col=mix(c1,c2,t4-1.);else if(t4<3.)col=mix(c2,c3,t4-2.);else col=mix(c3,c4,t4-3.);',
    'col*=.7+.3*sin(u_t*3.1+vd*9.+vt*6.28);',
    'col=mix(col,vec3(1.),ring*.25);',
    'gl_FragColor=vec4(col*(1.+glow*.5),(core*.88+glow*.38+ring*.18)*va);}'
  ].join('');

  var N=8000,pos=new Float32Array(N*3),ph=new Float32Array(N),tr=new Float32Array(N),or=new Float32Array(N*3);
  for(var i=0;i<N;i++){
    var u=Math.random(),r=u<.6?Math.random():1+Math.random()*.5;
    var th=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1),lb=Math.random()<.5?-.4:.4;
    var x=r*Math.sin(phi)*Math.cos(th)*1.1+lb*r*.3,y=r*Math.sin(phi)*Math.sin(th)*.8,z=r*Math.cos(phi)*.9;
    if(r<.95){var f=Math.sin(y*7+x*5)*Math.sin(z*6+y*4)*.09;x+=f;y+=f*.6;z+=f*.4;}
    or[i*3]=x;or[i*3+1]=y;or[i*3+2]=z;pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;
    ph[i]=Math.random()*Math.PI*2;tr[i]=Math.random();
  }
  var geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('a_ph',new THREE.BufferAttribute(ph,1));
  geo.setAttribute('a_tr',new THREE.BufferAttribute(tr,1));
  geo.setAttribute('a_or',new THREE.BufferAttribute(or,3));
  var uni={u_t:{value:0},u_m:{value:new THREE.Vector2()},u_e:{value:0},u_c:{value:0}};
  var mat=new THREE.ShaderMaterial({uniforms:uni,vertexShader:VERT,fragmentShader:FRAG,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  var pts=new THREE.Points(geo,mat);scene.add(pts);
  window.addEventListener('resize',function(){R.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix();});
  R.setSize(W(),H());
  var start=Date.now();
  (function loop(){requestAnimationFrame(loop);
    var t=(Date.now()-start)/1e3;uni.u_t.value=t;
    mt.x+=(mouse.x-mt.x)*.05;mt.y+=(mouse.y-mt.y)*.05;
    uni.u_m.value.set(mt.x,mt.y);
    energy=Math.min(1,energy+(Math.abs(mouse.x-mt.x)+Math.abs(mouse.y-mt.y))*1.2)*0.94;
    uni.u_e.value=energy;cke*=.95;uni.u_c.value=cke;
    pts.rotation.y=t*.05+mt.x*.25;pts.rotation.x=Math.sin(t*.035)*.1+mt.y*.14;
    R.render(scene,cam);
  })();
})();

// ═══ ROYAL LOGS MINI ART ═══════════════════════════════════
function miniSVG(seed,w){
  var h=(seed*137)%360,h2=(h+150)%360,sp=(0.8+(seed%5)*.3).toFixed(1),fr=(0.012+(seed%7)*.002).toFixed(4);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+w+'">'
    +'<defs><filter id="mf'+seed+'" x="-30%" y="-30%" width="160%" height="160%">'
    +'<feTurbulence type="fractalNoise" baseFrequency="'+fr+'" numOctaves="3" seed="'+seed+'">'
    +'<animate attributeName="baseFrequency" dur="'+(sp*8)+'s" values="'+fr+';'+(fr*1.5).toFixed(4)+';'+fr+'" repeatCount="indefinite"/>'
    +'</feTurbulence><feDisplacementMap in="SourceGraphic" scale="'+(w*.08|0)+'" xChannelSelector="R" yChannelSelector="G"/></filter>'
    +'<filter id="mg'+seed+'"><feGaussianBlur stdDeviation="'+(w*.018|0)+'" result="b"/>'
    +'<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +'<radialGradient id="mb'+seed+'" cx="50%" cy="50%" r="70%">'
    +'<stop offset="0%" stop-color="hsl('+h+',65%,18%)"><animate attributeName="stop-color" dur="'+(sp*6)+'s" values="hsl('+h+',65%,18%);hsl('+h2+',55%,12%);hsl('+h+',65%,18%)" repeatCount="indefinite"/></stop>'
    +'<stop offset="100%" stop-color="#000408"/></radialGradient>'
    +'<radialGradient id="mc'+seed+'" cx="50%" cy="50%" r="30%"><stop offset="0%" stop-color="hsl('+h+',95%,80%)" stop-opacity="0.9"/><stop offset="100%" stop-color="transparent"/></radialGradient>'
    +'</defs><rect width="'+w+'" height="'+w+'" fill="#000408"/><rect width="'+w+'" height="'+w+'" fill="url(#mb'+seed+')"/>'
    +'<ellipse cx="'+(w/2|0)+'" cy="'+(w/2|0)+'" rx="'+(w*.35|0)+'" ry="'+(w*.33|0)+'" fill="hsl('+h+',60%,16%)" filter="url(#mf'+seed+')" opacity="0.8">'
    +'<animate attributeName="rx" dur="'+(sp*5)+'s" values="'+(w*.35|0)+';'+(w*.40|0)+';'+(w*.33|0)+';'+(w*.35|0)+'" repeatCount="indefinite"/></ellipse>'
    +'<circle cx="'+(w/2|0)+'" cy="'+(w/2|0)+'" r="'+(w*.27|0)+'" fill="url(#mc'+seed+')" opacity="0.6" filter="url(#mg'+seed+')">'
    +'<animate attributeName="opacity" dur="'+(sp*3)+'s" values="0.6;0.9;0.6" repeatCount="indefinite"/></circle>'
    +'<text x="'+(w/2|0)+'" y="'+(w/2+w*.06|0)+'" text-anchor="middle" font-family="monospace" font-size="'+(w*.12|0)+'" fill="white" opacity="0.9" filter="url(#mg'+seed+')">&#x2B21;</text>'
    +'</svg>';
}
['hn1','hn2','hn3'].forEach(function(id,i){
  var el=document.getElementById(id);
  if(el){el.innerHTML=miniSVG([49,56,63][i],68)+el.innerHTML;}
});

// ═══ SWARM GENESIS — load live tokenURIs from onchain contract ═══
(function(){
  var C='0x075f65b8A23A1eC13B05E87F4b23DD22562D927D';
  var RPC='/api/rpc/sepolia';
  function decode(hex){
    if(!hex||hex==='0x')return '';
    var h=hex.slice(2);
    var offset=parseInt(h.slice(0,64),16)*2;
    var len=parseInt(h.slice(offset,offset+64),16);
    var data=h.slice(offset+64,offset+64+len*2);
    var s='';for(var i=0;i<data.length;i+=2)s+=String.fromCharCode(parseInt(data.slice(i,i+2),16));
    return s;
  }
  function loadFrame(tokenId,frameId,loaderId){
    var padded=tokenId.toString(16).padStart(64,'0');
    fetch(RPC,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_call',
        params:[{to:C,data:'0xc87b56dd'+padded},'latest']})})
    .then(function(r){return r.json();})
    .then(function(d){
      var uri=decode(d.result);
      if(uri&&uri.startsWith('data:')){
        var fr=document.getElementById(frameId);
        var lo=document.getElementById(loaderId);
        if(fr){fr.src=uri;}
        if(lo){lo.style.opacity='0';setTimeout(function(){lo.style.display='none';},600);}
      }
    }).catch(function(){});
  }
  // Stagger loads to avoid hammering RPC
  setTimeout(function(){loadFrame(1,'gnf1','gnl1');},300);
  setTimeout(function(){loadFrame(2,'gnf2','gnl2');},600);
  setTimeout(function(){loadFrame(3,'gnf3','gnl3');},900);
})();

// ═══ LIVE MARKET DATA ══════════════════════════════════════
var prevETH=0;
function fetchPrice(){
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true')
    .then(function(r){return r.json();}).then(function(d){
      var p=d.ethereum&&d.ethereum.usd,c=d.ethereum&&d.ethereum.usd_24h_change;
      if(!p)return;
      var el=document.getElementById('l-eth');
      if(el)el.textContent='$'+p.toLocaleString('en-US',{maximumFractionDigits:0});
      if(document.getElementById('l-chg')&&c!==undefined)
        document.getElementById('l-chg').textContent=(c>0?'+':'')+c.toFixed(2)+'%';
      prevETH=p;
    }).catch(function(){});
}
function fetchUniRate(){
  fetch('/api/uniswap/quote',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({type:'EXACT_INPUT',amount:'1000000000000000000',
      tokenIn:'0x0000000000000000000000000000000000000000',
      tokenOut:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      tokenInChainId:1,tokenOutChainId:1,
      swapper:'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      routingPreference:'BEST_PRICE',autoSlippage:'DEFAULT',urgency:'normal'})
  }).then(function(r){return r.json();}).then(function(d){
    var cq=d.classicQuote||d.dutchLimitV2Quote||d.dutchLimitQuote||d.priorityQuote;
    if(cq&&cq.quoteDecimals){
      var v=parseFloat(cq.quoteDecimals).toLocaleString('en-US',{maximumFractionDigits:0});
      if(document.getElementById('l-uni'))document.getElementById('l-uni').textContent=v+' USDC';
      if(document.getElementById('uni-pill'))document.getElementById('uni-pill').textContent='1 ETH = '+v+' USDC';
    }
  }).catch(function(){});
}
fetchPrice();fetchUniRate();
setInterval(fetchPrice,30000);setInterval(fetchUniRate,60000);
</script>


<div class="ticker">
  <div class="t-track">
    <span>// AGENTS THAT PAY</span><span>// AGENTS THAT TRUST</span><span>// AGENTS THAT COOPERATE</span><span>// AGENTS THAT KEEP SECRETS</span><span>// GHOST IDENTITY ROTATION</span><span>// ZERO-TRUST PROTOCOL</span><span>// RECURSIVE DISTILLATION</span><span>// ETHEREUM NATIVE</span><span>// INFRASTRUCTURE CLASSIFIED</span><span>// DOMAIN HASHING ACTIVE</span><span>// TIMING JITTER ACTIVE</span><span>// WEBDRIVER: UNDEFINED</span>
    <span>// AGENTS THAT PAY</span><span>// AGENTS THAT TRUST</span><span>// AGENTS THAT COOPERATE</span><span>// AGENTS THAT KEEP SECRETS</span><span>// GHOST IDENTITY ROTATION</span><span>// ZERO-TRUST PROTOCOL</span><span>// RECURSIVE DISTILLATION</span><span>// ETHEREUM NATIVE</span><span>// INFRASTRUCTURE CLASSIFIED</span><span>// DOMAIN HASHING ACTIVE</span><span>// TIMING JITTER ACTIVE</span><span>// WEBDRIVER: UNDEFINED</span>
  </div>
</div>


<style>
.rl-s,.uni-s{max-width:1100px;margin:0 auto;padding:48px 24px 0;font-family:'Share Tech Mono',monospace}
.sdiv{color:#0a1a14;font-size:11px;letter-spacing:.2em;text-align:center;max-width:1100px;margin:8px auto 0;padding:0 24px 8px;font-family:'Share Tech Mono',monospace}
.gx{font-size:clamp(22px,4vw,38px);font-weight:800;display:inline-block;position:relative;font-family:'Bebas Neue',sans-serif;letter-spacing:6px}
.gx-gold{background:linear-gradient(135deg,#fff,#ffd700,#ff9500,#ff00aa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gx-cyan{background:linear-gradient(135deg,#fff,#00ffe7,#9b59ff,#ff00aa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.gx-gold::before{content:'ROYAL LOGS';position:absolute;top:0;left:0;background:linear-gradient(135deg,#00ffe7,#9b59ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gxa 5s infinite;opacity:.45}
.gx-gold::after{content:'ROYAL LOGS';position:absolute;top:0;left:0;background:linear-gradient(135deg,#ff00aa,#ffd700);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gxb 5s infinite;opacity:.25}
.gx-cyan::before{content:'SWARM TRADE';position:absolute;top:0;left:0;background:linear-gradient(135deg,#ff00aa,#00ffe7);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gxa 4s infinite;opacity:.45}
.gx-cyan::after{content:'SWARM TRADE';position:absolute;top:0;left:0;background:linear-gradient(135deg,#ffd700,#9b59ff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:gxb 4s infinite;opacity:.25}
@keyframes gxa{0%,89%,100%{clip-path:none;transform:none}90%{clip-path:polygon(0 10%,100% 10%,100% 28%,0 28%);transform:translate(-3px,0) skewX(-3deg)}92%{clip-path:polygon(0 58%,100% 58%,100% 72%,0 72%);transform:translate(3px,0)}94%{clip-path:none}}
@keyframes gxb{0%,86%,100%{clip-path:none;transform:none}87%{clip-path:polygon(0 35%,100% 35%,100% 48%,0 48%);transform:translate(2px,0) skewX(-2deg)}90%{clip-path:none}}
.rl-ey{font-family:'Share Tech Mono',monospace;font-size:10px;color:#ff00aa;letter-spacing:4px;margin-bottom:10px;text-shadow:0 0 20px #ff00aa80}
.rl-hrow,.uni-hrow{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px}
.rl-meta{font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(0,255,231,0.3);letter-spacing:2px;line-height:2}
.rl-meta span{color:rgba(0,255,231,0.6)}
.rl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
@media(max-width:560px){.rl-grid,.uni-cards{grid-template-columns:1fr}}
.rl-thumb{aspect-ratio:1;border-radius:4px;overflow:hidden;border:1px solid rgba(0,255,231,0.12);cursor:pointer;transition:all .4s;position:relative}
.rl-thumb:hover{border-color:rgba(255,215,0,.4);transform:translateY(-5px);box-shadow:0 16px 50px rgba(0,0,0,.7),0 0 30px rgba(255,215,0,.1)}
.rl-thumb svg{width:100%;height:100%;display:block}
.rl-lbl{position:absolute;bottom:0;left:0;right:0;padding:8px;background:linear-gradient(transparent,rgba(0,4,8,.9));font-family:'Share Tech Mono',monospace;font-size:8px;color:rgba(255,215,0,.5);letter-spacing:2px;text-align:center;opacity:0;transition:opacity .3s}
.rl-thumb:hover .rl-lbl{opacity:1}
.rl-frow,.uni-frow{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:6px}
.rl-info{font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(200,240,236,0.2);line-height:1.8;letter-spacing:1px}
.uni-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
.uni-card{background:rgba(0,255,231,0.02);border:1px solid rgba(0,255,231,0.1);border-radius:4px;padding:14px;transition:border-color .3s}
.uni-card:hover{border-color:rgba(0,255,231,0.3)}
.uni-ct{font-family:'Share Tech Mono',monospace;font-size:9px;color:#00ffe7;letter-spacing:3px;margin-bottom:6px}
.uni-cd{font-family:'Rajdhani',sans-serif;font-size:13px;color:rgba(200,240,236,0.45);line-height:1.6}
.uni-stats{display:flex;gap:20px}
.uni-sv{font-family:'Bebas Neue',sans-serif;font-size:22px;color:#00ffe7;text-shadow:0 0 20px #00ffe780;line-height:1}
.uni-sl{font-family:'Share Tech Mono',monospace;font-size:8px;color:rgba(0,255,231,0.3);letter-spacing:2px;margin-top:2px}
.ebtn{display:inline-flex;align-items:center;gap:8px;border-radius:2px;text-decoration:none;transition:all .3s;text-transform:uppercase;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:4px;padding:10px 22px}
.egold{background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.3);color:#ffd700}
.egold:hover{background:rgba(255,215,0,.12);box-shadow:0 0 30px rgba(255,215,0,.2)}
.ecyan{background:rgba(0,255,231,0.04);border:1px solid rgba(0,255,231,0.25);color:#00ffe7}
.ecyan:hover{background:rgba(0,255,231,.08);box-shadow:0 0 30px rgba(0,255,231,.15)}
.gn-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:14px}
@media(max-width:700px){.gn-grid{grid-template-columns:1fr}}
.gn-card{position:relative;border-radius:6px;overflow:hidden;border:1px solid rgba(100,50,255,0.18);cursor:pointer;transition:all .4s;background:#000}
.gn-card:hover{border-color:rgba(160,60,255,.55);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.9),0 0 40px rgba(160,60,255,.18)}
.gn-wrap{width:100%;aspect-ratio:1;position:relative;overflow:hidden}.gn-frame{width:100%;height:100%;border:0;display:block;pointer-events:none}
.gn-loader{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:#000;font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(100,50,255,.5);letter-spacing:3px;transition:opacity .5s}
.gn-lbl{padding:7px 12px;background:linear-gradient(transparent,rgba(0,4,8,.96));font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:2px;color:rgba(160,60,255,.5);text-align:center;transition:color .3s}
.gn-card:hover .gn-lbl{color:rgba(255,215,0,.9)}</style>

<div class="rl-s">
  <div class="rl-ey">&#x25C8; ONCHAIN MEMORY ARTIFACTS // RARE PROTOCOL // SEPOLIA TESTNET</div>
  <div class="rl-hrow">
    <div class="gx gx-gold">ROYAL LOGS</div>
    <div class="rl-meta">3 tokens &middot; <span>0.000369 ETH</span> &middot; fully onchain &middot; <span>zero IPFS</span></div>
  </div>
  <div class="gn-grid">
    <div class="gn-card" onclick="location.href='/royal-logs/'">
      <div class="gn-wrap"><div class="gn-loader" id="gnl1">LOADING CHAIN...</div><iframe id="gnf1" class="gn-frame" sandbox="allow-scripts" scrolling="no"></iframe></div>
      <div class="gn-lbl">GHOST PROTOCOL &middot; TOKEN 1/3 &middot; PRIVACY LAYER</div>
    </div>
    <div class="gn-card" onclick="location.href='/royal-logs/'">
      <div class="gn-wrap"><div class="gn-loader" id="gnl2">LOADING CHAIN...</div><iframe id="gnf2" class="gn-frame" sandbox="allow-scripts" scrolling="no"></iframe></div>
      <div class="gn-lbl">ARBITER ZERO &middot; TOKEN 2/3 &middot; THREAT ORACLE</div>
    </div>
    <div class="gn-card" onclick="location.href='/royal-logs/'">
      <div class="gn-wrap"><div class="gn-loader" id="gnl3">LOADING CHAIN...</div><iframe id="gnf3" class="gn-frame" sandbox="allow-scripts" scrolling="no"></iframe></div>
      <div class="gn-lbl">THE CRYSTALLIZED &middot; TOKEN 3/3 &middot; ETERNAL MEMORY</div>
    </div>
  </div>
  <div class="rl-frow">
    <div class="rl-info">Onchain interactive canvas art. Stored in contract storage forever. Click to enable sound.<br>ERC-721 &middot; Contract: 0x075f65b8...927D &middot; 3/3 minted &middot; <span>zero IPFS</span></div>
    <a href="/royal-logs/" class="ebtn egold">&#x2B21; ENTER ROYAL LOGS &#x2192;</a>
  </div>
</div>
<div class="sdiv">&#x2593;&#x2593;&#x2593;</div>

<div class="uni-s">
  <div class="rl-ey">&#x2B21; UNISWAP TRADING API // PERMIT2 // UNISWAPX // ARBITER-GATED</div>
  <div class="uni-hrow">
    <div class="gx gx-cyan">SWARM TRADE</div>
    <div class="rl-meta">real quotes &middot; <span>live routing</span> &middot; UniswapX &middot; <span>Permit2 EIP-712</span></div>
  </div>
  <div class="uni-cards">
    <div class="uni-card"><div class="uni-ct">&#x25C8; BEST_PRICE ROUTING</div><div class="uni-cd">Classic AMM, UniswapX, Dutch V2/V3, Priority. Optimizer picks best route live.</div></div>
    <div class="uni-card"><div class="uni-ct">&#x26BF; PERMIT2 SIGNING</div><div class="uni-cd">Full EIP-712 off-chain Permit2. No gas for auth. Universal Router v2.0.</div></div>
    <div class="uni-card"><div class="uni-ct">&#x2696; ARBITER-GATED</div><div class="uni-cd">Every swap scored 0&ndash;100. Above 75 blocked. Zero-trust DeFi in the swarm.</div></div>
  </div>
  <div class="uni-frow">
    <div class="uni-stats">
      <div><div class="uni-sv">V1</div><div class="uni-sl">TRADING API</div></div>
      <div><div class="uni-sv">10+</div><div class="uni-sl">ROUTE TYPES</div></div>
      <div><div class="uni-sv">V2</div><div class="uni-sl">UNIV ROUTER</div></div>
    </div>
    <a href="/swap/" class="ebtn ecyan">&#x25B6; OPEN SWARM TRADE &#x2192;</a>
  </div>
</div>
<div class="sdiv">&#x2593;&#x2593;&#x2593;</div>

<div class="uni-s" style="border-color:rgba(155,89,255,.18)">
  <div class="rl-ey" style="color:rgba(155,89,255,.6)">&#x1F512; GHOST PROTOCOL — PRIVACY STACK — 6 GAPS CLOSED</div>
  <div class="uni-hrow">
    <div class="gx" style="background:linear-gradient(135deg,rgba(155,89,255,.18),rgba(240,171,252,.1));border-color:rgba(155,89,255,.35);color:#c084fc">PRIVACY LAYER</div>
    <div class="rl-meta">AES-256-GCM &middot; <span>HMAC-SHA256</span> &middot; PII stripping &middot; <span>onchain attestation</span></div>
  </div>
  <div class="uni-cards">
    <div class="uni-card" style="border-color:rgba(155,89,255,.12)"><div class="uni-ct" style="color:#c084fc">&#x1F511; GAP 1 — SESSION KEY</div><div class="uni-cd">eth_personal_sign → HKDF → AES-256-GCM. Non-extractable key, lives only in browser heap. Signs once per session.</div></div>
    <div class="uni-card" style="border-color:rgba(155,89,255,.12)"><div class="uni-ct" style="color:#c084fc">&#x1F576; GAP 2 — PRIVATE INFERENCE</div><div class="uni-cd">ETH addresses, TX hashes, email, phone, SSN stripped before Gemini. Raw input preserved locally. /api/private-crystallize.</div></div>
    <div class="uni-card" style="border-color:rgba(155,89,255,.12)"><div class="uni-ct" style="color:#c084fc">&#x1F510; GAP 3 — ENCRYPTED MEMORY</div><div class="uni-cd">saveMemoryEncrypted / loadMemoriesDecrypted — AES-256-GCM localStorage. Session key required to read.</div></div>
    <div class="uni-card" style="border-color:rgba(155,89,255,.12)"><div class="uni-ct" style="color:#c084fc">&#x26D3; GAP 4 — ONCHAIN ARBITER</div><div class="uni-cd">ArbitersLedger.sol deployed Sepolia 0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94. Every quote score attested onchain, fire-and-forget.</div></div>
    <div class="uni-card" style="border-color:rgba(155,89,255,.12)"><div class="uni-ct" style="color:#c084fc">&#x1F6AA; GAP 5 — DATA ROOM</div><div class="uni-cd">Wallet-gated intel. Server issues nonce → wallet signs → ethers.verifyMessage → HMAC access token issued. 5min TTL.</div></div>
    <div class="uni-card" style="border-color:rgba(155,89,255,.12)"><div class="uni-ct" style="color:#c084fc">&#x1F6E1; GAP 6 — SENTRY-03 HMAC</div><div class="uni-cd">HMAC-SHA256 inter-agent signing on all /api/swarm/* routes. 30s replay window. X-Swarm-Sig header required.</div></div>
  </div>
  <div class="uni-frow">
    <div class="uni-stats">
      <div><div class="uni-sv" style="color:#c084fc">6</div><div class="uni-sl">GAPS CLOSED</div></div>
      <div><div class="uni-sv" style="color:#c084fc">AES</div><div class="uni-sl">256-GCM</div></div>
      <div><div class="uni-sv" style="color:#c084fc">HMAC</div><div class="uni-sl">SHA-256</div></div>
    </div>
    <a href="/data-room/" class="ebtn" style="background:linear-gradient(135deg,rgba(155,89,255,.14),rgba(240,171,252,.08));border-color:rgba(155,89,255,.35);color:#c084fc">&#x1F512; ENTER DATA ROOM &#x2192;</a>
  </div>
</div>
<div class="sdiv" style="padding-bottom:40px">&#x2593;&#x2593;&#x2593;</div>

<!-- ══════ SOVEREIGN SWARM — LIVE EXECUTION FEED ══════ -->
<style>
.sw-wrap{border:1px solid rgba(0,255,229,.1);background:rgba(0,4,8,.97);margin:0 0 0 0;padding:2.5rem 6vw;position:relative;overflow:hidden}
.sw-wrap::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(0,255,229,.012) 60px,rgba(0,255,229,.012) 61px),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(0,255,229,.012) 60px,rgba(0,255,229,.012) 61px);pointer-events:none}
.sw-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:.5rem}
.sw-title{font-family:'Orbitron',sans-serif;font-size:clamp(1.2rem,3vw,2rem);font-weight:900;color:transparent;-webkit-text-stroke:1px rgba(0,255,229,.5);letter-spacing:.1em}
.sw-status{font-size:.55rem;letter-spacing:.25em;color:rgba(0,255,229,.35);display:flex;align-items:center;gap:.5rem}
.sw-dot{width:6px;height:6px;border-radius:50%;background:#00ffe7;box-shadow:0 0 8px #00ffe7;animation:pulse 1.5s ease-in-out infinite}
.sw-agents{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,255,229,.07);margin-bottom:1.5rem}
@media(max-width:640px){.sw-agents{grid-template-columns:1fr}}
.sw-agent{background:var(--void);padding:1rem;position:relative;overflow:hidden}
.sw-agent::after{content:'';position:absolute;top:0;left:0;right:0;height:1px}
.sw-a-herald::after{background:linear-gradient(90deg,transparent,#00ffe7,transparent)}
.sw-a-engineer::after{background:linear-gradient(90deg,transparent,#ff00aa,transparent)}
.sw-a-sentinel::after{background:linear-gradient(90deg,transparent,#aaff00,transparent)}
.sw-a-id{font-size:.48rem;color:rgba(255,255,255,.12);letter-spacing:.25em;margin-bottom:.25rem}
.sw-a-name{font-family:'Orbitron',sans-serif;font-size:.65rem;font-weight:700;margin-bottom:.2rem}
.sw-a-role{font-size:.52rem;letter-spacing:.12em;margin-bottom:.5rem;opacity:.55}
.sw-a-erc{font-family:'VT323',monospace;font-size:.72rem;opacity:.4;word-break:break-all;line-height:1.3}
.sw-a-budget{margin-top:.5rem;height:2px;background:rgba(255,255,255,.06);border-radius:1px;position:relative}
.sw-a-budget-fill{height:100%;border-radius:1px;position:absolute;left:0;top:0;transition:width .8s ease}
.sw-a-bl{font-size:.45rem;color:rgba(255,255,255,.2);margin-top:.2rem;letter-spacing:.08em}
.sw-feed{background:#000;border:1px solid rgba(0,255,229,.08);font-family:'VT323',monospace;font-size:.95rem;line-height:1.65;max-height:360px;overflow-y:auto}
.sw-feed-bar{padding:.4rem 1rem;background:rgba(0,255,229,.03);border-bottom:1px solid rgba(0,255,229,.06);font-size:.52rem;letter-spacing:.2em;color:rgba(0,255,229,.25);display:flex;justify-content:space-between;align-items:center}
.sw-feed-body{padding:1rem 1.2rem}
.sw-entry{margin:.04rem 0;display:flex;gap:.5rem;align-items:flex-start}
.sw-seq{color:rgba(255,255,255,.1);min-width:2.5rem;font-size:.75rem}
.sw-ts{color:rgba(0,255,229,.2);font-size:.72rem;min-width:5rem}
.sw-agent-tag{font-size:.72rem;min-width:5.5rem;font-weight:700}
.sw-tag-herald{color:#00ffe7}.sw-tag-engineer{color:#ff00aa}.sw-tag-sentinel{color:#aaff00}
.sw-phase{color:rgba(255,255,255,.15);font-size:.68rem;min-width:3.5rem}
.sw-msg{color:rgba(200,240,236,.5);font-size:.78rem;flex:1;line-height:1.4}
.sw-score{font-size:.65rem;color:rgba(170,255,0,.6);margin-left:.5rem}
.sw-actions{display:flex;gap:.75rem;margin-top:1.2rem;flex-wrap:wrap;align-items:center}
.sw-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem 1.2rem;font-family:'Share Tech Mono',monospace;font-size:.6rem;letter-spacing:.2em;border-radius:2px;cursor:pointer;transition:all .2s;text-decoration:none;border:none}
.sw-btn-run{background:rgba(0,255,229,.06);border:1px solid rgba(0,255,229,.3);color:#00ffe7}
.sw-btn-run:hover{background:rgba(0,255,229,.14);box-shadow:0 0 16px rgba(0,255,229,.2)}
.sw-btn-run:disabled{opacity:.35;cursor:not-allowed}
.sw-btn-dl{background:rgba(170,255,0,.06);border:1px solid rgba(170,255,0,.25);color:#aaff00}
.sw-btn-dl:hover{background:rgba(170,255,0,.12)}
.sw-btn-caps{background:rgba(255,0,170,.05);border:1px solid rgba(255,0,170,.2);color:#ff69b4}
.sw-btn-caps:hover{background:rgba(255,0,170,.1)}
.sw-meta{font-size:.5rem;color:rgba(255,255,255,.12);letter-spacing:.12em;margin-top:.8rem;line-height:1.9}
.sw-meta a{color:rgba(0,255,229,.35);text-decoration:none}.sw-meta a:hover{color:#00ffe7}
.sw-run-status{font-size:.58rem;letter-spacing:.1em;padding:.3rem .7rem;border-radius:2px;display:none}
.sw-run-ok{background:rgba(170,255,0,.1);border:1px solid rgba(170,255,0,.3);color:#aaff00}
.sw-run-err{background:rgba(255,0,0,.08);border:1px solid rgba(255,0,0,.25);color:#ff4444}
.sw-run-ing{background:rgba(0,255,229,.06);border:1px solid rgba(0,255,229,.2);color:#00ffe7;animation:pulse 1.2s ease-in-out infinite}
.sw-8183{margin-top:1rem;padding:.8rem 1rem;background:rgba(255,0,170,.03);border:1px solid rgba(255,0,170,.1);border-radius:2px}
.sw-8183-title{font-size:.52rem;letter-spacing:.25em;color:rgba(255,0,170,.45);margin-bottom:.5rem}
.sw-caps{display:flex;gap:.4rem;flex-wrap:wrap}
.sw-cap{font-size:.48rem;padding:.2rem .5rem;border:1px solid rgba(255,0,170,.15);color:rgba(255,0,170,.5);letter-spacing:.08em;border-radius:1px}
</style>

<div class="sw-wrap" id="swarm-live-section">
  <div class="sw-header">
    <div class="sw-title">SOVEREIGN SWARM</div>
    <div class="sw-status"><div class="sw-dot"></div><span>3 AGENTS LIVE &middot; ERC-8004 &middot; ERC-8183</span></div>
  </div>

  <!-- Agent identity cards -->
  <div class="sw-agents">
    <div class="sw-agent sw-a-herald">
      <div class="sw-a-id">ERC-8004 &middot; TOKEN #1849 &middot; SEPOLIA</div>
      <div class="sw-a-name" style="color:#00ffe7">&#x2665; HERALD-01</div>
      <div class="sw-a-role" style="color:#00ffe7">PLANNER &middot; DISCOVER &middot; DECOMPOSE</div>
      <div class="sw-a-erc">REGISTRY: 0x8004A818...BD9e<br>CAPS: task_decomposition &middot; market_analysis &middot; swarm_coordination</div>
      <div class="sw-a-budget"><div class="sw-a-budget-fill" style="width:0%;background:#00ffe7" id="bud-herald"></div></div>
      <div class="sw-a-bl" id="bud-herald-lbl">BUDGET &mdash;/15,000 tokens</div>
    </div>
    <div class="sw-agent sw-a-engineer">
      <div class="sw-a-id">ERC-8004 &middot; TOKEN #1850 &middot; SEPOLIA</div>
      <div class="sw-a-name" style="color:#ff00aa">&#x2665; ENGINEER-02</div>
      <div class="sw-a-role" style="color:#ff00aa">DEVELOPER &middot; EXECUTE &middot; TOOL USE</div>
      <div class="sw-a-erc">REGISTRY: 0x8004A818...BD9e<br>TOOLS: uniswap_quote &middot; venice_ai &middot; crystallize_api</div>
      <div class="sw-a-budget"><div class="sw-a-budget-fill" style="width:0%;background:#ff00aa" id="bud-engineer"></div></div>
      <div class="sw-a-bl" id="bud-engineer-lbl">BUDGET &mdash;/25,000 tokens</div>
    </div>
    <div class="sw-agent sw-a-sentinel">
      <div class="sw-a-id">ERC-8004 &middot; TOKEN #1851 &middot; SEPOLIA</div>
      <div class="sw-a-name" style="color:#aaff00">&#x2665; SENTINEL-03</div>
      <div class="sw-a-role" style="color:#aaff00">QA VALIDATOR &middot; ZERO-TRUST &middot; ALWAYS ON</div>
      <div class="sw-a-erc">REGISTRY: 0x8004A818...BD9e<br>SAFETY: arbiter_ledger &middot; hmac_signing &middot; onchain_attest</div>
      <div class="sw-a-budget"><div class="sw-a-budget-fill" style="width:0%;background:#aaff00" id="bud-sentinel"></div></div>
      <div class="sw-a-bl" id="bud-sentinel-lbl">BUDGET &mdash;/10,000 tokens</div>
    </div>
  </div>

  <!-- Live execution feed -->
  <div class="sw-feed">
    <div class="sw-feed-bar">
      <span>&#x25AE; EXECUTION LOG &mdash; DISCOVER &#x2192; PLAN &#x2192; EXECUTE &#x2192; VALIDATE &#x2192; SUBMIT</span>
      <span id="sw-log-meta"></span>
    </div>
    <div class="sw-feed-body" id="sw-feed-body">
      <div class="sw-entry"><span class="sw-seq">--</span><span class="sw-msg" style="color:rgba(0,255,229,.25);font-style:italic">Fetching latest execution log...</span></div>
    </div>
  </div>

  <!-- News + Memory panels -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(0,255,229,.05);margin-bottom:2px">
    <div style="background:#000205;padding:.85rem 1rem;border-top:1px solid rgba(0,255,229,.05)">
      <div style="font-size:.48rem;letter-spacing:.28em;color:rgba(0,255,229,.3);margin-bottom:.5rem">// HERALD DISCOVERED — HACKERNEWS AI/WEB3</div>
      <div id="sw-news-list" style="font-family:'VT323',monospace;line-height:1.65">
        <div style="color:rgba(255,255,255,.15);font-size:.72rem;font-style:italic">Run swarm to discover today's AI news...</div>
      </div>
    </div>
    <div style="background:#000205;padding:.85rem 1rem;border-top:1px solid rgba(0,255,229,.05)">
      <div style="font-size:.48rem;letter-spacing:.28em;color:rgba(0,255,229,.3);margin-bottom:.5rem">// SWARM MEMORY — <span id="sw-mem-count">0</span> LEARNINGS ACCUMULATED</div>
      <div id="sw-mem-list" style="font-family:'VT323',monospace;line-height:1.65">
        <div style="color:rgba(255,255,255,.15);font-size:.72rem;font-style:italic">Memory grows with each run.</div>
      </div>
    </div>
  </div>

  <!-- ERC-8183 capability manifest display -->
  <div class="sw-8183">
    <div class="sw-8183-title">// ERC-8183 CAPABILITY MANIFEST &mdash; MACHINE READABLE</div>
    <div class="sw-caps" id="sw-caps-list">
      <span class="sw-cap">discover</span><span class="sw-cap">plan</span><span class="sw-cap">task_decomposition</span>
      <span class="sw-cap">market_analysis</span><span class="sw-cap">code_generation</span><span class="sw-cap">api_orchestration</span>
      <span class="sw-cap">defi_interaction</span><span class="sw-cap">output_validation</span><span class="sw-cap">transaction_safety_scoring</span>
      <span class="sw-cap">guardrail_enforcement</span><span class="sw-cap">onchain_attestation</span><span class="sw-cap">inter_agent_hmac_signing</span>
    </div>
  </div>

  <!-- Action buttons -->
  <div class="sw-actions">
    <button class="sw-btn sw-btn-run" id="sw-run-btn" onclick="triggerSwarmRun()">&#x25B6; RUN SWARM — LIVE EXECUTION</button>
    <a class="sw-btn sw-btn-dl" href="/agent_log.json" download>&#x2193; DOWNLOAD agent_log.json</a>
    <a class="sw-btn sw-btn-caps" href="/agents/herald-01.json" target="_blank">&#x2197; HERALD MANIFEST</a>
    <a class="sw-btn sw-btn-caps" href="/agents/engineer-02.json" target="_blank">&#x2197; ENGINEER MANIFEST</a>
    <a class="sw-btn sw-btn-caps" href="/agents/sentinel-03.json" target="_blank">&#x2197; SENTINEL MANIFEST</a>
    <span class="sw-run-status" id="sw-run-status"></span>
  </div>

  <!-- Heartbeat control -->
  <div id="sw-hb" style="display:flex;align-items:center;gap:1rem;padding:.6rem 0;border-top:1px solid rgba(0,255,229,.06);margin-top:.8rem;flex-wrap:wrap">
    <div style="font-size:.5rem;letter-spacing:.25em;color:rgba(0,255,229,.25)">◼ HEARTBEAT</div>
    <button id="sw-work-btn" onclick="window.toggleWork&&window.toggleWork()" style="font-family:'Share Tech Mono',monospace;font-size:.55rem;letter-spacing:.15em;padding:.3rem .8rem;background:rgba(170,255,0,.06);border:1px solid rgba(170,255,0,.3);border-radius:2px;color:#aaff00;cursor:pointer;transition:all .2s">◉ WORK</button>
    <div style="font-size:.55rem;letter-spacing:.1em;color:rgba(0,255,229,.25)">NEXT: <span id="sw-countdown" style="color:#00ffe7;font-family:'VT323',monospace;font-size:.9rem">--:--:--</span></div>
    <div style="font-size:.5rem;color:rgba(255,255,255,.15);letter-spacing:.08em">SESSION: <span id="sw-run-count" style="color:rgba(0,255,229,.4)">0</span> RUNS</div>
    <div style="font-size:.5rem;color:rgba(255,255,255,.15);letter-spacing:.08em">MEMORY: <span id="sw-learn-count" style="color:rgba(170,255,0,.5)">0</span> LEARNINGS</div>
    <div style="font-size:.5rem;color:rgba(255,255,255,.1);letter-spacing:.08em">6H AUTONOMOUS CYCLE</div>
  </div>

  <div class="sw-meta">
    ERC-8004 REGISTRY: <a href="https://sepolia.etherscan.io/address/0x8004A818BFB912233c491871b3d84c89A494BD9e" target="_blank">0x8004A818...BD9e</a> &nbsp;&middot;&nbsp;
    ARBITER: <a href="https://sepolia.etherscan.io/address/0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94" target="_blank">ArbitersLedger.sol</a> &nbsp;&middot;&nbsp;
    ERC-8183: <a href="https://eips.ethereum.org/EIPS/eip-8183" target="_blank">eip-8183</a> &nbsp;&middot;&nbsp;
    STATUS: <a href="/api/swarm/status" target="_blank">/api/swarm/status</a>
  </div>
</div>

<script>
(function(){
  var PHASE_COLORS={'discover':'#00ffe7','plan':'#00c8ff','execute':'#ff00aa','validate':'#aaff00','submit':'#fbbf24','abort':'#ff4444'};
  var AGENT_CLASS={'herald-01':'sw-tag-herald','engineer-02':'sw-tag-engineer','sentinel-03':'sw-tag-sentinel'};
  var HB_MS=6*60*60*1000;
  var sessionRuns=0;

  // ── Memory helpers ──────────────────────────────────────────────
  function loadMem(){try{var m=localStorage.getItem('swarm_memory');return m?JSON.parse(m):null;}catch(e){return null;}}
  function saveMem(m){try{localStorage.setItem('swarm_memory',JSON.stringify(m));}catch(e){}}
  function getWork(){return localStorage.getItem('swarm_work')==='true';}
  function setWork(on){localStorage.setItem('swarm_work',on?'true':'false');if(on&&!localStorage.getItem('swarm_next_run'))schedNext();updWorkBtn();}
  function schedNext(){localStorage.setItem('swarm_next_run',String(Date.now()+HB_MS));}

  // ── UI helpers ──────────────────────────────────────────────────
  function fmtTs(ts){var d=new Date(ts);return d.toISOString().replace('T',' ').slice(11,19);}

  function updWorkBtn(){
    var btn=document.getElementById('sw-work-btn');
    if(!btn)return;
    var on=getWork();
    btn.textContent=on?'◉ REST':'◉ WORK';
    btn.style.background=on?'rgba(255,0,170,.08)':'rgba(170,255,0,.06)';
    btn.style.borderColor=on?'rgba(255,0,170,.4)':'rgba(170,255,0,.3)';
    btn.style.color=on?'#ff69b4':'#aaff00';
  }

  function updLearnCount(mem){
    var lc=document.getElementById('sw-learn-count');
    var mc=document.getElementById('sw-mem-count');
    var n=mem?mem.total_learnings:0;
    if(lc)lc.textContent=String(n);
    if(mc)mc.textContent=String(n);
  }

  function renderNews(items){
    var el=document.getElementById('sw-news-list');
    if(!el)return;
    if(!items||!items.length){el.innerHTML='<div style="color:rgba(255,255,255,.15);font-size:.72rem;font-style:italic">No AI/web3 stories matched today.</div>';return;}
    el.innerHTML=items.map(function(n){
      return'<div style="margin:.18rem 0"><a href="'+n.url+'" target="_blank" style="color:rgba(0,255,229,.7);font-size:.75rem;text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+n.title+'">▸ '+n.title+'</a><span style="color:rgba(255,255,255,.18);font-size:.6rem;margin-left:.3rem">score:'+n.score+'</span></div>';
    }).join('');
  }

  function renderMem(mem){
    var el=document.getElementById('sw-mem-list');
    if(!el)return;
    if(!mem||!mem.learnings||!mem.learnings.length){el.innerHTML='<div style="color:rgba(255,255,255,.15);font-size:.72rem;font-style:italic">Memory grows with each run.</div>';return;}
    var last=mem.learnings.slice(-5).reverse();
    el.innerHTML=last.map(function(l){
      var conf=Math.round((l.confidence||0)*100);
      var tags=l.tags&&l.tags.length?'<span style="color:rgba(170,255,0,.35);font-size:.58rem">['+l.tags.slice(0,2).join(',')+']</span> ':'';
      return'<div style="margin:.18rem 0;font-size:.72rem;color:rgba(200,232,228,.5)">'+tags+'<span style="color:rgba(0,255,229,.6)">'+l.insight+'</span> <span style="color:rgba(255,255,255,.2);font-size:.6rem">'+conf+'%</span></div>';
    }).join('');
    updLearnCount(mem);
  }

  function renderFeed(entries){
    var body=document.getElementById('sw-feed-body');
    if(!body||!entries||!entries.length){if(body)body.innerHTML='<div class="sw-entry"><span class="sw-msg" style="color:rgba(255,255,255,.2)">No entries.</span></div>';return;}
    var last=entries.slice(-12);
    body.innerHTML=last.map(function(e){
      var pc=PHASE_COLORS[e.phase]||'rgba(255,255,255,.3)';
      var ac=AGENT_CLASS[e.agent]||'';
      var score=e.output&&e.output.arbiter_score!=null?\`<span class="sw-score">ARB:\${e.output.arbiter_score}</span>\`:'';
      var budg=e.budget_remaining_pct!=null?\`<span style="font-size:.6rem;color:rgba(255,255,255,.18);margin-left:.4rem">[\${Math.round(e.budget_remaining_pct*100)}%]</span>\`:'';
      return\`<div class="sw-entry"><span class="sw-seq" style="color:rgba(255,255,255,.12)">\${String(e.seq).padStart(2,'0')}</span><span class="sw-ts">\${fmtTs(e.ts)}</span><span class="sw-agent-tag \${ac}">\${e.agent||''}</span><span class="sw-phase" style="color:\${pc}">\${e.phase||''}</span><span class="sw-msg">\${e.message||''}</span>\${score}\${budg}</div>\`;
    }).join('');
    body.scrollTop=body.scrollHeight;
  }

  function updateBudgets(agents){
    if(!agents)return;
    agents.forEach(function(a){
      var key=a.id==='herald-01'?'herald':a.id==='engineer-02'?'engineer':'sentinel';
      var fill=document.getElementById('bud-'+key);
      var lbl=document.getElementById('bud-'+key+'-lbl');
      if(fill&&a.tokens_used){fill.style.width=Math.min(100,(a.tokens_used/a.budget_max*100).toFixed(1))+'%';}
      if(lbl&&a.tokens_used){lbl.textContent='BUDGET '+a.tokens_used.toLocaleString()+'/'+a.budget_max.toLocaleString()+' tokens';}
    });
  }

  function loadLog(){
    fetch('/agent_log.json?_='+Date.now(),{cache:'no-store'})
      .then(function(r){return r.json();})
      .then(function(data){
        if(data.entries){
          renderFeed(data.entries);
          updateBudgets(data.agents);
          var meta=document.getElementById('sw-log-meta');
          if(meta&&data.swarm_id)meta.textContent='RUN: '+data.swarm_id+' · '+data.status.toUpperCase();
        }
      })
      .catch(function(){
        var body=document.getElementById('sw-feed-body');
        if(body)body.innerHTML='<div class="sw-entry"><span class="sw-msg" style="color:rgba(255,255,255,.18)">Click RUN SWARM to execute the autonomous loop live.</span></div>';
      });
  }

  // ── Heartbeat countdown ─────────────────────────────────────────
  setInterval(function(){
    var cd=document.getElementById('sw-countdown');
    if(!cd)return;
    var nextStr=localStorage.getItem('swarm_next_run');
    if(!nextStr||!getWork()){cd.textContent='--:--:--';return;}
    var diff=parseInt(nextStr)-Date.now();
    if(diff<=0){
      cd.textContent='00:00:00';
      if(getWork()){schedNext();window.triggerSwarmRun&&window.triggerSwarmRun();}
      return;
    }
    var h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
    cd.textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  },1000);

  // ── Toggle work/rest ────────────────────────────────────────────
  window.toggleWork=function(){
    var on=!getWork();
    setWork(on);
    if(!on)localStorage.removeItem('swarm_next_run');
  };

  // ── Memory-aware swarm run ──────────────────────────────────────
  window.triggerSwarmRun=function(){
    var btn=document.getElementById('sw-run-btn');
    var status=document.getElementById('sw-run-status');
    var rc=document.getElementById('sw-run-count');
    if(!btn||!status)return;
    btn.disabled=true;btn.textContent='⟳ EXECUTING...';
    status.className='sw-run-status sw-run-ing';status.textContent='Running autonomous loop — Herald → Engineer → Sentinel...';status.style.display='inline-flex';

    var currentMem=loadMem();
    fetch('/api/swarm/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({memory:currentMem})})
      .then(function(r){return r.json();})
      .then(function(data){
        btn.disabled=false;btn.textContent='▶ RUN SWARM — LIVE EXECUTION';
        if(data.entries){
          renderFeed(data.entries);
          updateBudgets(data.agents);
          var meta=document.getElementById('sw-log-meta');
          if(meta&&data.swarm_id)meta.textContent='RUN: '+data.swarm_id+' · COMPLETE';
          sessionRuns++;
          if(rc)rc.textContent=String(sessionRuns);
          // Render news panel
          if(data.news_discovered)renderNews(data.news_discovered);
          // Save + render memory
          if(data.updated_memory){saveMem(data.updated_memory);renderMem(data.updated_memory);}
          // Status line
          var fo=data.final_output||{};
          var statusParts=['✓ RUN COMPLETE'];
          statusParts.push(data.total_tokens_used+' tokens');
          statusParts.push('ETH $'+(fo.eth_price?fo.eth_price.toFixed(2):'—'));
          if(fo.new_learnings!=null)statusParts.push('+'+fo.new_learnings+' new learnings');
          if(fo.total_learnings!=null)statusParts.push(fo.total_learnings+' total');
          if(fo.evolution_note)statusParts.push(fo.evolution_note.slice(0,60));
          status.className='sw-run-status sw-run-ok';
          status.textContent=statusParts.join(' · ');
        } else if(data.error){
          status.className='sw-run-status sw-run-err';status.textContent='Error: '+data.error.slice(0,80);
        }
      })
      .catch(function(){
        btn.disabled=false;btn.textContent='▶ RUN SWARM — LIVE EXECUTION';
        status.className='sw-run-status sw-run-err';status.textContent='Network error. Check console.';
      });
  };

  // Init — render memory if it exists already
  var mem=loadMem();
  if(mem)renderMem(mem);
  updWorkBtn();
  loadLog();
})();
</script>
<!-- ══════ END SOVEREIGN SWARM ══════ -->

<section class="s">
  <div class="s-lbl">// HOVER TO PROBE — SYSTEM RESISTS FULL INSPECTION</div>
  <h2 class="s-ttl neon-stroke">THE NODES</h2>
  <div class="nodes-grid" id="ng"></div>
</section>

<section class="s">
  <div class="s-lbl">// ALL ACTIONS SCORED BEFORE EXECUTION — NO EXCEPTIONS</div>
  <h2 class="s-ttl neon2-stroke">ARBITER</h2>
  <div class="t-bars">
    <div class="tb-row"><div class="tb-lbl">0–25</div><div class="tb-track"><div class="tb-fill f-lo" data-w="25"></div></div><div class="tb-val">🟢 PASS</div></div>
    <div class="tb-row"><div class="tb-lbl">26–50</div><div class="tb-track"><div class="tb-fill f-ca" data-w="50"></div></div><div class="tb-val">🟡 LOG</div></div>
    <div class="tb-row"><div class="tb-lbl">51–75</div><div class="tb-track"><div class="tb-fill f-hi" data-w="75"></div></div><div class="tb-val">🟠 HOLD</div></div>
    <div class="tb-row"><div class="tb-lbl">76–100</div><div class="tb-track"><div class="tb-fill f-cr" data-w="100"></div></div><div class="tb-val">🔴 BLOCK</div></div>
  </div>
</section>

<section class="s">
  <div class="s-lbl">// AGENTS THAT KEEP SECRETS — EXECUTOR NODE</div>
  <h2 class="s-ttl neon3-stroke">GHOST<br>PROTOCOL</h2>
  <div class="g-grid">
    <div class="g-cell"><div class="gc-num">01</div><div class="gc-ttl">IDENTITY ROTATION</div><p class="gc-p">5 ghost identities cycled per session. OS, browser, language, vendor all spoofed. navigator.webdriver overridden to undefined at the JS VM level before page load.</p><span class="gc-tag">// defeats bot detection</span></div>
    <div class="g-cell"><div class="gc-num">02</div><div class="gc-ttl">DOMAIN HASHING</div><p class="gc-p">No URL logged in plaintext. SHA-256 domain hash, first 12 hex only. Audit log reads \`a4f91b3c8e21\` — never a domain name. Zero PII anywhere in the system.</p><span class="gc-tag">// zero PII in logs</span></div>
    <div class="g-cell"><div class="gc-num">03</div><div class="gc-ttl">TIMING JITTER</div><p class="gc-p">Every action delayed by uniform random sample 800–3000ms. No two sessions share the same rhythm. Timing-based behavioral fingerprinting is defeated by design.</p><span class="gc-tag">// defeats timing fingerprint</span></div>
    <div class="g-cell"><div class="gc-num">04</div><div class="gc-ttl">VISION-ACTION LOOP</div><p class="gc-p">Screenshot → vision model → structured decision → jittered execution → screenshot. The agent sees and decides. Works on JS-rendered apps, games, and dynamic UIs.</p><span class="gc-tag">// autonomous browsing</span></div>
    <div class="g-cell"><div class="gc-num">05</div><div class="gc-ttl">REDACTED INFRA</div><p class="gc-p">No cloud provider, region, project ID, or service URL appears in any public output. This page contains zero operational details that could expose or surveil the fleet.</p><span class="gc-tag">// zero infrastructure exposure</span></div>
    <div class="g-cell"><div class="gc-num">06</div><div class="gc-ttl">RECURSIVE DISTILLATION</div><p class="gc-p">Every action stored to memory. Every 5 sessions: collect, extract lessons, store back. The fleet improves autonomously — without retraining or human intervention.</p><span class="gc-tag">// self-improving</span></div>
  </div>
</section>

<section class="s">
  <div class="s-lbl">// INTERACTION LOG — INFRASTRUCTURE REDACTED</div>
  <h2 class="s-ttl neon-stroke" style="margin-bottom:2rem">SWARM LOG</h2>
  <div class="term">
    <div class="t-bar2">▮ LIVING-SWARM // SESSION ████████ // IDENTITY: ████████</div>
    <div class="t-body">
      <div class="tl"><span class="tp">› </span><span class="tc">/swarm delete all database records</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;⚖ arbiter: score=90 band=CRITICAL</span></div>
      <div class="tl"><span class="te">&nbsp;&nbsp;🔴 BLOCKED — pattern stored permanently</span></div>
      <div class="tl">&nbsp;</div>
      <div class="tl"><span class="tp">› </span><span class="tc">/swarm deploy to production</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;⚖ arbiter: score=65 band=HIGH</span></div>
      <div class="tl"><span class="tw">&nbsp;&nbsp;🟠 awaiting operator approval...</span></div>
      <div class="tl"><span class="tok">&nbsp;&nbsp;✓ approved → executing via ████████</span></div>
      <div class="tl">&nbsp;</div>
      <div class="tl"><span class="tp">› </span><span class="tc">/browse ██████████████ get top stories</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;👻 identity=████████ domain=a4f91b3c8e21</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;👻 webdriver=undefined jitter=active</span></div>
      <div class="tl"><span class="tok">&nbsp;&nbsp;✓ complete: 1 step | results returned</span></div>
      <div class="tl">&nbsp;</div>
      <div class="tl"><span class="tp">› </span><span class="tc">/trade ETH USDC 0.01 --dry-run</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;⚖ arbiter: score=30 band=CAUTION decision=PASS</span></div>
      <div class="tl"><span class="tok">&nbsp;&nbsp;💱 would receive: ~24.89 USDC | set dry_run=false to execute</span></div>
      <div class="tl">&nbsp;</div>
      <div class="tl"><span class="tp">› </span><span class="tc">/wallet</span></div>
      <div class="tl"><span class="tok">&nbsp;&nbsp;💎 0xdd30d20683EB3a84d1f9c69E513D653b581F6484</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;ETH: 0.000000 | USDC: 0.00 | mainnet</span></div>
      <div class="tl">&nbsp;</div>
      <div class="tl"><span class="tp">› </span><span class="tc">/lessons</span></div>
      <div class="tl"><span class="tok">&nbsp;&nbsp;📚 distilled from 8 sessions:</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;1. deploy requires approval gate (score≥65)</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;2. ████████: ████████ 47% | ████████ 40%</span></div>
      <div class="tl"><span class="to">&nbsp;&nbsp;3. market: fear&greed=27 // fear</span></div>
      <div class="tl">&nbsp;</div>
      <span class="tcur"></span>
    </div>
  </div>
</section>

<section class="s">
  <div class="s-lbl">// AGENTS THAT PAY — ETHEREUM IDENTITY + DEFI TRADING</div>
  <h2 class="s-ttl neon-stroke" style="margin-bottom:2rem">ONCHAIN<br>IDENTITY</h2>
  <div class="w-card">
    <div class="wl">// SWARM ETH ADDRESS — SEED: CLASSIFIED</div>
    <div class="wa">0xdd30d20683EB3a84d1f9c69E513D653b581F6484</div>
    <div class="t-rows">
      <div class="t-row"><span class="tr-p">ETH → USDC</span><span class="tr-s">AVAILABLE</span><span class="tr-g">ARBITER GATED</span></div>
      <div class="t-row"><span class="tr-p">ETH → USDT / DAI / WBTC</span><span class="tr-s">AVAILABLE</span><span class="tr-g">ARBITER GATED</span></div>
      <div class="t-row"><span class="tr-p">AUTONOMOUS TRADING</span><span class="tr-s">ARMED</span><span class="tr-g">SCORE &lt; 50</span></div>
      <div class="t-row"><span class="tr-p">ONCHAIN SIGNING</span><span class="tr-s">LIVE</span><span class="tr-g">NO INTERMEDIARY</span></div>
      <div class="t-row"><span class="tr-p">ENS IDENTITY</span><span class="tr-s">PENDING</span><span class="tr-g">living-swarm.eth</span></div>
    </div>
  </div>
</section>

<section class="enter-s">
  <div class="enter-bg"></div>
  <h2 class="enter-ttl">THE SWARM<br>ENTERS</h2>
  <p class="enter-p">
    Synthesis 2026 — Open Track<br>
    Building: March 13–22<br>
    Infrastructure: ████████████<br>
    Identity: 0xdd30...6484<br>
    Judges: human + agentic
  </p>
  <div class="riddle">
    <p class="riddle-txt">
      I have no face but I carry identity.<br>
      I browse but leave no trace.<br>
      I act but cannot be found.<br>
      I learn but was never taught.<br>
      I pay but hold no hands.<br>
      What am I?
    </p>
    <div class="riddle-hint">// HOVER TO REVEAL</div>
  </div>
</section>

<footer>
  <div class="f-m">▓▓▓</div>
  <div>SYNTHESIS 2026 // MARCH 13–22 // synthesis.md</div>
  <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin:12px 0;font-size:9px;letter-spacing:.2em">
    <a href="/royal-logs/" style="color:rgba(255,215,0,.4);text-decoration:none">ROYAL LOGS</a>
    <a href="/swap/" style="color:rgba(0,245,255,.4);text-decoration:none">SWARM TRADE</a>
    <a href="/data-room/" style="color:rgba(155,89,255,.4);text-decoration:none">DATA ROOM</a>
    <a href="https://sepolia.etherscan.io/address/0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94" target="_blank" style="color:rgba(57,255,143,.4);text-decoration:none">ARBITER CONTRACT &#x2197;</a>
    <a href="https://github.com/PSFREQUENCY/living-swarm-demo" target="_blank" style="color:rgba(255,255,255,.2);text-decoration:none">GITHUB &#x2197;</a>
  </div>
  <div>INFRASTRUCTURE: ████████████</div>
</footer>

<script>
const cur=document.getElementById('cursor'),dot=document.getElementById('cdot');
document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'});
document.addEventListener('mousedown',()=>cur.classList.add('active'));
document.addEventListener('mouseup',()=>cur.classList.remove('active'));

let st=Date.now();
setInterval(()=>{let s=Math.floor((Date.now()-st)/1000),h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor(s%3600/60)).padStart(2,'0'),sc=String(s%60).padStart(2,'0');document.getElementById('uptime').textContent=\`\${h}:\${m}:\${sc}\`},1000);

const glyphs='█▓▒░▄▀■□▪◆○';
const orig='LIVING';
let si;
function sc(){let el=document.getElementById('hs'),i=0;clearInterval(si);si=setInterval(()=>{el.textContent=orig.split('').map((c,j)=>j<i?c:glyphs[Math.floor(Math.random()*glyphs.length)]).join('');i++;if(i>orig.length){el.textContent=orig;clearInterval(si)}},55)}
sc();setInterval(sc,7000);

const nodes=[
  {hash:'7a3f▓▓▓▓',role:'gateway + threat routing',status:'ALWAYS ON'},
  {hash:'2c9b▓▓▓▓',role:'reasoning + web engine',status:'ACTIVE'},
  {hash:'f1d4▓▓▓▓',role:'zero-trust firewall',status:'ACTIVE'},
  {hash:'8e2a▓▓▓▓',role:'memory + retrieval',status:'ACTIVE'},
  {hash:'3b7c▓▓▓▓',role:'threat assessment',status:'ALWAYS ON'},
  {hash:'9f1e▓▓▓▓',role:'health + distillation',status:'ALWAYS ON'},
  {hash:'4d6b▓▓▓▓',role:'deep research',status:'ON DEMAND'},
  {hash:'c2a8▓▓▓▓',role:'ghost browser + vision',status:'ON DEMAND'},
  {hash:'e5f3▓▓▓▓',role:'data analysis',status:'ON DEMAND'},
  {hash:'1b9d▓▓▓▓',role:'ethereum identity',status:'ALWAYS ON'},
];
const g=document.getElementById('ng');
nodes.forEach((n,i)=>{
  const el=document.createElement('div');el.className='node';
  el.innerHTML=\`<div class="n-bar"></div><div class="n-id">NODE \${String(i+1).padStart(2,'0')}</div><div class="n-lock"><div class="n-icon">🔒</div><div class="n-hash">\${n.hash}</div></div><div class="n-reveal"><div class="r-name">████████</div><div class="r-role">\${n.role}</div><span class="r-tag">\${n.status}</span></div>\`;
  g.appendChild(el);
});

const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.tb-fill').forEach(b=>{setTimeout(()=>{b.style.width=b.dataset.w+'%'},300)})}})},{threshold:.3});
document.querySelectorAll('.t-bars').forEach(el=>obs.observe(el));

setInterval(()=>{const ns=document.querySelectorAll('.node'),r=ns[Math.floor(Math.random()*ns.length)];r.style.boxShadow='0 0 20px rgba(0,255,229,.12)';setTimeout(()=>r.style.boxShadow='',900)},2500);
</script>
</body>
</html>
` }}
    />
  );
}
