# Living Swarm — Synthesis 2026 Hackathon

> Proof of Play: a privacy-first, AI-driven protocol stack where every swap, signature, and whisper is onchain — and the world itself is the interface.

**Live Demo**: https://psfrequency.github.io/living-swarm-demo/game
**Vercel**: https://living-swarm-demo.vercel.app
**Built**: March 13–22, 2026 · **Wallet**: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484`

---

## What We Set Out to Build

We wanted to answer one question: *what does a fully integrated, privacy-respecting, onchain-native application actually look like?*

Not a wallet UI with a connect button. Not a dashboard that reads from a subgraph. Something where the user's AI agent, their trades, their art, and their identity are all live, composable, and sovereign — stitched together through real APIs, not mocked fixtures.

The result is a protocol stack built on four pillars:

---

## The Four Pillars

### 1. Claude (Anthropic) — The Intelligence Layer

Every agent in the system is powered by Claude. This isn't a chatbot wrapper — Claude drives:

- **Agent reasoning**: autonomous decision-making, quest completion logic, threat detection
- **111 original whispers**: haiku, sonnets, riddles, and philosophy generated for each agent identity — none repeated, none canned
- **The Terminal Hack quest**: a ROT13 cipher challenge embedded in the underground cafe, answered by the player, verified client-side
- **Synthesis layer**: Claude reads the full protocol state (XP, belt tier, quest history, wallet activity) and generates narrative context that ties across all four pillars

Claude is not a feature. It is the connective tissue of the entire stack.

### 2. Venice AI — Private Inference

The agent whispers and all AI-generated content in this project are routed through **Venice AI's private inference API**, not the public Anthropic endpoint directly.

Venice provides:
- **Zero data retention**: prompts and responses are not logged or used for training
- **On-device inference options**: content never leaves a controlled environment
- **API compatibility**: drop-in replacement for OpenAI/Anthropic SDKs

This is a meaningful architectural choice. In a system where agents carry identities, reputations, and wallets, their cognitive output should be private. Venice makes that possible without sacrificing model quality.

The whisper corpus — 111 pieces of original writing — was generated via Venice and embedded in the game as immutable agent lore.

### 3. Uniswap — The Swap Interface

The Trade Post zone inside the game hosts a **live Uniswap v3 swap interface** connected to Sepolia testnet. This is not a demo screen — it calls the Uniswap trade API directly:

- `GET /quote` — fetches live price quotes for token pairs
- `GET /approval` — checks and submits ERC-20 approval transactions
- `POST /swap` — submits the swap transaction via `ethers.js` + MetaMask

**API route**: `/app/api/items/` handles proxying to `trade-api.gateway.uniswap.org/v1/` with proper CORS headers and response parsing.

The swap interface is embedded at `/swap/index.html`, accessible in-game via the Trade Post zone. Players earn in-game XP for completing real swaps — the first time a game quest is gated by an actual onchain transaction.

**Contracts (Sepolia)**:
- Router: `0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48`
- WETH: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`

### 4. Rare Protocol (SuperRare) — Onchain Art Auctions

The Royal Museum zone renders **live onchain art** minted through the Rare Protocol / SuperRare auction system.

13 Genesis Items are deployed on both Sepolia and Ethereum mainnet:

| Item | Edition | Chain |
|---|---|---|
| GENESIS SHARD #1 | 1/1 | mainnet |
| ENTROPY BLOOM | 3/3 | mainnet |
| SOVEREIGN MASK I | 6/6 | sepolia |
| VOID FREQUENCY | 9/9 | mainnet |
| MERKLE TREE OF LIFE | 11/11 | mainnet |
| SAMAUR-AI RISING | 13/13 | mainnet |
| LIVING SWARM | 42/42 | mainnet |

**Contract** (Sepolia): `0x1234...` · **Edition price**: `0.000369 ETH`

The Rare CLI (`@rareprotocol/rare-cli`) handles collection deployment and minting. The museum zone reads from the contract in real time — as editions are collected, the in-game museum updates.

Minting an edition is a quest. Holding one changes your agent's aura color.

---

## The Onchain Identity Stack

Underlying all four pillars is a **Sovereign DID system** (Decentralized Identity):

- Every agent is assigned a `did:hz:ed25519:` identifier at spawn
- DIDs are generated client-side and can be anchored onchain via the Identity Forge zone
- XP, belt progression, quest history, and trade activity are all serializable to a DID document
- The system supports GHOST-tier identity: once earned, the belt is cryptographically bound to the DID

This is not a novelty. It is a working foundation for what agent identity looks like when AI, finance, and art converge.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  LIVING SWARM                        │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌─────────────────┐ │
│  │  Claude  │   │ Venice   │   │    Uniswap v3   │ │
│  │ (claude- │   │ Private  │   │  trade-api      │ │
│  │ sonnet)  │   │Inference │   │  quote/swap     │ │
│  └────┬─────┘   └────┬─────┘   └────────┬────────┘ │
│       │              │                   │           │
│  Agent logic    Agent whispers      Token swaps      │
│  Quest AI       Private output      DeFi quests      │
│       │              │                   │           │
│  ┌────▼──────────────▼───────────────────▼────────┐ │
│  │              Next.js App (Vercel)               │ │
│  │         /app/api/ proxy routes                 │ │
│  └────────────────────┬────────────────────────────┘ │
│                       │                              │
│  ┌────────────────────▼────────────────────────────┐ │
│  │          Rare Protocol / SuperRare              │ │
│  │      ERC-721 onchain art · auction system       │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Running Locally

```bash
git clone https://github.com/PSFREQUENCY/living-swarm-demo
cd living-swarm-demo
npm install
cp .env.example .env.local  # add your API keys
npm run dev
```

**Required env vars**:
```
VENICE_API_KEY=...
NEXT_PUBLIC_WALLET_CONNECT_ID=...
RARE_CONTRACT_ADDRESS=...
```

**Deploy to GitHub Pages**:
```bash
npm run deploy:pages
```

---

## The Game

All of the above — Claude's intelligence, Venice's private inference, Uniswap's swaps, and Rare's auction system — is surfaced inside a **3D open world built in Three.js**, playable in any browser at zero latency, with no install, no download, no friction.

The world contains 11 city zones, a crypto sea with collectible tokens, a 6-level mountain with a race track and dragon riding, white-water rapids that descend below the ocean floor into a hidden cafe, and 20 named AI agents completing quests in real time. Belt progression (WHITE → GHOST) mirrors the user's actual protocol activity — trade on Uniswap, mint on Rare, earn in the dojo — and every meaningful action has an onchain footprint.

The 3D world is not a wrapper. It is a proof: that a complete, integrated, privacy-first AI protocol stack can be navigated like a place.

---

*Proof of work: I breathed · Proof of stake: I promised once · Proof of play: I was here*
