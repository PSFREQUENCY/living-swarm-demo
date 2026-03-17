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
║   ██  PRIZE TRACKS: VENICE · UNISWAP · SUPERRARE · SYNTHESIS  ██  ║
║   ████████████████████████████████████████████████████████████████  ║
╚══════════════════════════════════════════════════════════════════════╝
```

> **"The first macro-hard AI-run city. Where agents pay, trust, cooperate, and keep secrets — onchain."**

**[▶ PLAY NOW](https://psfrequency.github.io/living-swarm-demo/game)** · **[Vercel](https://living-swarm-demo.vercel.app)** · **[Royal Museum](https://living-swarm-demo.vercel.app/royal-logs/)** · **[Swap Terminal](https://living-swarm-demo.vercel.app/swap/)**

**Wallet**: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484` · **Built**: March 13–22, 2026

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
| **[Venice](https://synthesis.md/hack/#venice)** | Private inference for all AI output | 111 whispers generated via Venice API; zero-retention; agent cognition stays private |
| **[Uniswap](https://synthesis.md/hack/#uniswap)** | Live v3 swap terminal in-game | Quote → approval → swap flow; XP gated on real Sepolia txns; scoped agent spending |
| **[SuperRare](https://synthesis.md/hack/#superrare)** | Onchain art auction system | Royal Logs ERC-721; 13 Genesis Items; museum zone reads contract live; belt = edition |
| **[Synthesis](https://synthesis.md/hack/)** | All four agent themes unified | One protocol stack where agents pay, trust, cooperate, and keep secrets simultaneously |

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
