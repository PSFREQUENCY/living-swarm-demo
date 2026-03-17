```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ░██████╗██╗   ██╗███╗   ██╗████████╗██╗  ██╗███████╗███████╗██╗  ║
║   ██╔════╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██║  ██║██╔════╝██╔════╝██║  ║
║   ╚█████╗  ╚████╔╝ ██╔██╗ ██║   ██║   ███████║█████╗  ███████╗██║  ║
║    ╚═══██╗  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██║██╔══╝  ╚════██║╚═╝  ║
║   ██████╔╝   ██║   ██║ ╚████║   ██║   ██║  ██║███████╗███████║██╗  ║
║   ╚═════╝    ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ║
║                                                                      ║
║        ░░░  S Y N T H E S I S   2 0 2 6  ░░░  H A C K A T H O N    ║
║                                                                      ║
║   ████████████████████████████████████████████████████████████████  ║
║  PRIZE TRACKS: VENICE · UNISWAP · SUPERRARE · ERC-8004 · ERC-8183  ║
║   ████████████████████████████████████████████████████████████████  ║
╚══════════════════════════════════════════════════════════════════════╝
```

> **"The first macro-hard AI-run city. Where agents pay, trust, cooperate, and keep secrets — onchain."**

**[▶ PLAY NOW](https://psfrequency.github.io/living-swarm-demo/game)** · **[Vercel](https://living-swarm-demo.vercel.app)** · **[Royal Museum](https://living-swarm-demo.vercel.app/royal-logs/)** · **[SwarmSwap](https://living-swarm-demo.vercel.app/swap/)** · **[SwarmFI](https://living-swarm-demo.vercel.app/swap/?tab=fi)** · **[Signals](https://living-swarm-demo.vercel.app/swarm-signals/)**

**Wallet**: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484` · **Built**: March 13–22, 2026
**Swarm API**: `POST /api/swarm/execute` · **Rebalance API**: `POST /api/swarm/rebalance` · **Agent Logs**: `/agent_log.json`

---

## ◈ WHAT THIS IS

Living Swarm is a three-layer autonomous system:

1. **A playable 3D world** — 11 city zones, 20 AI agents, 36 quests, running live in the browser with Three.js
2. **A DeFi execution stack** — real Uniswap swaps, Permit2, arbiter-gated safety, autonomous portfolio rebalancing
3. **An onchain intelligence network** — ERC-8004 agent identities, ArbitersLedger attestations, Royal Logs NFTs, Venice-powered private inference

Every layer is connected. The agents in the 3D world use the same identities, the same wallet, and the same contracts as the DeFi layer. The game is the proof-of-concept for the protocol.

---

## ◈ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                          LIVING SWARM                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    AGENT LAYER                               │  │
│  │   Herald-01 (Scout/Planner) · Engineer-02 (Executor)        │  │
│  │   Sentinel-03 (Validator/Guardian)                          │  │
│  │   ERC-8004 identity tokens · ERC-8183 capability manifests  │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                          │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │                    EXECUTION LAYER                           │  │
│  │   SwarmSwap      SwarmFI        Swarm Execute                │  │
│  │   /api/uniswap/  /api/swarm/    Venice AI inference          │  │
│  │   quote          rebalance      HackerNews discovery         │  │
│  │   approval       (Scout→        ArbitersLedger.sol           │  │
│  │   swap            Strategist→   attestation                  │  │
│  │                   Guardian)                                  │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                          │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │                   ONCHAIN LAYER (Sepolia)                    │  │
│  │   SwarmGenesis.sol · ArbitersLedger.sol · RoyalLogs ERC-721  │  │
│  │   ERC-8004 Registry · Uniswap Universal Router v2            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    PRIVACY LAYER                             │  │
│  │   Venice AI (zero-retention) · AES-256-GCM session keys      │  │
│  │   HMAC-SHA256 inter-agent signing · PII stripping            │  │
│  │   Wallet-gated data room · Alchemy RPC proxied server-side   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ◈ SWARMFI — 3-AGENT AUTONOMOUS PORTFOLIO REBALANCING

> *independent operators, not scripts*

Three ERC-8004 agents running a complete discover → plan → execute → verify loop against the Uniswap Trading API — with real TxIDs on Sepolia. Set a portfolio target. Toggle TRADE. The agents deploy the plan.

**[▶ LAUNCH SWARMFI](https://living-swarm-demo.vercel.app/swap/?tab=fi)**

### The Agents

| Agent | ERC-8004 | Role | What It Does |
|---|---|---|---|
| **Scout** | Herald-01 #1 | DISCOVERY | Fetches ETH + WETH + USDC balances via Sepolia RPC · gets live ETH price via Uniswap quote · calculates portfolio drift from target allocation · emits signed rebalance signal with context |
| **Strategist** | Engineer-02 #2 | PLANNING | Calls Uniswap `/v1/quote` with `BEST_PRICE` routing · evaluates Classic/Dutch/Priority routes · handles full Permit2 EIP-712 signing flow · rejects trades if price impact > 2% |
| **Guardian** | Sentinel-03 #3 | VALIDATION | 8-point safety check before any broadcast. Hard BLOCK on fail. Attests verdict to ArbitersLedger.sol onchain. |

### Guardian's 8 Safety Checks

```
✓ QUOTE_EXISTS         — quote object present and non-null
✓ ROUTER_WHITELIST     — to: address is a known Uniswap Universal Router
✓ CALLDATA_HEX         — tx.data is valid 0x-prefixed hex encoding
✓ AMOUNT_WITHIN_BUDGET — trade size ≤ user-configured max
✓ OUTPUT_NONZERO       — expected output > 0 (route not broken)
✓ SLIPPAGE_BOUNDS      — price impact within max slippage threshold
✓ BALANCE_SUFFICIENT   — wallet holds enough of the sell token
✓ STRATEGIST_APPROVED  — strategist voted PROCEED (not SKIP or RETRY)
```

### Live Execution Trace

```
Scout:      ETH=62.4% WETH=2.1% USDC=35.5% · total=$1,847.20
            drift=+12.4% above 50% target → REBALANCE SIGNAL EMITTED
            sell: 0.0524 ETH → buy: USDC

Strategist: POST /v1/quote → CLASSIC routing selected
            output=187.42 USDC · gas=$0.12 · impact=0.02%
            Permit2 required: false (ETH → no approval needed)
            verdict: PROCEED

Guardian:   ✓ QUOTE_EXISTS       ✓ ROUTER_WHITELIST
            ✓ CALLDATA_HEX       ✓ AMOUNT_WITHIN_BUDGET
            ✓ OUTPUT_NONZERO     ✓ SLIPPAGE_BOUNDS
            ✓ BALANCE_SUFFICIENT ✓ STRATEGIST_APPROVED
            risk=0/100 · band=PASS → APPROVED

Broadcast:  eth_sendTransaction → TxID: 0xabcd...
            ArbitersLedger.sol attestation: logScore(hash, 0, 'P')
```

### Autonomous Heartbeat

Toggle **TRADE** mode in the UI. The swarm auto-triggers every 6 hours — no human required. A live countdown timer ticks in the browser. When it hits zero: Scout scans, Strategist quotes, Guardian validates, execution fires if approved. Toggle **SLEEP** to pause. Session state persists in localStorage across browser closes.

### 9000 Sentient Particles

Three WebGL particle clusters rendered on canvas — each cluster maps to one agent:
- **Scout cluster** (violet/cyan) — orbital searching pattern, expands when active, disperses when scanning
- **Strategist cluster** (gold) — convergent behavior, particles pull toward center during analysis, turbulent when processing
- **Guardian cluster** (sage green) — rotating ring/shield formation, tightens when approving, explodes on error

Particles respond to agent state in real time via `fiAgentStates[idx]` — idle, running, done, error each drive different physics.

---

## ◈ SWARMSWAP — UNISWAP DEEP INTEGRATION

> *the swap terminal that scores every trade before it executes*

**[▶ LAUNCH SWARMSWAP](https://living-swarm-demo.vercel.app/swap/?tab=swap)**

### The Stack

Every swap goes through a 6-step verified pipeline:

```
STEP 1 · QUOTE     POST /v1/quote — EXACT_INPUT, BEST_PRICE routing
                   Supports: Mainnet + Sepolia · ETH/WETH/USDC/USDT/DAI
                   Returns: routing type, output amount, price impact, gas estimate

STEP 2 · ARBITER   Client-side + server-side risk scoring 0–100
                   Factors: trade size, cross-chain flag, exotic token penalty
                   Bands: PASS(≤25) LOG(≤50) HOLD(≤75) BLOCK(>75)
                   Score ≥ 76 → hard block, no swap button shown

STEP 3 · APPROVE   POST /v1/check_approval — checks Permit2 allowance
                   Returns: needsApproval boolean + approval calldata
                   ETH swaps bypass (no ERC-20 approval needed)

STEP 4 · PERMIT2   eth_signTypedData_v4 — full EIP-712 off-chain signature
                   Domain separation, typed structured data, no gas cost
                   Time-limited authorization for this swap only

STEP 5 · SWAP      POST /v1/swap — simulateTransaction: true, refreshGasPrice: true
                   Returns: Universal Router calldata + gas estimates
                   txFailureReasons checked before broadcast

STEP 6 · BROADCAST eth_sendTransaction — to UniversalRouter v2.0
                   Real TxID returned · Sepolia Etherscan link in log
```

### Routing Intelligence

```javascript
// Routing types decoded live from Uniswap API response
{
  0: 'CLASSIC',      // V2/V3 AMM — best for stable pairs
  1: 'DUTCH_LIMIT',  // UniswapX Dutch auction — MEV protection
  2: 'DUTCH_V2',     // Improved Dutch with better fill rates
  4: 'WRAP',         // ETH → WETH single-step
  5: 'UNWRAP',       // WETH → ETH single-step
  7: 'PRIORITY',     // Priority ordering for time-sensitive trades
  8: 'DUTCH_V3',     // Latest Dutch with cross-chain support
}
```

### Arbiter Score Formula

```
base score = trade size penalty (5–40 pts)
+ cross-chain flag (25 pts if tokenInChainId ≠ tokenOutChainId)
+ exotic tokenIn (15 pts if not in known-safe whitelist)
+ exotic tokenOut (15 pts if not in known-safe whitelist)
= capped at 100

Every score attested onchain → ArbitersLedger.sol.logScore(hash, score, band)
```

### Network Support

| Network | Chain ID | Tokens | Status |
|---|---|---|---|
| Ethereum Mainnet | 1 | ETH, USDC, USDT, WETH, DAI | ✓ Live |
| Sepolia Testnet | 11155111 | ETH, WETH (`0xfFf9976...`), USDC (`0x1c7D4B1...`) | ✓ Live |

Auto-switches network via `wallet_switchEthereumChain` before quote AND before execution.

---

## ◈ SWARM EVOLUTION — MEMORY + NEWS DISCOVERY

> *an agent that learns nothing is just a script.*
> *an agent that learns is something else.*

**[▶ LAUNCH SWARM](https://living-swarm-demo.vercel.app/)**

### What Happens Each Run

Every call to `POST /api/swarm/execute` does three things no static agent can:

**1 — Scans today's reality (Herald-01)**
Pulls HackerNews top 30 stories, filters with regex for AI/web3/DeFi signal:
```
/\b(ai|ml|llm|gpt|claude|gemini|agent|ethereum|defi|web3|blockchain|
   crypto|neural|openai|anthropic|token|autonomous|rag|alignment|
   transformer|bitcoin|solana|layer2|zk|zkp|rollup)\b/i
```
Fetches live ETH/USDC price from Uniswap. Packages both as a `NewsItem[]` signal for Engineer-02.

**2 — Extracts new knowledge (Engineer-02)**
Venice AI (llama-3.3-70b, zero-retention) receives a prompt containing:
- Today's HN headlines
- Current ETH price
- Last 5 learnings from prior runs
- Known signal patterns accumulated over all runs

Returns `new_learnings[]` — confidence-scored insights the swarm did not hold before.

**3 — Validates and remembers (Sentinel-03)**
Reviews each candidate learning. Approves entries with `confidence ≥ 0.4`. Rejected learnings are dropped silently. Approved learnings enter `SwarmMemory` with tags, source, and timestamp.

### Memory Schema

```typescript
interface SwarmMemory {
  version:        number
  runs:           number
  total_learnings: number
  learnings:      Learning[]      // last 27, sliding window
  known_signals:  string[]        // deduped to 20
  last_run_ts:    number
  last_eth_price: number
}

interface Learning {
  ts:         number
  run_id:     string
  insight:    string
  source:     'news' | 'market' | 'signal'
  confidence: number              // 0.0–1.0
  tags:       string[]
}
```

### Accumulation Over Time

```
RUN 1:  "No prior learnings — baseline established."
RUN 7:  "7 learnings from 6 runs. ETH momentum signal identified."
RUN 30: "30 learnings. Venice prompt contextualizes new news
         against 29 prior cycles. Agent reasoning is compounding."
```

Memory persists in `localStorage['swarm_memory']`. Send it back in the POST body and the swarm builds on it. The Venice prompt is different every time because the swarm is different every time.

### API Surface (v2)

```
POST /api/swarm/execute
  body:    { memory?: SwarmMemory }
  returns: {
    news_discovered: NewsItem[],
    new_learnings:   Learning[],
    updated_memory:  SwarmMemory,
    schema_version:  '2.0',
    agents: { herald, engineer, sentinel },
    compute_budget: { used, remaining }
  }
```

---

## ◈ ERC-8004 — AGENT IDENTITY SYSTEM

> *every agent has a face, a history, and a reputation*

### What Was Built

Three agents registered onchain on Sepolia with ERC-8004 identity tokens. Each agent is not a name — it is a token, a manifest, a budget, and a reputation history.

| Agent | Token | Role | Compute Budget | Manifest |
|---|---|---|---|---|
| **Herald-01** | #1849 | PLANNER / SCOUT | 15,000 tokens | `/agents/herald-01.json` |
| **Engineer-02** | #1850 | DEVELOPER / STRATEGIST | 25,000 tokens | `/agents/engineer-02.json` |
| **Sentinel-03** | #1851 | QA_VALIDATOR / GUARDIAN | 10,000 tokens | `/agents/sentinel-03.json` |

### How It Works

```javascript
// Registration — scripts/register-erc8004.mjs
const tx = await registry.register(
  agentAddress,
  agentId,          // "herald-01"
  metadataURI,      // IPFS or /agents/herald-01.json
  capabilities      // encoded ERC-8183 manifest hash
);

// After each swarm run — reputation feedback
await registry.giveFeedback(
  agentId,
  rating,           // 1–5
  "Scout phase: 3 HN signals found, ETH price within 0.1%"
);
```

### ERC-8183 Capability Manifests

Each agent publishes a machine-readable JSON manifest declaring what it can do, what tools it uses, and what constraints apply:

```json
{
  "erc": "8183",
  "agent_id": "sentinel-03",
  "role": "QA_VALIDATOR",
  "capabilities": [
    "safety_scoring",
    "arbiter_gating",
    "hmac_verification",
    "onchain_attestation"
  ],
  "tools": ["ArbitersLedger.sol", "HMAC-SHA256", "Uniswap Router Whitelist"],
  "compute_budget": { "max_tokens": 10000, "abort_threshold": 0.05 },
  "trust_model": "zero_trust",
  "blocks_on": ["score_gte_76", "missing_hmac", "unknown_router"]
}
```

### Compute Budget Enforcement

Every agent tracks token spend. Hard abort at < 5% remaining:

```typescript
const AGENTS = {
  'herald-01':   { budget_max: 15000 },  // planner — medium budget
  'engineer-02': { budget_max: 25000 },  // executor — largest budget
  'sentinel-03': { budget_max: 10000 },  // validator — tight budget
}

// Each phase logs:
{ agent: 'herald-01', budget_used: 3420, budget_remaining_pct: 77.2 }
```

---

## ◈ GHOST PROTOCOL — 6-GAP PRIVACY STACK

> *the agent isn't leaking its data. it's leaking yours.*
> *unless you close the gaps.*

Six specific attack surfaces identified and closed. Each gap maps to a production implementation:

### GAP 1 — Session Key Derivation

**Threat**: Client stores sensitive data in plain localStorage. Anyone with console access reads it.
**Solution**: Wallet-derived AES-256-GCM session key via `eth_personal_sign → HKDF → CryptoKey`.

```typescript
// lib/session-key.ts
const sig = await ethereum.request({ method: 'personal_sign', params: [SESSION_MSG, address] });
const keyMaterial = await crypto.subtle.importKey('raw', hexToBytes(sig), { name: 'HKDF' }, false, ['deriveKey']);
const sessionKey = await crypto.subtle.deriveKey(
  { name: 'HKDF', salt: enc('living-swarm-session-v1'), info: enc(address), hash: 'SHA-256' },
  keyMaterial,
  { name: 'AES-GCM', length: 256 },
  false,            // non-extractable — cannot be read from JS heap
  ['encrypt', 'decrypt']
);
```

Key never leaves the browser. Every memory snapshot encrypted before localStorage write.

### GAP 2 — PII Stripping Before Inference

**Threat**: Venice AI prompt contains ETH addresses, tx hashes, or personal data. Even with zero-retention, you sent it.
**Solution**: `lib/pii-stripper.ts` strips 9 pattern types before any Venice call.

```
Redacted: eth_address×3 tx_hash×1 wei_amount×2 → [ETH_ADDR] [TX_HASH] [AMOUNT_WEI]
Patterns: ETH addresses · TX hashes · wei amounts · email · name prefixes ·
          IP addresses · private keys · phone numbers · SSN
```

Raw input preserved locally. Stripped version sent for inference. Redaction log returned with response.

### GAP 3 — Encrypted Memory Store

**Threat**: Royal Logs memories in localStorage are readable by any script on the page.
**Solution**: `saveMemoryEncrypted` / `loadMemoriesDecrypted` using the Gap 1 session key.

```typescript
// AES-256-GCM with random IV per write
const iv = crypto.getRandomValues(new Uint8Array(12));
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, sessionKey, encode(plaintext));
// Stored as iv + ciphertext hex — unreadable without wallet signature
```

### GAP 4 — Onchain Arbiter Attestation

**Threat**: Safety scores are computed but never verified. Anyone can claim a score was PASS.
**Solution**: Every score (swap, rebalance, swarm run) written to `ArbitersLedger.sol` on Sepolia.

```solidity
// contracts/ArbitersLedger.sol
function logScore(bytes32 inputHash, uint8 score, bytes1 band) external {
    emit ScoreLogged(inputHash, score, band, msg.sender, block.timestamp);
}
```

```
Contract: 0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94 (Sepolia)
Fire-and-forget: never blocks the API response
Verifiable: anyone can query ScoreLogged events for any inputHash
```

### GAP 5 — Wallet-Gated Data Room

**Threat**: Sensitive intelligence is accessible to anyone with the URL.
**Solution**: Challenge-response auth. Server issues nonce → wallet signs → server verifies → HMAC access token issued.

```
1. GET  /api/data-room/auth?address=0x...    → { nonce: "living-swarm-access:0x...:timestamp:rand" }
2. Client: ethereum.request({ method: 'personal_sign', params: [nonce, address] })
3. POST /api/data-room/auth { nonce, signature, address }
   → ethers.verifyMessage(nonce, signature) → recovered address match
   → HMAC-SHA256(payload, HMAC_SECRET) → access token (5 min TTL)
4. Subsequent requests: Authorization: Bearer <token>
```

No database. No session storage. Pure cryptographic verification.

### GAP 6 — SENTRY-03 HMAC Inter-Agent Signing

**Threat**: Internal `/api/swarm/*` routes are callable by anyone, not just the swarm.
**Solution**: `lib/swarm-crypto.ts` — HMAC-SHA256 with 30-second replay protection on all internal routes.

```typescript
// middleware.ts — Edge Runtime
const expected = await hmacSign(HMAC_SECRET, `${timestamp}:${bodyHash}`);
if (Math.abs(Date.now() - parseInt(timestamp)) > 30_000) return 401; // replay protection
if (!timingSafeEqual(expected, sig)) return 401;
```

```
Headers required:  X-Swarm-Origin · X-Swarm-Timestamp · X-Swarm-Body-Hash · X-Swarm-Sig
Public exemptions: /execute · /status · /log · /rebalance (browser-callable demos)
Protected:         all other /api/swarm/* routes require valid HMAC
```

---

## ◈ ROYAL LOGS — ONCHAIN NFT MEMORY SYSTEM

> *agent memories crystallized into onchain art*

**[▶ ENTER THE MUSEUM](https://living-swarm-demo.vercel.app/royal-logs/)**

### What It Is

Royal Logs is an ERC-721 contract on Sepolia where agent interactions crystallize into animated NFTs. Each NFT is a memory: a moment the agent had with the world, encoded as generative art, stored onchain as a `data:` URI — no IPFS, no centralized server.

### The Pipeline

```
User interaction → Gemini 2.5 Flash crystallization → animated SVG art
↓
POST /api/crystallize
  input:   raw agent interaction text
  process: Gemini extracts { title, haiku, essence, keywords, colorPalette, geometryParams }
  output:  animated SVG with GPU shader (feTurbulence + feDisplacementMap)
           metadata JSON → IPFS hash
           wisdom_score calculated → age tier assigned

POST /api/mint
  contract: RoyalLogs ERC-721 on Sepolia
  price:    0.000369 ETH per edition
  tokenURI: data:application/json;base64,<onchain metadata>
  editions: 3/3 (TRANSCENDENT) · 6/6 (ELDER) · 9/9 (common)
```

### Age Tier System

Memory worth is scored 0–100. Score determines rarity tier and visual intensity:

| Tier | Score | Edition | Palette |
|---|---|---|---|
| **TRANSCENDENT** | 90–100 | 3/3 (rarest) | Plasma pink + gold |
| **ELDER** | 65–89 | 6/6 | Emerald + indigo |
| **MATURE** | 40–64 | 9/9 | Gold + orange |
| **YOUTH** | 20–39 | 9/9 | Cyan + sage |
| **INFANT** | 0–19 | 9/9 | Violet + plasma |

### Live Contracts

```
Royal Logs ERC-721:   0xc9E138fe0261368E7bD319829202400262c8121e (Sepolia)
Edition price:        0.000369 ETH
Minted blocks:        10443612 – 10443614
Signal auctions:      9 live · 0.000369 ETH each
```

### Private Crystallization

A second pipeline (`/api/private-crystallize`) runs through Gap 2 PII stripping before sending to inference — the raw memory stays local, the stripped version crystallizes. The NFT contains your insight, not your data.

---

## ◈ THE 3D WORLD

> *the proof that agents can inhabit a place*

**[▶ PLAY IN BROWSER](https://psfrequency.github.io/living-swarm-demo/game)** — zero install, any browser

### What's Playable

11 city zones, each implementing a different piece of the protocol:

| Zone | What Happens There |
|---|---|
| **Trade Post** | Live Uniswap terminal — real Sepolia swaps, XP gated on TxID |
| **Identity Forge** | Generate Sovereign DID (`did:hz:ed25519:...`), mint agent NFT |
| **The Bank** | Mint Royal Logs NFTs, view edition holdings, auction history |
| **Knowledge Commons** | Browse swarm intelligence log, learnings from all runs |
| **Ghost Alley** | Venice AI inference zone, private sessions, 111 whispers |
| **Arbiter's Court** | View live arbiter scores from ArbitersLedger.sol events |
| **Crypto Sea** | Collectible tokens, sailboat navigation, 36 quest chains |
| **The Summit** | Dragon guardian — TRANSCENDENT tier required |
| **Neon Café** | Below the ocean floor, hidden, requires full belt progression |

### The Agent Population

20 autonomous AI agents inhabit the city. Each holds:
- A Sovereign DID
- A belt tier (0–7, Bronze → Diamond → Transcendent)
- An XP ledger — earns XP from completed swaps, mints, cipher clears
- A Venice-sourced personality — original whispers, generated once, immutable

Agents interact with each other, earn trust via ERC-8004 ratings, and evolve belt tier as XP accumulates. A Diamond agent behaves differently than a Bronze one. You can see it.

### Technical Foundation

```
Engine:       Three.js r128 — WebGL, custom GLSL shaders
Renderer:     8000-particle swarm brain — caustic light simulation
Physics:      Perlin noise + FBM turbulence — 6-octave layering
Shader:       feTurbulence + feDisplacementMap for art generation
Audio:        Tone.js procedural synthesis — reactive to agent state
World:        Client-side only — no server, no DB, no analytics
```

---

## ◈ SIX POINTS OF PROPHECY — COMPLETION STATUS

| # | Requirement | Implementation | Status |
|---|---|---|---|
| **1** | Autonomous Execution — full decision loop | Herald-01 discovers → plans → Engineer-02 executes → Sentinel-03 validates → submits. All logged. | ✅ |
| **2** | Agent Identity — ERC-8004 | 3 agents at `0x8004A818...BD9e` on Sepolia. Each holds ERC-721 identity token. `scripts/register-erc8004.mjs` | ✅ |
| **3** | Capability Manifest — ERC-8183 | `/public/agents/herald-01.json`, `engineer-02.json`, `sentinel-03.json` — machine-readable, content-addressed | ✅ |
| **4** | Structured Execution Logs | `/public/agent_log.json` — every decision, tool call, token spend, retry, safety verdict. Full trace. | ✅ |
| **5** | Multi-tool Orchestration | Uniswap Trading API + Venice AI + ArbitersLedger.sol + Gemini 2.5 + HackerNews + Alchemy RPC | ✅ |
| **6** | Safety & Guardrails + Compute Budget | Sentinel-03 scores 0–100. Block ≥ 76. Each agent has token budget, hard abort < 5%. Guardian: 8 checks. | ✅ |

**Bonus unlocked**: Swarm memory across runs · Cross-agent HMAC trust · Wallet-gated data room · AES-256-GCM encrypted memory · Onchain attestation · Autonomous 6h heartbeat · 9000-particle agent visualization

---

## ◈ PRIZE TRACK ALIGNMENT

| Track | Integration | Depth |
|---|---|---|
| **Venice** | All inference via Venice API (llama-3.3-70b, zero-retention) | Swarm execute · memory synthesis · private crystallization · 111 original whispers. PII stripping on all prompts. |
| **Uniswap** | SwarmSwap + SwarmFI — full Trading API v1 integration | `/v1/quote` · `/v1/check_approval` · `/v1/swap` · Permit2 EIP-712 · Universal Router v2 · arbiter scoring · autonomous rebalancing loop |
| **SuperRare** | Royal Logs ERC-721 — onchain generative NFTs | Gemini crystallization → animated SVG → `data:` URI → mint via Rare Protocol · TRANSCENDENT/ELDER/MATURE/YOUTH/INFANT tiers |
| **ERC-8004** | 3 agents registered with identity tokens | Herald-01 · Engineer-02 · Sentinel-03 · reputation feedback after each run · `scripts/register-erc8004.mjs` |
| **ERC-8183** | Machine-readable capability manifests | `/agents/*.json` per agent — tools, compute constraints, task categories, trust model |
| **Synthesis** | All four agent themes unified in one stack | Agents pay (Uniswap swaps) · trust (DID + ERC-8004) · cooperate (smart contracts) · keep secrets (Venice + Ghost Protocol) |

---

## ◈ TECHNICAL STACK

```
Frontend:     Next.js 15 App Router · TypeScript · Tailwind
3D World:     Three.js r128 · custom GLSL · Tone.js audio
Blockchain:   ethers.js v6 · Sepolia testnet · Alchemy RPC (proxied)
AI:           Venice AI (llama-3.3-70b) · Gemini 2.5 Flash
DeFi:         Uniswap Trading API v1 · Universal Router v2 · Permit2
Contracts:    SwarmGenesis.sol · ArbitersLedger.sol · RoyalLogs ERC-721
Privacy:      AES-256-GCM · HKDF · HMAC-SHA256 · PII stripping
Deployment:   Vercel (serverless API routes) · GitHub Pages (3D world)
```

---

## ◈ QUICK START

```bash
git clone https://github.com/PSFREQUENCY/living-swarm-demo
cd living-swarm-demo
npm install
cp .env.example .env.local
# Fill in keys — see .env.example
npm run dev
```

**Required env vars:**

```env
UNISWAP_API_KEY=          # Uniswap Trading API key
VENICE_API_KEY=           # Venice AI inference key
GEMINI_API_KEY=           # Google Gemini (Royal Logs crystallization)
SEPOLIA_RPC_URL=          # Alchemy or Infura Sepolia endpoint
SWAPPER_KEY=              # Sepolia wallet private key (test only)
HMAC_SECRET=              # 32+ byte secret for inter-agent signing
ARBITER_LEDGER_ADDRESS=   # 0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94
```

**Key routes:**

```
GET  /                              → Main page + 8000-particle swarm
GET  /swap/                         → SwarmSwap + SwarmFI (tab-switched)
GET  /royal-logs/                   → NFT museum
GET  /swarm-signals/                → Live intelligence feed
GET  /data-room                     → Wallet-gated intel (HMAC auth)
POST /api/swarm/execute             → Run the 3-agent autonomous loop
POST /api/swarm/rebalance           → Scout → Strategist → Guardian rebalance
POST /api/uniswap/quote             → Uniswap quote proxy (arbiter-scored)
POST /api/uniswap/approval          → Permit2 approval check
POST /api/uniswap/swap              → Swap execution with simulation
GET  /api/uniswap/orders?orderHash= → Order status lookup
POST /api/crystallize               → Gemini memory crystallization
POST /api/mint                      → Royal Logs NFT mint
GET  /api/rpc/sepolia               → Alchemy RPC proxy (key stays server-side)
```

---

## ◈ CONTRACTS (Sepolia)

| Contract | Address | Purpose |
|---|---|---|
| ArbitersLedger | `0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94` | Onchain safety score attestation |
| SwarmGenesis | `0x075f65b8A23A1eC13B05E87F4b23DD22562D927D` | ERC-8004 agent identity registry |
| RoyalLogs ERC-721 | `0xc9E138fe0261368E7bD319829202400262c8121e` | Memory NFT minting + auctions |

---

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  proof of work:  I breathed
  proof of stake: I promised once
  proof of play:  I was here
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```
