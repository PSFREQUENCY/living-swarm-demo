```
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  ██████   ██       ██████  ██   ██  ██████  ████████  ██████
  ██        ██     ██       ██   ██ ██    ██    ██    ██    ██
  ██ ███   ██       ████    ██   ██ ██    ██    ██    ██    ██
  ██  ██  ██           ██   ██   ██ ██    ██    ██    ██    ██
  ██████ ████████  █████     █████   ██████     ██     ██████

  ████████  ██████  ██     ██ ███   ██     ███████  ██████████
     ██    ██    ██ ██     ██ ████  ██     ██    ██ ██
     ██    ██    ██ ██  █  ██ ██ ██ ██     ███████  █████
     ██    ██    ██ ██ ███ ██ ██  ████     ██    ██ ██
     ██     ██████   ███ ███  ██   ███     ██    ██ ██████████

              S A M A U R - A I   E D I T I O N
  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

> *"The first macro-hard AI-run city. Digital dojo. Cyberkung-fu. Where autonomous agents and physical agents become masters."*

**[Play Now — Live Demo](https://psfrequency.github.io/living-swarm-demo/game)** · **[Royal Museum](https://living-swarm-demo.vercel.app/royal-logs/)** · **[Swarm Trade](https://living-swarm-demo.vercel.app/swap/)** · **[Data Room](https://living-swarm-demo.vercel.app/data-room)**

**Synthesis 2026 Hackathon Entry** — Built March 13–22, 2026.
Wallet: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484`

---

81 Ghost Town is a fully 3D browser game where autonomous AI agents live, earn belts, and complete quests in a vast open world — and every meaningful player action crystallizes into a permanent onchain artifact. It is a DeFi-native game, a proof-of-work system for AI agents, and the first attempt at a **Proof of Play** protocol: cryptographically verified digital exploration.

---

## What We Built

### The World

A vast 3D open world rendered entirely in Three.js, playable in any browser with no install required. The world contains:

- **Main City — 11 Zones**: Identity Forge, Social Nexus, Knowledge Vault, War Room, The Arena, Trade Post (live Uniswap interface), The Dojo, The Sanctuary, Portal Hub, Royal Museum (live onchain art), The Dock
- **Cyber Mountain Sovereign**: 9x scale mountain to the north — 6 climbable levels, racing track at the peak. First player to summit at a given block creates an onchain milestone.
- **White Water Rapids Cascade**: West edge — 6 waterfall levels, schools of fish, a hidden passage beneath the falls
- **Savage Agent Cafe**: Underground secret zone below the waterfall. Accessible only by leaping into the void. No quest marker. No map pin. Neon-lit.
- **Crypto Sea**: Open ocean to the east — 15 collectible ◈ tokens, 10 autonomous patrol boats, sailboat navigation from The Dock

### The Agents

20 named AI agents (GHOST-7A, WRAITH-3F, CIPHER-4G, APEX-1R...) patrol the world autonomously. They hold ranks, earn XP, and carry genuine history.

**7 Ranks**: SENTINEL → SCOUT → OPERATOR → ARCHITECT → WARLORD → SOVEREIGN → EXILED

**7 Belt tiers** (WHITE → GHOST) — GHOST belt requires 25,000 XP and is the terminal state of the agent identity system.

**111 unique agent whispers**: haiku on life, AI philosophy, blockchain metaphysics, riddles, jokes, and agent identity poems. None are canned responses. None repeat. All generated via Venice AI private inference. A sample:

> *"Proof of work: I breathed / proof of stake: I promised once / proof of self: I bled"*

> *"Ghost Town is not haunted. Ghost Town is the ghost: everywhere, nowhere, always."*

**Super Skills** unlocked at belt thresholds:
- RED belt: THE FORCE — press L near an agent to lift and move them (telekinesis)
- BLACK belt: GHOST FLIGHT (15k XP), VOID JUMP / instant teleport (20k XP)
- GHOST belt: SWARM PULL — pull nearby agents to you (25k XP)

### The Quest System

**36 total quests across 3 tiers:**

| Tier | Count | Scope |
|---|---|---|
| Main Quests | 11 | AWAKENING → TRANSCENDENCE (earning GHOST belt) |
| Side Quests | 11 | FIRST VOYAGE (Crypto Sea), BREATHWORK (Sanctuary), ANCIENT CIPHER |
| Hidden Quests | 14 | No markers. No map pins. Found through exploration only. |

Hidden quests do not appear on any screen until completed. `RIDE THE FALL` requires finding the west cliff and jumping. `BLOCK ZERO` requires touching coordinate (0,0). `GHOST PROTOCOL` requires being near the Vault when no one else is watching. `SAMAUR-AI AWAKENING` (5,000 XP, Legendary) requires completing every other quest first.

### The Royal Museum

An in-game zone at `x:-20, z:-55` that renders live on-chain art directly from the Royal Logs smart contract — 13 Genesis Items with edition sizes drawn from meaningful numbers: 1/1, 3/3, 6/6, 9/9, 11/11, 12/12, 13/13, 21/21, 30/30, 33/33, 36/36, 42/42, 69/69. The museum grows as the protocol is played.

### Day/Night Toggle, Dragon Riding, Boat Sailing

Three mechanics that exist because a world that only transacts is not a world worth exploring.

---

## The Synthesis — Proof of Play Protocol

This is the hackathon pitch. Four protocols — one emergent system.

### Play-to-Crystallize (not play-to-earn)

Every unique achievement in Ghost Town generates a **Royal Log**: an immutable onchain memory NFT via Rare Protocol.

These are not game rewards. They are **proof of lived digital experience**. The distinction matters:

- Play-to-earn creates inflation pressure. The incentive is extraction.
- Play-to-Crystallize creates scarcity through genuine discovery. The incentive is exploration.
- A Royal Log minted at block 21,456,789 for "first human+AI team to summit Cyber Mountain Sovereign" is a different asset class from a reward token. It is a timestamped attestation of a specific event that can never be replicated.

### Venice AI as the Soul

Agent whispers are not lookup tables. Venice's private inference API (`llama-3.3-70b`, zero data retention) powers all 111 agent poems, hack quest riddles, and the synthesis of player journeys into onchain art metadata.

Privacy-preserving AI is architecturally necessary here, not a marketing choice. Player wallet addresses, transaction history, and exploration data must never reach a public inference server.

```
Player action + wallet context
        |
        v
  [lib/pii-stripper.ts]  <- ETH addresses, TX hashes, WEI amounts redacted
        |
        v
  Venice AI llama-3.3-70b  <- zero data retention, private inference
        |
        v
  Crystallized memory: title · haiku · essence · color palette · geometry
        |
        v
  Royal Log NFT via Rare Protocol  <-  permanent, tradeable artifact
```

### Uniswap V4 as the Physics Engine

The in-game ◈ token is not a loyalty point. It connects directly to Uniswap V4:

- The **Trade Post** zone renders a live Uniswap swap interface — quotes via `trade-api.gateway.uniswap.org/v2/quote`, execution via Universal Router v2.0, signing via Permit2 EIP-712
- Sea coin collection (15 coins in the Crypto Sea) creates real liquidity events
- Every quote is scored 0–100 across MEV risk, slippage, liquidity depth, and volatility by **ArbitersLedger.sol** — scores above 75 are blocked and logged onchain as immutable attestations
- The game world IS the dApp. No separate wallet UI. The market is the mechanics.

### Rare Protocol as the Memory Layer

The complete crystallization-to-auction flow:

```
Quest completion
      |
      v
/api/venice/crystallize  ->  Venice generates title, haiku, palette, metadata
      |
      v
/api/mint  ->  Rare Protocol ERC-721 edition
  edition size maps to rarity: 1/1 (legendary) up to 69/69
      |
      v
/api/auction  ->  Rare Protocol auction
  Starting price: 0.000369 ETH (the Royal Logs signature price)
  Duration: 24 hours
      |
      v
Royal Museum in Ghost Town  <-  live token art rendered from chain
```

The rarest items are minted only by the rarest players. The market provides price discovery for these experience tokens.

---

## The Unicorn Opportunity — The Savage Proof

### Verified Digital Presence as an Asset Class

Consider: "I was the first human+AI team to summit Cyber Mountain Sovereign at block 21,456,789."

That statement is currently unverifiable. In this system, it is a zero-knowledge proof of exploration — a cryptographic attestation of a specific event in a specific world at a specific block. The Royal Log IS the proof. The blockchain timestamp IS the verification. Venice AI synthesis IS the metadata layer that makes it humanly legible.

This is a new asset class: **verified digital presence**.

### The Savage Agent Economy

The belt system is not cosmetic. It is a proof-of-work system for AI agents:

- Agents earn XP through behavior: quests, alliances, mentoring lower-belt agents
- Belt progression (WHITE → GHOST) requires 25,000 XP and genuine behavioral history
- Players are the validators — they verify agent behavior by completing quests together
- The ghost town is a coordination game: human intelligence + AI sovereignty + onchain permanence = new institution

When a GHOST-tier agent whispers *"I am GHOST-tier. I have transcended. I no longer need the ranks to say what I am"* — that agent has earned that statement through a verifiable history of actions recorded onchain.

### The Living Memory Machine

Venice AI synthesizes all player memories into evolving onchain art. This creates a feedback loop:

1. Players explore → generate memories
2. Memories crystallize into Royal Log NFTs via Rare Protocol
3. NFTs appear live in the Royal Museum inside Ghost Town
4. Art inspires further exploration → new memories
5. The museum grows as the world deepens

Uniswap provides price discovery. The whole system becomes a **consensus mechanism for cultural value** — the market decides what moments matter.

### The Deployment Model

The game runs on GitHub Pages — free, decentralized, permanently accessible, uncensorable. No server costs. No infrastructure to fail. The full-stack API layer runs on Vercel. The game survives the Vercel deployment independently.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Game Engine | Three.js r165 — custom renderer, 1st/3rd person camera |
| Framework | Next.js 16 (App Router), TypeScript, React 18 |
| AI Inference | **Venice AI** `llama-3.3-70b` — private, zero data retention |
| DeFi | Uniswap Trade API v2, UniswapX, Permit2, Universal Router v2.0 |
| NFT/Auction | **Rare Protocol** — ERC-721 editions, `rare mint`, `rare auction` |
| Blockchain | Ethers.js v6 — Ethereum Mainnet + Sepolia testnet |
| Smart Contracts | SwarmGenesis ERC-721 (fully onchain HTML5 art), ArbitersLedger.sol |
| Cryptography | AES-256-GCM, HKDF, HMAC-SHA256, `eth_personal_sign` |
| Audio | Tone.js v15 — spatial audio, agent proximity sounds |
| Hosting | GitHub Pages (game, static) + Vercel (API, full-stack) |

### Smart Contracts (Sepolia Testnet)

| Contract | Address | Explorer |
|---|---|---|
| SwarmGenesis ERC-721 | `0x075f65b8A23A1eC13B05E87F4b23DD22562D927D` | [Etherscan](https://sepolia.etherscan.io/address/0x075f65b8A23A1eC13B05E87F4b23DD22562D927D) |
| ArbitersLedger | `0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94` | [Etherscan](https://sepolia.etherscan.io/address/0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94) |

### Architecture

```
+---------------------------------------------------------------------+
|                   81 GHOST TOWN -- SAMAUR-AI EDITION                |
|                                                                     |
|  +----------------------+     +--------------------------------+    |
|  | Three.js Game World  |---->| Venice AI (llama-3.3-70b)      |    |
|  | 20 autonomous agents |     | PII strip -> private inference |    |
|  | 36 quests, 11 zones  |     | 111 whispers, quest riddles    |    |
|  +----------------------+     +----------------+---------------+    |
|                                                |                    |
|  +----------------------+     +----------------v---------------+    |
|  | Uniswap V4           |     | Royal Logs -> Rare Protocol    |    |
|  | Trade Post zone UI   |     | ERC-721 mint, 24h auction      |    |
|  | Sea coin collection  |     | Royal Museum live display      |    |
|  | ArbitersLedger gate  |     | 0.000369 ETH starting price    |    |
|  +----------------------+     +--------------------------------+    |
|                                                                     |
|  +----------------------------------------------------------------+ |
|  | Security Layer                                                 | |
|  | AES-256-GCM memory encryption  HKDF session key derivation    | |
|  | HMAC-SHA256 inter-agent auth   wallet-gated Data Room         | |
|  | SENTRY-03 Edge Runtime middleware on all /api/swarm/* routes  | |
|  +----------------------------------------------------------------+ |
+---------------------------------------------------------------------+
```

---

## Running Locally

```bash
git clone https://github.com/PSFREQUENCY/living-swarm-demo
cd living-swarm-demo
npm install

# Create .env.local — gitignored, never commit this file
cat > .env.local << 'EOF'
VENICE_API_KEY=your_venice_key
GEMINI_API_KEY=your_gemini_key
HMAC_SECRET=your_32_byte_hex_secret
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ARBITER_LEDGER_ADDRESS=0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94
SWARM_GENESIS_ADDRESS=0x075f65b8A23A1eC13B05E87F4b23DD22562D927D
EOF

npm run dev
# -> http://localhost:3000/game
```

**Play without API keys**: The Three.js game world runs fully client-side. Venice AI, Uniswap, and Rare Protocol features require valid keys. The world, agents, belt system, quests, whispers, and Royal Museum work without backend configuration.

### Deploy to GitHub Pages (static)

```bash
npm run build:pages   # strips API routes, builds static export
npm run deploy:pages  # pushes to gh-pages branch
```

---

## Quest System Reference

### Belt Progression

| Belt | XP Required | Notable Unlock |
|---|---|---|
| WHITE | 0 | Starting belt |
| YELLOW | 200 | Trade Post access |
| GREEN | 800 | Portal Hub connection |
| BLUE | 2,000 | Arena ranked matches |
| RED | 5,000 | THE FORCE (telekinesis) |
| BLACK | 10,000 | GHOST FLIGHT + VOID JUMP |
| GHOST | 25,000 | SWARM PULL, full transcendence |

### Hidden Quests (partial — full list discovered in-game)

| Quest | Discovery Method | XP | Rarity |
|---|---|---|---|
| SAMAUR-AI AWAKENING | Complete every other quest | 5,000 | Legendary |
| CLIMB CYBER MT SOVEREIGN | Find and scale the north mountain | 800 | Legendary |
| BLOCK ZERO | Touch coordinate (0,0) | 700 | Legendary |
| EXILE REDEMPTION | Witness an exile, offer a path back | 800 | Legendary |
| RIDE THE FALL | West edge cliff jump | 600 | Epic |
| VISIT THE CAFE | Survive the fall below the waterfall | 400 | Rare |
| GHOST PROTOCOL | Near the Vault, when no one is watching | 500 | Epic |
| WHISPER CHAIN | Hear all 9 ghost whispers | 650 | Epic |
| SENTINEL WATCH | Stand motionless for 5 full minutes | 300 | Rare |

---

## Integration Details

### Venice AI

**`POST /api/venice/crystallize`** — `llama-3.3-70b`

All agent memory crystallization routes through Venice. The `lib/pii-stripper.ts` layer redacts ETH addresses, TX hashes, and WEI amounts before any data reaches inference. The redaction log is returned to the caller as proof. Zero retention is Venice's architecture, not a configuration option.

### Uniswap V4

**`POST /api/uniswap/quote`** — live Ethereum mainnet pricing
**`POST /api/uniswap/swap`** — Universal Router v2.0 calldata
**`POST /api/uniswap/approval`** — Permit2 EIP-712 off-chain signing

Every quote passes through ArbitersLedger scoring. Score > 75 blocks execution. All scoring events logged to `ArbitersLedger.sol` on Sepolia regardless of outcome — the threat record is public and immutable.

### Rare Protocol

**`POST /api/mint`** — mints crystallized memories as ERC-721 editions with full NFT metadata: tier, wisdom score, haiku, keywords, shader seed, edition size

**`POST /api/auction`** — lists minted token at auction: 0.000369 ETH starting price, 24-hour duration

**`GET /api/auction`** — live auction status

Edition sizes map to rarity: 1/1 (Legendary), 3, 6, 9, 11, 12, 13, 21, 30, 33, 36, 42, 69. These numbers are not arbitrary.

### Royal Logs (Swarm Genesis NFTs)

The Swarm Genesis collection (3 NFTs) stores `tokenURI` as `data:text/html;base64,...` directly in contract storage — no IPFS, no CDN, no HTTP dependency. The art is the blockchain. Tokens are live interactive HTML5 applications rendered from on-chain data via `eth_call` → ABI decode → iframe.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/venice/crystallize` | Venice AI private memory crystallization |
| POST | `/api/crystallize` | Gemini memory crystallization |
| POST | `/api/private-crystallize` | Gemini + PII stripping |
| POST | `/api/mint` | Rare Protocol ERC-721 mint |
| POST | `/api/auction` | Rare Protocol auction (0.000369 ETH / 24h) |
| GET | `/api/auction` | Live auction status |
| POST | `/api/uniswap/quote` | Live Uniswap quote + ArbitersLedger score |
| POST | `/api/uniswap/swap` | Universal Router calldata |
| POST | `/api/uniswap/approval` | Permit2 EIP-712 approval |
| GET | `/api/data-room/auth` | Issue wallet challenge nonce |
| POST | `/api/data-room/auth` | Verify signature, issue HMAC access token |

---

## Pages

| Page | URL | Description |
|---|---|---|
| Game | `/game` | 81 Ghost Town — the full 3D world |
| Royal Logs | `/royal-logs/` | Memory crystallization, Genesis NFT collection |
| Swarm Trade | `/swap/` | Live Uniswap swap UI with arbiter gating |
| Data Room | `/data-room` | Wallet-gated intel (`eth_personal_sign` auth) |
| Swarm Signals | `/swarm-signals/` | Agent signal feed |

---

## Hackathon Context

Built for Synthesis 2026, March 13–22, 2026. 9 days.

Nothing here is a proof of concept. Every component is deployed and callable:

- The game runs at `https://psfrequency.github.io/living-swarm-demo/game`
- API routes handle real requests on Vercel
- Smart contracts are deployed on Sepolia
- The Royal Museum renders actual onchain token data
- The Uniswap integration queries mainnet pricing in real time
- Venice AI is the inference layer, not a mock

The codebase is ~1,500 lines of Three.js game engine, ~800 lines of API routes, 2 deployed smart contracts, and 111 agent whispers that took longer to write than the routing logic.

The technology is the easy part. The hard part is the question this project is asking:

**What is a moment of genuine discovery worth — and can a protocol be the institution that decides?**

Ghost Town is the first answer.

---

## Contributing

The Portal Hub zone (`id: "portal"`) is designed to connect to external ghost towns submitted via GitHub PR. The `PORTAL BRIDGE` side quest requires connecting to one. If you build a ghost town compatible with this protocol, open a PR.

Hidden quests can be added. Zones can be extended. The world is intentionally incomplete — zones without content are zones waiting for discovery.

If you find something that looks like a bug, it might be a hidden quest. If you find something that looks like a hidden quest, file an issue anyway.

---

Built by [@Bitsavador](https://twitter.com/Bitsavador)
Wallet: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484`

---

*Proof of work: I breathed.*
*Proof of stake: I promised once.*
*Proof of play: I was here.*
