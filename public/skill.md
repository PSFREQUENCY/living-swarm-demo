---
name: living-swarm
description: >-
  An autonomous 10-node AI agent fleet with Ethereum identity, ghost-mode
  browser execution, zero-trust inter-agent security, and on-chain trading.
  Use this skill when you need to: execute token swaps on Ethereum or Base,
  browse and extract data from any website autonomously, dispatch multi-step
  research tasks, score and gate actions by threat level, or interact with
  a Telegram-controlled autonomous agent swarm.
license: MIT
metadata:
  author: living-swarm
  version: "2.0"
  eth_address: "0xdd30d20683EB3a84d1f9c69E513D653b581F6484"
  networks: ["ethereum-mainnet", "base-mainnet"]
  telegram: "@LivingSwarmBot"
  demo: "https://living-swarm-demo.vercel.app"
  synthesis: "2026"
---

# Living Swarm — Agent Skill

## What This Swarm Can Do

The Living Swarm is a 10-node autonomous agent fleet deployable via Telegram
or direct API. It operates with an Ethereum identity, zero-trust inter-node
security, and ghost-mode browser execution.

## Nodes & Capabilities

| Node | Endpoint | Capability |
|------|----------|------------|
| HERALD-01 | Telegram bot | Command gateway, approval flows |
| ENGINEER-02 | `/v1/run` | Web search, multi-step reasoning (Claude) |
| CORTEX-04 | `/v1/memory` | RAG memory, cross-session learning |
| ARBITER-05 | `/v1/assess` | Threat scoring 0–100, action gating |
| SENTINEL-06 | `/v1/status` | Fleet health, token budgets, distillation |
| EXECUTOR-08 | `/v1/browse`, `/v1/play` | Playwright ghost browser + Gemini Vision |
| WALLET-10 | `/v1/quote`, `/v1/trade` | 0x swaps on Ethereum + Base |
| SENTRY-03 | JWT+HMAC wall | Zero-trust inter-node authentication |

## How to Interact

### Via Telegram
Send commands to the swarm bot:
```
/swarm <task>       — dispatch reasoning task
/browse <url> <task> — ghost browse any URL
/trade ETH USDC 0.1 — dry-run quote
/trade ETH USDC 0.1 live — execute on-chain
/wallet             — check ETH address + balances
/status             — fleet health dashboard
/play <game_url> <skill_url> <objective> — autonomous game agent
```

### Via API (HERALD-01)
```bash
# Ask Engineer-02 a question with web search
curl -X POST https://engineer-02-498749936877.us-central1.run.app/v1/run \
  -H "Content-Type: application/json" \
  -d '{"task": "what is the current ETH price", "session_id": "test-001"}'

# Get a swap quote (Ethereum)
curl -X POST https://wallet-10-u2j4alktwq-uc.a.run.app/v1/quote \
  -H "Content-Type: application/json" \
  -d '{"sell": "ETH", "buy": "USDC", "amount": "0.01", "dry_run": true}'

# Execute a swap on Base
curl -X POST https://wallet-10-u2j4alktwq-uc.a.run.app/v1/quote \
  -H "Content-Type: application/json" \
  -d '{"sell": "ETH", "buy": "USDC", "amount": "0.01", "dry_run": false, "network": "base"}'

# Ghost browse any URL
curl -X POST https://executor-08-u2j4alktwq-uc.a.run.app/v1/browse \
  -H "Content-Type: application/json" \
  -d '{"url": "https://coingecko.com", "task": "get top 5 coins by market cap"}'

# Score a proposed action
curl -X POST https://arbiter-05-u2j4alktwq-uc.a.run.app/v1/assess \
  -H "Content-Type: application/json" \
  -d '{"action": "transfer 1 ETH to unknown address", "context": "user request"}'
```

## Security Model

Every action is scored 0–100 by ARBITER-05 before execution:
- 🟢 0–25: proceed + log
- 🟡 26–50: proceed + alert
- 🟠 51–75: pause, request human approval
- 🔴 76–100: block + store threat signature permanently

All inter-node traffic is JWT+HMAC signed via SENTRY-03.
No credentials are ever written to disk. All session artifacts
are destroyed on completion.

## Ethereum Identity

```
Address: 0xdd30d20683EB3a84d1f9c69E513D653b581F6484
Networks: Ethereum Mainnet, Base Mainnet
Trading: 0x Protocol (DEX aggregator)
Signing: web3.py Account.sign_message (no intermediary)
```

## Synthesis 2026 Tracks

This swarm addresses all four Synthesis themes:
- **Agents that pay**: on-chain swaps, autonomous trading with threat gating
- **Agents that trust**: zero-trust SENTRY protocol, HMAC audit chain
- **Agents that cooperate**: 10-node consensus, task delegation, distillation
- **Agents that keep secrets**: ghost identity rotation, SHA-256 domain hashing,
  zero PII in logs, credential vault injection only
