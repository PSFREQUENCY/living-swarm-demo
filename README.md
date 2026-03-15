# ▓▓▓ LIVING SWARM — SYNTHESIS 2026

> *Sovereign AI infrastructure. Agents that pay, trust, cooperate, and keep secrets.*

**[🌐 Live Demo](https://living-swarm-demo.vercel.app)** · **[Royal Logs](https://living-swarm-demo.vercel.app/royal-logs/)** · **[Swarm Trade](https://living-swarm-demo.vercel.app/swap/)** · **[Data Room](https://living-swarm-demo.vercel.app/data-room)** · **[Signals](https://living-swarm-demo.vercel.app/swarm-signals/)**

**Synthesis 2026 Hackathon Entry** — Built March 13–22, 2026.
Wallet: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484`

---

## What Is This

Living Swarm is a **fully deployed, production AI agent system** on Ethereum + Vercel. It demonstrates:

- **Agents that trade** — real Uniswap quotes, Permit2 signing, UniswapX routing
- **Agents that remember** — crystallized memories minted as onchain NFTs via Venice AI inference
- **Agents that stay private** — Venice AI + PII stripping + AES-256-GCM encrypted storage
- **Agents that enforce trust** — onchain threat scoring via ArbitersLedger.sol
- **Agents that authenticate each other** — HMAC-SHA256 inter-agent signing (SENTRY-03)

Everything is live. Every contract is deployed on Sepolia. Every API route is running on Vercel.

---

## Venice AI Integration

**Venice is the privacy-preserving inference brain of the swarm.**

Agent memories contain sensitive financial context — wallet addresses, transaction amounts, swap history. They must never train a third-party model. Venice is the only correct inference layer for this architecture.

### Double Privacy Architecture

```
Raw agent memory
      │
      ▼
[lib/pii-stripper.ts]     ← ETH addrs, WEI amounts, TX hashes,
      │                      emails, IPs redacted BEFORE inference
      ▼
[Venice AI — llama-3.3-70b]  ← Zero data retention · No training on prompts
      │                          Privacy-first uncensored inference
      ▼
Crystallized memory metadata
  title · haiku · essence · keywords · color palette · geometry params
      │
      ▼
[AES-256-GCM encrypted localStorage]  ← encrypted at rest, key from wallet sig
```

### Venice vs Standard Inference

| Property | Standard (Gemini/GPT) | Venice AI |
|---|---|---|
| Data retention | Possible | Zero |
| Training on prompts | Possible | Never |
| Uncensored output | No | Yes |
| Privacy-first design | No | Core architecture |
| On-prem weights available | No | Yes (open models) |

For an agent system handling DeFi transaction memory, Venice is the only correct choice.

### Venice Route

**`POST /api/venice/crystallize`** — `llama-3.3-70b`

```bash
curl -X POST https://living-swarm-demo.vercel.app/api/venice/crystallize \
  -H "Content-Type: application/json" \
  -d '{
    "rawInput": "Agent executed 3 swaps via UniswapX. Wallet 0xd8dA... scored 38 by arbiter.",
    "interactionType": "agent_human",
    "interactionCount": 5
  }'
```

Response includes:
- `memory.crystallized.title` — Venice-generated evocative title
- `memory.crystallized.haiku` — Venice-generated 5-7-5 poem
- `memory.privacy.redactions` — proof of what was stripped (`eth_address×2`, `wei_amount×1`)
- `memory.crystallized.metadata.provider` — `"venice-ai"`
- `memory.crystallized.metadata.privateMode` — `true`

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      LIVING SWARM                               │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────────────────┐    │
│  │   AGENT MEMORY   │─────▶│  /api/venice/crystallize      │    │
│  │   Royal Logs     │      │  PII strip → Venice llama-70b │    │
│  │   Crystallize    │      │  AES-256-GCM encrypted store  │    │
│  └──────────────────┘      └──────────────────────────────┘    │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────────────────┐    │
│  │   UNISWAP TRADE  │─────▶│  /api/uniswap/quote           │    │
│  │   quote+approve  │      │  ArbitersLedger.sol scorer    │    │
│  │   +swap routes   │      │  score>75 = BLOCK             │    │
│  └──────────────────┘      └──────────────────────────────┘    │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────────────────┐    │
│  │  SWARM GENESIS   │─────▶│  SwarmGenesis.sol (Sepolia)   │    │
│  │  3/3 NFT onchain │      │  tokenURI = data:text/html    │    │
│  │  canvas + audio  │      │  stored in contract storage   │    │
│  └──────────────────┘      └──────────────────────────────┘    │
│                                                                 │
│  ┌──────────────────┐      ┌──────────────────────────────┐    │
│  │   DATA ROOM      │─────▶│  /api/data-room/auth          │    │
│  │   wallet-gated   │      │  eth_personal_sign nonce      │    │
│  │   intel docs     │      │  HMAC-signed access token     │    │
│  └──────────────────┘      └──────────────────────────────┘    │
│                                                                 │
│  middleware.ts ─── SENTRY-03 HMAC-SHA256 on /api/swarm/*       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6 Privacy & Security Gaps

### Gap 1 — Session Key Derivation (`lib/session-key.ts`)
`eth_personal_sign` → HKDF → AES-256-GCM non-extractable CryptoKey. Derived deterministically from wallet signature. Never stored, never transmitted. The key lives only in the browser's WebCrypto heap.

### Gap 2 — PII Stripping Before Inference (`lib/pii-stripper.ts`)
Before any memory reaches Venice or Gemini, a regex + pattern engine strips: ETH addresses, WEI amounts, TX hashes, emails, phone numbers, SSNs, IP addresses. Replaced with typed placeholders. Redaction log returned to caller as proof.

### Gap 3 — Encrypted Memory Storage (`lib/memoryEngine.ts`)
`saveMemoryEncrypted()` / `loadMemoriesDecrypted()` — all memories AES-256-GCM encrypted in localStorage. Key derived from wallet signature via Gap 1. Zero plaintext at rest. An attacker with filesystem access cannot read agent memories without the wallet.

### Gap 4 — Onchain Threat Attestation
**`contracts/ArbitersLedger.sol`** — [`0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94`](https://sepolia.etherscan.io/address/0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94)

Every Uniswap quote scored 0–100 across volatility, liquidity, MEV, slippage, and contract risk vectors. Score + band (`PASS/LOG/HOLD/BLOCK`) logged onchain fire-and-forget via `lib/arbiter-ledger.ts`. The ledger is public and immutable — proof that no swap above 75 was executed.

### Gap 5 — Wallet-Gated Data Room (`app/data-room/page.tsx` + `/api/data-room/auth`)
Server issues a single-use nonce (5 min TTL). Client signs with MetaMask. Server calls `ethers.verifyMessage()` to recover address → issues HMAC-signed access token. No passwords, no OAuth, no sessions. Cryptographic proof of wallet ownership.

### Gap 6 — SENTRY-03 Inter-Agent HMAC (`middleware.ts`)
All `/api/swarm/*` routes require `X-Swarm-Sig: HMAC-SHA256(timestamp:body)` + `X-Swarm-Ts` headers. 30-second replay window. Timing-safe comparison via Web Crypto. Edge Runtime (zero cold start). Responds with `X-Swarm-Sentry: SENTRY-03 ✓` on success.

---

## Swarm Genesis — 3/3 Onchain NFT Collection

The culmination of everything the swarm learned, minted forever on-chain.

**Contract: [`0x075f65b8A23A1eC13B05E87F4b23DD22562D927D`](https://sepolia.etherscan.io/address/0x075f65b8A23A1eC13B05E87F4b23DD22562D927D) (Sepolia)**

| Token | Name | Theme |
|---|---|---|
| 1/3 | **GHOST PROTOCOL** | Privacy architecture · AES-256-GCM · HKDF · PII stripping |
| 2/3 | **ARBITER ZERO** | Threat oracle · live interactive radar · real-time score |
| 3/3 | **THE CRYSTALLIZED** | Eternal memory · hex lattice crystallization · harmonic audio |

Each token is a **fully self-contained interactive HTML5 app** stored as `data:text/html;base64,...` in contract storage — not IPFS, not HTTP, not CDN. The art is the blockchain.

**Performance architecture:**
- 150 particles per token (no `shadowBlur` — replaced with additive blending bloom)
- 30fps cap via timestamp delta
- `document.hidden` pause — pauses when tab not visible
- Web Audio API — oscillators + filters + buffer sources, lazy init on click

Live art loads directly from chain via `eth_call` → ABI decode → iframe src.

---

## Uniswap Integration

**`POST /api/uniswap/quote`** — Live Ethereum mainnet

- Real quotes via `trade-api.gateway.uniswap.org/v2/quote`
- Routing: BEST_PRICE (Classic AMM, UniswapX, Dutch V2/V3, Priority)
- Every quote scored by ArbitersLedger — score > 75 → BLOCK
- Arbiter attestation logged to Sepolia regardless of quote outcome

**`POST /api/uniswap/swap`** — Universal Router v2.0 calldata
**`POST /api/uniswap/approval`** — Permit2 EIP-712 off-chain signing
**UI: [`/swap/`](https://living-swarm-demo.vercel.app/swap/)**

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, inline HTML/CSS/JS art pages |
| **Primary inference** | **Venice AI** (`llama-3.3-70b`) — private, zero retention |
| Secondary inference | Gemini 2.5 Flash Lite (standard crystallize) |
| Blockchain | Ethers.js v6, Sepolia testnet |
| Smart contracts | Custom ERC-721 (no OpenZeppelin), ArbitersLedger |
| DeFi | Uniswap Trade API v2, UniswapX, Permit2, Universal Router |
| Cryptography | AES-256-GCM, HKDF, HMAC-SHA256, `eth_personal_sign` |
| Runtime | Vercel Edge Runtime (middleware), Node.js (API routes) |
| Storage | Ethereum contract storage, AES-encrypted localStorage |

---

## Deployed Contracts (Sepolia)

| Contract | Address | Explorer |
|---|---|---|
| SwarmGenesis ERC-721 | `0x075f65b8A23A1eC13B05E87F4b23DD22562D927D` | [View](https://sepolia.etherscan.io/address/0x075f65b8A23A1eC13B05E87F4b23DD22562D927D) |
| ArbitersLedger | `0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94` | [View](https://sepolia.etherscan.io/address/0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94) |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/venice/crystallize` | **Venice AI** private memory crystallization |
| POST | `/api/crystallize` | Gemini memory crystallization |
| POST | `/api/private-crystallize` | Gemini + PII stripping |
| POST | `/api/uniswap/quote` | Live Uniswap quote + arbiter score |
| POST | `/api/uniswap/swap` | Universal Router calldata |
| POST | `/api/uniswap/approval` | Permit2 EIP-712 approval |
| GET | `/api/data-room/auth` | Issue wallet challenge nonce |
| POST | `/api/data-room/auth` | Verify signature → access token |

---

## Local Setup

```bash
git clone https://github.com/PSFREQUENCY/living-swarm-demo
cd living-swarm-demo
npm install

# Create .env.local — this file is gitignored, NEVER commit it
cat > .env.local << EOF
GEMINI_API_KEY=your_gemini_key
VENICE_API_KEY=your_venice_key
HMAC_SECRET=your_32_byte_hex_secret
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ARBITER_LEDGER_ADDRESS=0x4A6d6f8B23bf3ECD8EebeA73dcB582db6380Fc94
SWARM_GENESIS_ADDRESS=0x075f65b8A23A1eC13B05E87F4b23DD22562D927D
EOF

npm run dev
# → http://localhost:3000
```

---

## Pages

| Page | URL | Description |
|---|---|---|
| Main | `/` | Swarm dashboard · Genesis art · Privacy Stack · live Uniswap |
| Royal Logs | `/royal-logs/` | Memory crystallization · Genesis NFT collection |
| Swarm Trade | `/swap/` | Live Uniswap swap UI with arbiter gating |
| Data Room | `/data-room` | Wallet-gated classified intel |
| Swarm Signals | `/swarm-signals/` | Agent signal feed |

---

## Operator

Built by [@Bitsavador](https://twitter.com/Bitsavador)
Wallet: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484`

---

*Zero trust is not a feature. It is the architecture.*
*Venice is not just an API. It is the only ethical inference layer for agent memory.*
