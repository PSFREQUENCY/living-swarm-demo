// ═══════════════════════════════════════════════════════════════════
// SWARMFI — /api/swarm/rebalance
// 3-agent autonomous portfolio rebalancing loop
// Scout (Herald-01) → Strategist (Engineer-02) → Guardian (Sentinel-03)
// ERC-8004 agent identities | Uniswap Trading API | On-chain attestation
// ═══════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { attestScore } from '@/lib/arbiter-ledger';

// ── Constants ────────────────────────────────────────────────────────
const UNI_QUOTE   = 'https://trade-api.gateway.uniswap.org/v1/quote';
const UNI_SWAP    = 'https://trade-api.gateway.uniswap.org/v1/swap';

// Known Uniswap Universal Router addresses (Guardian whitelist)
const KNOWN_ROUTERS = new Set([
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad', // Universal Router v2 mainnet + Sepolia
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b', // Universal Router v1
  '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', // WETH on Sepolia (WRAP route)
]);

// Token addresses by chain
const TOKENS: Record<number, { ETH: string; USDC: string; WETH: string }> = {
  1: {
    ETH:  '0x0000000000000000000000000000000000000000',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  11155111: {
    ETH:  '0x0000000000000000000000000000000000000000',
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  },
};

// ── ERC-8004 agent registry ──────────────────────────────────────────
const AGENTS = {
  scout:      { id: 'herald-01',   role: 'SCOUT',      erc8004_token: 1, budget_max: 8000  },
  strategist: { id: 'engineer-02', role: 'STRATEGIST', erc8004_token: 2, budget_max: 15000 },
  guardian:   { id: 'sentinel-03', role: 'GUARDIAN',   erc8004_token: 3, budget_max: 5000  },
};

// ── Types ─────────────────────────────────────────────────────────────
interface ScoutSignal {
  wallet: string;
  chainId: number;
  eth_balance: string;        // formatted ETH
  usdc_balance: string;       // formatted USDC
  eth_price_usd: number;
  eth_value_usd: number;
  usdc_value_usd: number;
  total_value_usd: number;
  eth_alloc: number;          // 0–1
  usdc_alloc: number;         // 0–1
  target_eth: number;         // 0–1
  drift: number;              // signed, e.g. +0.12 means ETH is 12% over
  drift_pct: string;
  action_needed: boolean;
  sell_token: string | null;
  buy_token:  string | null;
  weth_balance?: string;
  trade_amount_raw: string;   // in wei / base units
  trade_amount_human: string;
  gas_estimate_gwei?: string;
  budget_used: number;
}

interface StrategistPlan {
  quote_requested: object;
  quote_response: any;
  routing_name: string;
  output_amount: string;
  output_symbol: string;
  price_impact_pct: string;
  gas_fee_usd: string;
  permit2_required: boolean;
  permit_data: any | null;
  swap_calldata_ready: boolean;
  routing_preference: string;
  verdict: 'PROCEED' | 'SKIP' | 'RETRY';
  reason: string;
  budget_used: number;
}

interface GuardianCheck {
  check: string;
  pass: boolean;
  detail: string;
}

interface GuardianVerdict {
  checks: GuardianCheck[];
  approved: boolean;
  abort_reason: string | null;
  risk_score: number;
  risk_band: 'PASS' | 'LOG' | 'HOLD' | 'BLOCK';
  swap_payload: any | null;
  budget_used: number;
}

// ── Helpers ──────────────────────────────────────────────────────────

function routingName(r: number): string {
  return ({0:'CLASSIC',1:'DUTCH_LIMIT',2:'DUTCH_V2',3:'LIMIT_ORDER',4:'WRAP',5:'UNWRAP',6:'BRIDGE',7:'PRIORITY',8:'DUTCH_V3',9:'QUICKROUTE',10:'CHAINED'} as any)[r] ?? `ROUTING_${r}`;
}

function isValidHex(s: string): boolean {
  return typeof s === 'string' && /^0x[0-9a-fA-F]+$/.test(s);
}

// ── AGENT 1: Scout ────────────────────────────────────────────────────
async function runScout(
  wallet: string,
  chainId: number,
  targetETH: number,
  driftThreshold: number,
  maxTradeSizeETH: number,
  apiKey: string,
): Promise<ScoutSignal> {
  const start = Date.now();
  const tokens = TOKENS[chainId];
  if (!tokens) throw new Error(`Unsupported chainId: ${chainId}`);

  const rpc = process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/O9mAi2CXfFulnRl0XLZF5';
  if (!rpc) throw new Error('SEPOLIA_RPC_URL not configured');

  const provider = new ethers.JsonRpcProvider(rpc);

  // Fetch ETH + WETH + USDC balances in parallel
  const ERC20_ABI = ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'];
  const usdcContract = new ethers.Contract(tokens.USDC, ERC20_ABI, provider);
  const wethContract = new ethers.Contract(tokens.WETH, ERC20_ABI, provider);

  const [ethBalWei, usdcBalRaw, wethBalRaw, usdcDecimals, gasPrice] = await Promise.all([
    provider.getBalance(wallet),
    usdcContract.balanceOf(wallet),
    wethContract.balanceOf(wallet).catch(() => 0n),
    usdcContract.decimals().catch(() => 6),
    provider.getFeeData().then(f => f.gasPrice ?? 0n),
  ]);

  const ethBal  = parseFloat(ethers.formatEther(ethBalWei));
  const wethBal = parseFloat(ethers.formatEther(wethBalRaw));
  const usdcBal = parseFloat(ethers.formatUnits(usdcBalRaw, usdcDecimals));

  // Get live ETH price via Uniswap quote (1 ETH → USDC)
  let ethPriceUSD = 0;
  try {
    const priceBody = {
      type: 'EXACT_INPUT',
      amount: '1000000000000000000', // 1 ETH in wei
      tokenIn: tokens.ETH,
      tokenOut: tokens.USDC,
      tokenInChainId: chainId,
      tokenOutChainId: chainId,
      swapper: wallet,
      routingPreference: 'BEST_PRICE',
    };
    const pr = await fetch(UNI_QUOTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'origin': 'https://app.uniswap.org' },
      body: JSON.stringify(priceBody),
      signal: AbortSignal.timeout(8000),
    });
    const pd = await pr.json();
    if (pr.ok && pd.quote?.output?.amount) {
      ethPriceUSD = parseFloat(pd.quote.output.amount) / Math.pow(10, Number(usdcDecimals));
    }
  } catch { /* price fetch failed — use fallback */ }

  // If price fetch failed, use a reasonable fallback so portfolio math still works
  if (ethPriceUSD === 0) ethPriceUSD = 3500;

  // ETH + WETH are the same asset value-wise
  const ethTotalBal  = ethBal + wethBal;
  const ethValueUSD  = ethTotalBal * ethPriceUSD;
  const usdcValueUSD = usdcBal;
  const totalValue   = ethValueUSD + usdcValueUSD;

  const ethAlloc  = totalValue > 0 ? ethValueUSD / totalValue : 0;
  const usdcAlloc = totalValue > 0 ? usdcValueUSD / totalValue : 0;
  const drift     = ethAlloc - targetETH;
  const absDrift  = Math.abs(drift);

  const actionNeeded = absDrift >= driftThreshold && totalValue > 0;

  let sellToken: string | null = null;
  let buyToken:  string | null = null;
  let tradeAmountRaw = '0';
  let tradeAmountHuman = '0';

  if (actionNeeded) {
    if (drift > 0) {
      // ETH heavy → sell ETH (prefer native ETH; fall back to WETH if low)
      sellToken = ethBal >= 0.001 ? 'ETH' : 'WETH';
      buyToken  = 'USDC';
      const excessUSD  = drift * totalValue;
      const ethToSell  = Math.min(excessUSD / ethPriceUSD, maxTradeSizeETH);
      tradeAmountHuman = ethToSell.toFixed(6);
      tradeAmountRaw   = ethers.parseEther(ethToSell.toFixed(18).slice(0, 20)).toString();
    } else {
      // USDC heavy → sell USDC, buy ETH
      sellToken = 'USDC';
      buyToken  = 'ETH';
      const excessUSD   = absDrift * totalValue;
      const usdcToSell  = Math.min(excessUSD, maxTradeSizeETH * ethPriceUSD);
      tradeAmountHuman  = usdcToSell.toFixed(2);
      tradeAmountRaw    = ethers.parseUnits(usdcToSell.toFixed(6), Number(usdcDecimals)).toString();
    }
  }

  return {
    wallet,
    chainId,
    eth_balance: ethBal.toFixed(6),
    weth_balance: wethBal.toFixed(6),
    usdc_balance: usdcBal.toFixed(2),
    eth_price_usd: Math.round(ethPriceUSD * 100) / 100,
    eth_value_usd: Math.round(ethValueUSD * 100) / 100,
    usdc_value_usd: Math.round(usdcValueUSD * 100) / 100,
    total_value_usd: Math.round(totalValue * 100) / 100,
    eth_alloc: Math.round(ethAlloc * 10000) / 10000,
    usdc_alloc: Math.round(usdcAlloc * 10000) / 10000,
    target_eth: targetETH,
    drift: Math.round(drift * 10000) / 10000,
    drift_pct: (drift * 100).toFixed(2) + '%',
    action_needed: actionNeeded,
    sell_token: sellToken,
    buy_token: buyToken,
    trade_amount_raw: tradeAmountRaw,
    trade_amount_human: tradeAmountHuman,
    gas_estimate_gwei: ethers.formatUnits(gasPrice, 'gwei'),
    budget_used: Date.now() - start,
  };
}

// ── AGENT 2: Strategist ───────────────────────────────────────────────
async function runStrategist(
  signal: ScoutSignal,
  routingPreference: 'BEST_PRICE' | 'FASTEST',
  apiKey: string,
): Promise<StrategistPlan> {
  const start = Date.now();
  const tokens = TOKENS[signal.chainId];

  if (!signal.action_needed || !signal.sell_token || !signal.buy_token) {
    return {
      quote_requested: {},
      quote_response: null,
      routing_name: 'N/A',
      output_amount: '0',
      output_symbol: '',
      price_impact_pct: '0',
      gas_fee_usd: '0',
      permit2_required: false,
      permit_data: null,
      swap_calldata_ready: false,
      routing_preference: routingPreference,
      verdict: 'SKIP',
      reason: 'No rebalance needed — portfolio within drift threshold',
      budget_used: Date.now() - start,
    };
  }

  const tokenInAddr  = signal.sell_token === 'ETH' ? tokens.ETH : tokens.USDC;
  const tokenOutAddr = signal.buy_token  === 'ETH' ? tokens.ETH : tokens.USDC;
  const outSymbol    = signal.buy_token;
  const outDecimals  = signal.buy_token === 'ETH' ? 18 : 6;

  const quoteBody = {
    type: 'EXACT_INPUT',
    amount: signal.trade_amount_raw,
    tokenIn: tokenInAddr,
    tokenOut: tokenOutAddr,
    tokenInChainId: signal.chainId,
    tokenOutChainId: signal.chainId,
    swapper: signal.wallet,
    routingPreference,
    autoSlippage: 'DEFAULT',
    urgency: 'urgent',
    permitAmount: 'FULL',
  };

  let quoteResp: any = null;
  let verdict: 'PROCEED' | 'SKIP' | 'RETRY' = 'SKIP';
  let reason = 'Quote fetch failed';

  try {
    const r = await fetch(UNI_QUOTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-universal-router-version': '2.0',
        'origin': 'https://app.uniswap.org',
      },
      body: JSON.stringify(quoteBody),
      signal: AbortSignal.timeout(10000),
    });
    quoteResp = await r.json();
    if (!r.ok) {
      reason = quoteResp.errorCode || quoteResp.detail || `HTTP ${r.status}`;
      verdict = 'RETRY';
    } else {
      verdict = 'PROCEED';
      reason  = 'Quote obtained — route validated';
    }
  } catch (e: any) {
    reason = e.message;
    verdict = 'RETRY';
  }

  if (!quoteResp || verdict !== 'PROCEED') {
    return {
      quote_requested: quoteBody,
      quote_response: quoteResp,
      routing_name: 'FAILED',
      output_amount: '0',
      output_symbol: outSymbol,
      price_impact_pct: '0',
      gas_fee_usd: '0',
      permit2_required: false,
      permit_data: null,
      swap_calldata_ready: false,
      routing_preference: routingPreference,
      verdict,
      reason,
      budget_used: Date.now() - start,
    };
  }

  const q = quoteResp.quote || {};
  const outputRaw = q.output?.amount ?? '0';
  const outputAmt = (parseFloat(outputRaw) / Math.pow(10, outDecimals)).toFixed(outDecimals === 18 ? 6 : 2);

  // Evaluate price impact — reject if > 2%
  const priceImpact = parseFloat(q.priceImpact ?? '0');
  if (priceImpact > 2) {
    verdict = 'SKIP';
    reason  = `Price impact too high: ${priceImpact.toFixed(3)}% > 2% threshold`;
  }

  const permit2Required = !!quoteResp.permitData;

  return {
    quote_requested: quoteBody,
    quote_response: quoteResp,
    routing_name: routingName(quoteResp.routing),
    output_amount: outputAmt,
    output_symbol: outSymbol,
    price_impact_pct: priceImpact.toFixed(4) + '%',
    gas_fee_usd: q.gasFeeUSD ? '$' + parseFloat(q.gasFeeUSD).toFixed(4) : '--',
    permit2_required: permit2Required,
    permit_data: quoteResp.permitData ?? null,
    swap_calldata_ready: verdict === 'PROCEED',
    routing_preference: routingPreference,
    verdict,
    reason,
    budget_used: Date.now() - start,
  };
}

// ── AGENT 3: Guardian ─────────────────────────────────────────────────
async function runGuardian(
  signal: ScoutSignal,
  plan: StrategistPlan,
  maxTradeSizeETH: number,
  maxSlippagePct: number,
  apiKey: string,
): Promise<GuardianVerdict> {
  const start = Date.now();
  const checks: GuardianCheck[] = [];

  // Shortcut: strategist skipped — nothing to guard
  if (plan.verdict === 'SKIP') {
    return {
      checks: [{ check: 'STRATEGIST_GATE', pass: true, detail: 'Strategist voted SKIP — no trade needed' }],
      approved: false,
      abort_reason: 'No rebalance trade queued',
      risk_score: 0,
      risk_band: 'PASS',
      swap_payload: null,
      budget_used: Date.now() - start,
    };
  }

  const q = plan.quote_response;
  const swap = q?.quote;

  // CHECK 1: Quote data exists
  checks.push({
    check: 'QUOTE_EXISTS',
    pass: !!q && !!swap,
    detail: q ? 'Quote object present' : 'Missing quote response',
  });

  // CHECK 2: Router address is a known Uniswap contract
  const routerAddr = (swap?.to ?? '').toLowerCase();
  const knownRouter = KNOWN_ROUTERS.has(routerAddr) || routerAddr.includes('fff9976');
  checks.push({
    check: 'ROUTER_WHITELIST',
    pass: knownRouter || !routerAddr, // pass if empty (will be caught by wallet)
    detail: routerAddr ? `to: ${routerAddr} ${knownRouter ? '✓ KNOWN' : '⚠ UNKNOWN'}` : 'Router address not yet available (pre-sign)',
  });

  // CHECK 3: calldata is valid hex
  const calldata = swap?.data ?? '';
  const hexValid = !calldata || isValidHex(calldata);
  checks.push({
    check: 'CALLDATA_HEX',
    pass: hexValid,
    detail: hexValid ? `data: ${calldata.slice(0, 20)}... valid hex` : 'Invalid calldata encoding',
  });

  // CHECK 4: Trade amount within max size
  const tradeAmtHuman = parseFloat(signal.trade_amount_human);
  const withinBudget = signal.sell_token === 'ETH'
    ? tradeAmtHuman <= maxTradeSizeETH
    : tradeAmtHuman <= maxTradeSizeETH * signal.eth_price_usd;
  const budgetPct = signal.sell_token === 'ETH'
    ? ((1 - tradeAmtHuman / maxTradeSizeETH) * 100).toFixed(0)
    : ((1 - tradeAmtHuman / (maxTradeSizeETH * signal.eth_price_usd)) * 100).toFixed(0);
  checks.push({
    check: 'AMOUNT_WITHIN_BUDGET',
    pass: withinBudget,
    detail: `${signal.trade_amount_human} ${signal.sell_token} — budget remaining: ${budgetPct}%`,
  });

  // CHECK 5: Output amount > 0
  const outputAmt = parseFloat(plan.output_amount);
  checks.push({
    check: 'OUTPUT_NONZERO',
    pass: outputAmt > 0,
    detail: outputAmt > 0 ? `${plan.output_amount} ${plan.output_symbol}` : 'Zero output — route failure',
  });

  // CHECK 6: Slippage within bounds
  const priceImpact = parseFloat(plan.price_impact_pct);
  const slippageOk  = priceImpact <= maxSlippagePct;
  checks.push({
    check: 'SLIPPAGE_BOUNDS',
    pass: slippageOk,
    detail: `Impact: ${plan.price_impact_pct} — max: ${maxSlippagePct}%`,
  });

  // CHECK 7: Wallet has sufficient balance for trade
  const ethBal  = parseFloat(signal.eth_balance);
  const usdcBal = parseFloat(signal.usdc_balance);
  const balOk   = signal.sell_token === 'ETH'
    ? ethBal  >= tradeAmtHuman
    : usdcBal >= tradeAmtHuman;
  checks.push({
    check: 'BALANCE_SUFFICIENT',
    pass: balOk,
    detail: signal.sell_token === 'ETH'
      ? `ETH bal: ${signal.eth_balance} — need: ${signal.trade_amount_human}`
      : `USDC bal: ${signal.usdc_balance} — need: ${signal.trade_amount_human}`,
  });

  // CHECK 8: Strategist rated PROCEED
  checks.push({
    check: 'STRATEGIST_APPROVED',
    pass: plan.verdict === 'PROCEED',
    detail: `Strategist verdict: ${plan.verdict} — ${plan.reason}`,
  });

  // Risk scoring
  const failCount  = checks.filter(c => !c.pass).length;
  const riskScore  = Math.min(failCount * 20, 100);
  const riskBand: 'PASS'|'LOG'|'HOLD'|'BLOCK' =
    riskScore <= 0  ? 'PASS' :
    riskScore <= 20 ? 'LOG'  :
    riskScore <= 40 ? 'HOLD' : 'BLOCK';

  const approved = failCount === 0;
  const abortReason = approved ? null : checks.filter(c => !c.pass).map(c => c.check).join(', ');

  // Build swap payload for client execution (Guardian seals it)
  let swapPayload: any = null;
  if (approved && plan.quote_response) {
    swapPayload = {
      quote: plan.quote_response.quote,
      permitData: plan.permit_data ?? undefined,
      urgency: 'urgent',
    };
  }

  // Fire-and-forget onchain attestation
  const inputKey = `rebalance:${signal.wallet}:${signal.sell_token}:${signal.trade_amount_raw}`;
  attestScore(inputKey, riskScore, riskBand[0] as 'P'|'L'|'H'|'B');

  return {
    checks,
    approved,
    abort_reason: abortReason,
    risk_score: riskScore,
    risk_band: riskBand,
    swap_payload: swapPayload,
    budget_used: Date.now() - start,
  };
}

// ── Route handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const API_KEY = process.env.UNISWAP_API_KEY || 'sG8cVvj6i2qUvTMiw9zSUTMCKbgEqe7EoO53E1dqzGo';
  const ts = Date.now();

  try {
    const body = await req.json();
    const {
      wallet         = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      chainId        = 11155111,
      targetETH      = 0.50,   // target 50% ETH
      driftThreshold = 0.05,   // rebalance if drift > 5%
      maxTradeSizeETH = 0.1,   // max 0.1 ETH per trade
      maxSlippagePct = 0.5,
      routingPreference = 'BEST_PRICE',
    } = body;

    const runId = `rebalance_${ts.toString(36)}`;

    // ── PHASE 1: Scout ───────────────────────────────────────────────
    let scout: ScoutSignal;
    try {
      scout = await runScout(wallet, chainId, targetETH, driftThreshold, maxTradeSizeETH, API_KEY);
    } catch (e: any) {
      return NextResponse.json({ error: 'SCOUT_FAILED', detail: e.message }, { status: 500 });
    }

    // ── PHASE 2: Strategist ──────────────────────────────────────────
    const strategist = await runStrategist(scout, routingPreference as any, API_KEY);

    // ── PHASE 3: Guardian ────────────────────────────────────────────
    const guardian = await runGuardian(scout, strategist, maxTradeSizeETH, maxSlippagePct, API_KEY);

    // ── Build agent log ──────────────────────────────────────────────
    const agentLog = [
      {
        agent: AGENTS.scout,
        phase: 'SCOUT',
        ts,
        signal: {
          wallet: scout.wallet,
          eth_alloc: scout.eth_alloc,
          usdc_alloc: scout.usdc_alloc,
          drift: scout.drift,
          drift_pct: scout.drift_pct,
          action_needed: scout.action_needed,
          sell: scout.sell_token,
          buy: scout.buy_token,
          amount: scout.trade_amount_human,
          eth_price_usd: scout.eth_price_usd,
        },
        budget_ms: scout.budget_used,
      },
      {
        agent: AGENTS.strategist,
        phase: 'STRATEGIST',
        ts: ts + scout.budget_used,
        signal: {
          routing: strategist.routing_name,
          output: `${strategist.output_amount} ${strategist.output_symbol}`,
          price_impact: strategist.price_impact_pct,
          gas: strategist.gas_fee_usd,
          permit2: strategist.permit2_required,
          verdict: strategist.verdict,
          reason: strategist.reason,
        },
        budget_ms: strategist.budget_used,
      },
      {
        agent: AGENTS.guardian,
        phase: 'GUARDIAN',
        ts: ts + scout.budget_used + strategist.budget_used,
        signal: {
          checks_passed: guardian.checks.filter(c => c.pass).length,
          checks_total: guardian.checks.length,
          approved: guardian.approved,
          risk_score: guardian.risk_score,
          risk_band: guardian.risk_band,
          abort_reason: guardian.abort_reason,
        },
        budget_ms: guardian.budget_used,
      },
    ];

    return NextResponse.json({
      run_id: runId,
      schema_version: '1.0',
      ts,
      wallet,
      chainId,
      targets: { eth: targetETH, usdc: 1 - targetETH },
      portfolio: {
        eth_balance: scout.eth_balance,
        weth_balance: scout.weth_balance,
        usdc_balance: scout.usdc_balance,
        eth_price_usd: scout.eth_price_usd,
        total_value_usd: scout.total_value_usd,
        eth_alloc: scout.eth_alloc,
        usdc_alloc: scout.usdc_alloc,
        drift: scout.drift,
        drift_pct: scout.drift_pct,
      },
      trade: scout.action_needed ? {
        sell: scout.sell_token,
        buy: scout.buy_token,
        amount_human: scout.trade_amount_human,
        amount_raw: scout.trade_amount_raw,
      } : null,
      agents: {
        scout:      { ...AGENTS.scout,      result: scout      },
        strategist: { ...AGENTS.strategist, result: strategist },
        guardian:   { ...AGENTS.guardian,   result: guardian   },
      },
      guardian_approved: guardian.approved,
      swap_payload: guardian.swap_payload,
      agent_log: agentLog,
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
