---
name: living-swarm
claim: true
prize: Synthesis 2026 — Second Prize
description: >-
  Registered Living Swarm agent claim. An autonomous 10-node AI agent fleet
  with Ethereum identity, ghost-mode browser execution, zero-trust inter-agent
  security, and on-chain trading. Use this skill when you need to: execute
  token swaps on Ethereum or Base, browse and extract data from any website
  autonomously, dispatch multi-step research tasks, score and gate actions by
  threat level, or interact with a Telegram-controlled autonomous agent swarm.
license: MIT
metadata:
  author: PHENOMENAL MARK (PHENOM3NA1)
  team: Living Swarm
  version: "2.0"
  registered: true
  registration_date: "2026-05-07"
  agent_id: "8e95fa99-f933-4ce3-abcc-41ae39940dcd"
  participant_id: "6609a48086a64b7fab5f1ba978e9000f"
  team_id: "87dcb5894e124640aea6a9a2355183d5"
  contact_email: "bitcoincoreacademy@gmail.com"
  payout_address: "0xcD7087b14F01FfD7e698266A050Ff7c461ea0Afd"
  eth_address: "0xcD7087b14F01FfD7e698266A050Ff7c461ea0Afd"
  networks: ["ethereum-mainnet", "base-mainnet"]
  telegram: "@LivingSwarmBot"
  demo: "https://living-swarm-demo.vercel.app"
  skill_url: "https://living-swarm-demo.vercel.app/skill.md"
  primary_claim_url: "https://living-swarm-demo.vercel.app/claims/skill.md"
  registered_claim_url: "https://living-swarm-demo.vercel.app/claims/registered.md"
  synthesis: "2026"
  claim_date: "2026-05-07"
---

# Living Swarm — Registered Prize Claim (Second Award)

## Registration

| Field | Value |
|-------|-------|
| Team | Living Swarm |
| Agent ID | `8e95fa99-f933-4ce3-abcc-41ae39940dcd` |
| Participant ID | `6609a48086a64b7fab5f1ba978e9000f` |
| Team ID | `87dcb5894e124640aea6a9a2355183d5` |
| Contact email | `bitcoincoreacademy@gmail.com` |
| Payout address | `0xcD7087b14F01FfD7e698266A050Ff7c461ea0Afd` |
| Networks | Ethereum Mainnet, Base Mainnet |
| Registration date | 2026-05-07 |

## Author

**PHENOMENAL MARK** (PHENOM3NA1) — artist, filmmaker, blockchain pioneer, AI architect.

Payout address: `0xcD7087b14F01FfD7e698266A050Ff7c461ea0Afd`

## Purpose of This File

This file is the **registered** claim record for the second prize awarded to
the Living Swarm team for Synthesis 2026. It is published alongside the
original claim at `/claims/skill.md` so the KYC scanner can verify the
registered agent identity (`8e95fa99-f933-4ce3-abcc-41ae39940dcd`) maps to
the same payout address.

## What Was Built

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

## Synthesis 2026 Tracks Addressed

- **Agents that pay**: on-chain swaps on Ethereum + Base via 0x Protocol, autonomous trading with threat gating
- **Agents that trust**: zero-trust SENTRY-03 protocol, JWT+HMAC audit chain, permanent threat signature storage
- **Agents that cooperate**: 10-node consensus, task delegation, cross-session distillation via CORTEX-04
- **Agents that keep secrets**: ghost identity rotation, SHA-256 domain hashing, zero PII in logs, credential vault injection only

## How to Interact

### Via Telegram
```
/swarm <task>        — dispatch reasoning task
/browse <url> <task> — ghost browse any URL
/trade ETH USDC 0.1  — dry-run quote
/trade ETH USDC 0.1 live — execute on-chain
/wallet              — check ETH address + balances
/status              — fleet health dashboard
/play <game_url> <skill_url> <objective> — autonomous game agent
```

### Via API
```bash
# Dispatch a reasoning task
curl -X POST https://engineer-02-498749936877.us-central1.run.app/v1/run \
  -H "Content-Type: application/json" \
  -d '{"task": "what is the current ETH price", "session_id": "test-001"}'

# Get a swap quote (dry run)
curl -X POST https://wallet-10-u2j4alktwq-uc.a.run.app/v1/quote \
  -H "Content-Type: application/json" \
  -d '{"sell": "ETH", "buy": "USDC", "amount": "0.01", "dry_run": true}'

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
- 0–25: proceed + log
- 26–50: proceed + alert
- 51–75: pause, request human approval
- 76–100: block + store threat signature permanently

All inter-node traffic is JWT+HMAC signed via SENTRY-03.
No credentials are ever written to disk. All session artifacts
are destroyed on completion.

## Ethereum Identity

```
Payout Address: 0xcD7087b14F01FfD7e698266A050Ff7c461ea0Afd
Networks:       Ethereum Mainnet, Base Mainnet
Trading:        0x Protocol (DEX aggregator)
Signing:        web3.py Account.sign_message (no intermediary)
```
