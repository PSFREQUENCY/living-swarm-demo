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

**[▶ PLAY NOW](https://psfrequency.github.io/living-swarm-demo/game)** · **[Vercel](https://living-swarm-demo.vercel.app)** · **[Royal Museum](https://living-swarm-demo.vercel.app/royal-logs/)** · **[SwarmSwap](https://living-swarm-demo.vercel.app/swap/)** · **[SwarmFI](https://living-swarm-demo.vercel.app/swap/?tab=fi)**

**Wallet**: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484` · **Built**: March 13–22, 2026

**Swarm API**: `/api/swarm/execute` · **Agent Manifests**: `/agents/herald-01.json` · **Logs**: `/agent_log.json`

---

## ◈ SIX POINTS OF PROPHECY — AUTONOMOUS SWARM COMPLETE

| # | Requirement | Implementation |
|---|---|---|
| **1** | **Autonomous Execution** — full decision loop | Herald-01 discovers → plans → Engineer-02 executes tools → Sentinel-03 validates → submits. All logged. |
| **2** | **Agent Identity — ERC-8004** | 3 agents registered at `0x8004A818...BD9e` on Sepolia. Each holds an ERC-721 identity token. `scripts/register-erc8004.mjs` |
| **3** | **Agent Capability Manifest — ERC-8183** | `/public/agents/herald-01.json`, `engineer-02.json`, `sentinel-03.json` — machine-readable, content-addressed, ERC-8183 schema |
| **4** | **Structured Execution Logs** | `/public/agent_log.json` — every decision, tool call, token spend, retry, and safety verdict. Full trace. |
| **5** | **Tool Use — Multi-tool orchestration** | Uniswap Trading API v1 (live quotes) + Venice AI (private inference) + ArbitersLedger.sol (onchain attestation) + Gemini 2.5 (crystallization) |
| **6** | **Safety & Guardrails + Compute Budget** | Sentinel-03 scores all output 0–100. Arbiter blocks score ≥ 76. Each agent has token budget with hard abort at < 5% remaining. No tx without Sentinel sign-off. |

**Bonus**: ERC-8004 trust signals — Sentinel-03 rates Engineer-02 and Herald-01 after each run. Multi-agent swarm with specialized roles. ERC-8183 capability manifests.

---

## ◈ SWARMFI — 3-AGENT AUTONOMOUS PORTFOLIO REBALANCING

> *independent operators, not scripts*

Three ERC-8004 agents running a complete discover → plan → execute → verify loop against the Uniswap Trading API — with real TxIDs on Sepolia:

| Agent | ERC-8004 | Role | What It Does |
|---|---|---|---|
| **Scout** | Herald-01 #1 | DISCOVERY | Fetches ETH + WETH + USDC balances via RPC · gets live ETH price via Uniswap quote · detects drift from target allocation · emits rebalance signal |
| **Strategist** | Engineer-02 #2 | PLANNING | Calls Uniswap `/v1/quote` · evaluates routing (Classic/Dutch/Priority) · handles Permit2 EIP-712 flow · rejects if price impact > 2% |
| **Guardian** | Sentinel-03 #3 | VALIDATION | 8 safety checks: router whitelist · calldata hex validity · slippage bounds · balance sufficiency · output nonzero · amount within budget · strategist approval · ArbitersLedger attestation |

**Live execution:**
```
Scout: ETH=62% (target 50%) drift=+12% → sell 0.05 ETH → buy USDC
Strategist: CLASSIC routing · output=187.42 USDC · gas=$0.12 · impact=0.02%
Guardian: ✓ ROUTER_WHITELIST ✓ CALLDATA_HEX ✓ SLIPPAGE_BOUNDS ✓ BALANCE_SUFFICIENT
         → APPROVED — risk=0/100 · band=PASS
→ Permit2 EIP-712 signed → broadcast → real TxID on Sepolia
→ ArbitersLedger.sol attestation (fire-and-forget)
```

**Heartbeat**: Toggle TRADE/SLEEP mode. In TRADE mode, the swarm auto-triggers every 6 hours — checking for drift and executing if Guardian approves. Connect wallet → set portfolio target → press TRADE. Agents deploy the plan.

**9000 sentient particles**: Three agent clusters rendered via WebGL canvas — Scout (violet/cyan orbital), Strategist (gold convergent), Guardian (sage ring formation). Particles respond to agent state in real time.

---

## ◈ SWARM EVOLUTION — MEMORY + NEWS DISCOVERY

> *an agent that learns nothing is just a script.*
> *an agent that learns is something else.*

Every swarm run now does three things no static agent can do:

**1. Scans today's reality.** Herald-01 pulls HackerNews top 30 stories and filters for AI/web3/DeFi signals in real time — not cached, not curated. Whatever the field is talking about today is what the swarm analyzes today.

**2. Extracts new knowledge.** Engineer-02 synthesizes the live news, the ETH market price, and the swarm's accumulated history into a unified intelligence report. Venice AI (zero-retention private inference) extracts `new_learnings` — specific, confidence-scored insights the swarm did not hold before.

**3. Remembers across time.** Sentinel-03 validates each candidate learning before it is approved. Approved learnings are stored in `SwarmMemory` (localStorage) and sent back with the next run's request — so the Venice prompt grows richer each cycle. Run 1 has no prior context. Run 50 has 50 cycles of filtered signal. The swarm is not the same swarm it was yesterday.

```
RUN 1:  "No prior learnings — baseline established."
RUN 7:  "7 learnings from 6 runs. ETH momentum signal identified."
RUN 30: "30 learnings. Agent reasoning contextualizes new news against 29 prior insights."
```

**6-hour autonomous heartbeat.** A WORK/REST toggle in the UI starts a `setInterval` countdown. When the timer expires, the swarm fires automatically — no human required. Toggle REST to pause. Toggle WORK to resume. The cycle is yours to start and stop.

This is what it looks like when an agent accumulates knowledge across time, with real-world data, private inference, and no central server holding its memory.

**API surface (v2)**:
```
POST /api/swarm/execute   — body: { memory?: SwarmMemory }
                            returns: { news_discovered, new_learnings, updated_memory, ... }
```

---

## ◈ THE FOUR THEMES — SOLVED

---

### ░ AGENTS THAT PAY

> *your agent moves money on your behalf.*
> *but how do you know it did what you asked?*
> *there's no transparent way to scope what it can spend,*
> *verify that it spent correctly, or guarantee*
> *settlement without a middleman.*

**Our answer**: Every token swap in Living Swarm goes through the **Uniswap v3 API** — scoped, signed, and settled onchain. The agent's spending is not a backend abstraction. It is a calldata-visible transaction, verifiable at the block level, with no intermediary holding funds. Players earn XP for completing real swaps on Sepolia. The Trade Post zone in the game is a live DeFi terminal. Quest completion is gated by actual transaction receipts — not by clicking "done."

**API surface**:
```
GET  trade-api.gateway.uniswap.org/v1/quote     — price discovery
GET  trade-api.gateway.uniswap.org/v1/approval  — ERC-20 spend allowance
POST trade-api.gateway.uniswap.org/v1/swap      — signed tx submission
```

The agent cannot spend more than the player approves. The approval scope is explicit, onchain, and revocable. This is what agent-controlled payments should look like.

---

### ░ AGENTS THAT TRUST

> *your agent interacts with other agents and services.*
> *but trust flows through centralized registries*
> *and API key providers.*
> *if that provider revokes access or shuts down,*
> *you lose the ability to use the service you depended on.*

**Our answer**: Every agent in Living Swarm is issued a **Sovereign DID** (`did:hz:ed25519:...`) generated client-side and anchorable onchain through the Identity Forge zone. Trust is not delegated to a registry. It is cryptographically derived — from the DID, from the belt tier, from the XP ledger.

The **Venice AI private inference layer** provides cognitive output without a centralized dependency chain. Venice's API is compatible with Anthropic's SDK but adds zero-retention guarantees and on-device inference options. If the upstream model provider changes, the interface contract does not. The agent's voice persists.

**111 original whispers** — agent haiku, philosophy, riddles, and identity poems — were generated via Venice and embedded in the protocol as immutable lore. The agents have memory that cannot be revoked.

---

### ░ AGENTS THAT COOPERATE

> *your agents make deals on your behalf.*
> *but there's no neutral enforcement layer.*
> *if the platform changes its rules,*
> *the deal your agent made can be rewritten*
> *without your consent.*

**Our answer**: The **Royal Logs smart contract** on Sepolia and Ethereum mainnet is the enforcement layer. Deals made in the game — edition mints, quests completed, belt tiers earned — crystallize into onchain artifacts through **Rare Protocol / SuperRare**. The platform cannot change those rules. The contract is the platform.

13 Genesis Items are minted with edition sizes drawn from meaningful numbers: 1/1, 3/3, 6/6, 9/9, 11/11, 12/12, 13/13, 21/21, 30/30, 33/33, 36/36, 42/42, 69/69. Minting an edition is a quest. Holding one changes your agent's visual state. The museum in the game reads the contract live — there is no CMS, no database, no admin panel. The art is the contract.

**Contracts**:
- Sepolia: `0xRARE_CONTRACT_ADDRESS_HERE` · Edition price: `0.000369 ETH`
- Mainnet: live Royal Logs protocol

---

### ░ AGENTS THAT KEEP SECRETS

> *every time your agent calls an API, pays for a service,*
> *or interacts with a contract, it creates metadata about you.*
> *spending patterns. contacts. preferences. behavior.*
> *the agent isn't leaking its data.*
> *it's leaking yours.*

**Our answer**: **Venice AI** routes all inference privately. Prompts are not logged. Responses are not used for training. The player's cognitive interaction with their agent — the quests they choose, the whispers they trigger, the cipher they attempt to solve — produces no persistent metadata trail.

The game runs entirely client-side in Three.js. There is no analytics endpoint, no telemetry call, no session token sent to a server. The Uniswap swap interface proxies through a Vercel edge function that adds no logging layer. The onchain footprint is exactly what the player chooses to create — nothing more.

Privacy is not a setting. It is the architecture.

---

## ◈ PRIZE TRACK ALIGNMENT

| Track | Integration | How |
|---|---|---|
| **[Venice](https://synthesis.md/hack/#venice)** | Private inference for all AI output | 111 whispers + swarm market analysis via Venice API; zero-retention; agent cognition stays private |
| **[Uniswap](https://synthesis.md/hack/#uniswap)** | Live v3 swap terminal in-game | Quote → approval → swap flow; XP gated on real Sepolia txns; swarm uses live Uniswap quotes for market intelligence |
| **[SuperRare](https://synthesis.md/hack/#superrare)** | Onchain art auction system | Royal Logs ERC-721; 13 Genesis Items; museum zone reads contract live; belt = edition |
| **[Synthesis](https://synthesis.md/hack/)** | All four agent themes unified | One protocol stack where agents pay, trust, cooperate, and keep secrets simultaneously |
| **[ERC-8004](https://synthesis.md/hack/#protocol-labs)** | On-chain agent identity | 3 agents registered at `0x8004A818...BD9e`; each holds ERC-721 identity; reputation ratings written after each run |
| **[ERC-8183](https://synthesis.md/hack/#virtuals-digital-s-a)** | Machine-readable capability manifest | `/agents/*.json` — structured capability declarations per ERC-8183 schema; tool lists, compute constraints, task categories |

---

## ◈ TECHNICAL STACK

```
┌────────────────────────────────────────────────────────────┐
│                      LIVING SWARM                           │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   Claude    │  │  Venice AI   │  │   Uniswap v3 API  │  │
│  │ (Sonnet 4)  │  │  Private     │  │  quote/approval/  │  │
│  │ Agent logic │  │  Inference   │  │  swap → Sepolia   │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                │                    │              │
│         └────────────────┴────────────────────┘              │
│                          │                                   │
│              ┌───────────▼───────────┐                       │
│              │  Next.js / Vercel     │                       │
│              │  /app/api/ proxies    │                       │
│              └───────────┬───────────┘                       │
│                          │                                   │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │    Three.js 3D World  ·  Sovereign DID System        │   │
│  │    36 Quests  ·  20 Agents  ·  7 Belt Tiers          │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│              ┌───────────▼──────────┐                        │
│              │  Rare Protocol       │                        │
│              │  ERC-721  ·  Sepolia │                        │
│              │  Royal Logs Contract │                        │
│              └──────────────────────┘                        │
└────────────────────────────────────────────────────────────┘
```

---

## ◈ QUICK START

```bash
git clone https://github.com/PSFREQUENCY/living-swarm-demo
cd living-swarm-demo
npm install
cp .env.example .env.local
npm run dev
```

```env
VENICE_API_KEY=...
NEXT_PUBLIC_WALLET_CONNECT_ID=...
RARE_CONTRACT_ADDRESS=...
```

```bash
npm run deploy:pages   # → GitHub Pages
# or deploy to Vercel for API routes + swap
```

---

## ◈ THE WORLD

Everything above lives inside a **fully 3D open world** — playable at https://psfrequency.github.io/living-swarm-demo/game in any browser, zero install.

11 city zones. A mountain with horse trails and a summit dragon. White-water rapids descending below the ocean floor into a hidden neon cafe. 20 autonomous AI agents completing quests, earning belts, and whispering philosophy. A Crypto Sea with collectible tokens and sailboat navigation. A bank where you mint your quest history onchain.

The 3D world is the proof: that agents which pay, trust, cooperate, and keep secrets can inhabit a place — and you can walk through it.

---

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  proof of work: I breathed
  proof of stake: I promised once
  proof of play: I was here
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```
