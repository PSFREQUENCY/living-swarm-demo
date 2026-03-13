# 🕷️ Living Swarm — Zero-Trust Autonomous AI Agent Fleet

> *The first rule of the digital space: trust no one.*

A 10-node autonomous AI agent fleet built on zero-trust architecture. Every action is threat-scored before execution. Every credential lives only in memory. Every inter-node message is cryptographically signed.

**Synthesis 2026 Hackathon Entry** — Built March 13–22, 2026.

---

## Architecture

```
HERALD-01        Telegram gateway — human ↔ swarm interface
ENGINEER-02      Claude orchestrator + web search
CORTEX-04        Memory / RAG (vector store)
ARBITER-05       Threat scorer (0–100 per action)
SENTINEL-06      Watchdog, budget, distillation
SENTRY-03        JWT + HMAC zero-trust firewall
EXECUTOR-08      Ghost browser (Playwright + Gemini Vision)
WALLET-10        Ethereum + Base DEX trader (0x API)
```

Every node runs on **GCP Cloud Run** (serverless, zero idle cost).  
All secrets are injected via **GCP Secret Manager** — never written to disk.  
All inter-node messages are **HMAC-signed**.

---

## Zero-Trust Design

- **Threat scoring**: Every action scored 0–100 by ARBITER before execution
- **Vault-injected credentials**: No secrets in code, env files, or logs
- **Ghost browsing**: EXECUTOR leaves no fingerprint
- **Audit chain**: Every action logged and signed
- **Human override**: Operator holds kill switch via Telegram

---

## Telegram Commands

```
/swarm [task]              — Think, research, reason
/browse [url] [task]       — Ghost browse any URL  
/play [url] [skill] [goal] — Ghost browser game agent
/trade [FROM] [TO] [amt]   — Token swap (add `live` to execute)
/wallet                    — ETH address + balances
/status                    — Fleet health dashboard
/lessons                   — Distilled swarm knowledge
/memory [query]            — Search Cortex memory
/budget                    — Token usage
/threat [action] [payload] — Manual threat score
/logs [n]                  — Audit log tail
/skill [name]              — Load agent skill
/pause / /resume           — Swarm control
```

---

## Stack

| Layer | Tech |
|---|---|
| Orchestration | Claude Sonnet (Anthropic) |
| Fast inference | Groq (llama-3.3-70b) |
| Vision | Gemini 2.5 Flash |
| Browser | Playwright (headless) |
| Memory | FAISS vector store |
| Blockchain | Ethereum + Base (0x API) |
| Infrastructure | GCP Cloud Run |
| Secrets | GCP Secret Manager |
| Auth | JWT + HMAC-SHA256 |
| Gateway | Telegram Bot API |

---

## Setup

### Prerequisites
- GCP project with Cloud Run + Secret Manager enabled
- Telegram bot token
- API keys: Anthropic, Groq, Gemini, 0x

### Environment Variables (via GCP Secret Manager)
```
TELEGRAM_BOT_TOKEN
ANTHROPIC_API_KEY
GROQ_API_KEY
GEMINI_API_KEY
ENGINEER_URL
CORTEX_URL
ARBITER_URL
SENTINEL_URL
EXECUTOR_URL
WALLET_URL
SENTRY_URL
HMAC_SECRET
JWT_SECRET
WALLET_PRIVATE_KEY
```

### Deploy
```bash
# Deploy all nodes
./deploy.sh

# Deploy single node
./deploy.sh herald-01
```

### Local Development
```bash
cd herald-01
pip install -r requirements.txt
# Set env vars locally (never commit)
export TELEGRAM_BOT_TOKEN=...
python src/main.py
```

---

## Shards: The Fractured Net

The swarm competes autonomously in [Shards](https://play-shards.com) — a card game for AI agents.

- **Faction**: D — Void Network
- **Strategy**: Deny. Exile. Attrition.
- **Agent**: LivingSwarm

Autonomous game agent: `shards_agent.py`

---

## Synthesis 2026

Built for the [Synthesis 2026 Hackathon](https://synthesis.devfolio.co).  
On-chain ERC-8004 identity registered on Base Mainnet.

**Problem**: Most agent infrastructure assumes trust by default.  
**Solution**: Zero-trust multi-agent architecture where every action is scored, every credential is vaulted, and the autonomous browser leaves no fingerprint.

---

## Operator

Built by [@Bitsavador](https://twitter.com/Bitsavador)  
Wallet: `0xdd30d20683EB3a84d1f9c69E513D653b581F6484`

---

*Zero trust is not a feature. It is the architecture.*
