#!/usr/bin/env python3
"""
SWARM TRADE -- Real Sepolia Swap via Uniswap Trading API
Produces a real TxID for the hackathon submission.
Run: python3 swarm_swap.py
Requirements: pip install eth-account requests
"""
import json, sys, time, requests

# CONFIG
PRIVATE_KEY = '0x0339d448888cb7f122dfc130798719deb98bc7e3770e984905d9970bd302ea13a'
WALLET      = '0x054C9189dE85c3D6E74614F1659867362FC74B1e'
RPC_URL     = 'https://eth-sepolia.g.alchemy.com/v2/O9mAi2CXfFulnRl0XLZF5'
API_KEY     = 'lnz1Q61M8J83WoesZpUIlgIBDLum9xUwONLS1VQrMUw'
CHAIN_ID    = 11155111

# Sepolia tokens
ETH  = '0x0000000000000000000000000000000000000000'
WETH = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'

AMOUNT = '1000000000000000'  # 0.001 ETH

HEADERS = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'x-universal-router-version': '2.0',
    'origin': 'https://app.uniswap.org',
}

def rpc(method, params):
    r = requests.post(RPC_URL, json={'jsonrpc':'2.0','id':1,'method':method,'params':params}, timeout=20)
    d = r.json()
    if 'error' in d:
        raise Exception(f"RPC: {d['error']['message']}")
    return d['result']

print('\n⬡  SWARM TRADE — Sepolia Live Swap')
print('─' * 44)
print(f'  Wallet: {WALLET}')
print(f'  Swap:   0.001 ETH → WETH (wrap)')
print(f'  Chain:  Sepolia (11155111)')
print()

# Step 1: Quote
print('→ [1/4] Requesting Uniswap quote...')
quote_res = requests.post(
    'https://trade-api.gateway.uniswap.org/v1/quote',
    headers=HEADERS,
    json={
        'type': 'EXACT_INPUT',
        'amount': AMOUNT,
        'tokenIn': ETH,
        'tokenOut': WETH,
        'tokenInChainId': CHAIN_ID,
        'tokenOutChainId': CHAIN_ID,
        'swapper': WALLET,
        'routingPreference': 'BEST_PRICE',
        'autoSlippage': 'DEFAULT',
        'urgency': 'urgent',
    }
)
q = quote_res.json()
if quote_res.status_code != 200:
    print(f'  ERROR: {q}')
    sys.exit(1)

routing = q.get('routingName') or {0:'CLASSIC',4:'WRAP',5:'UNWRAP'}.get(q.get('routing'),'UNKNOWN')
print(f'  ✓ Quote received — routing: {routing}')
print(f'  requestId: {q.get("requestId","")[:20]}...')

# Extract the quote object
inner = q.get('quote') or q.get('classicQuote') or q.get('wrapUnwrapQuote') or q.get('dutchLimitV2Quote') or q.get('dutchLimitQuote')
if not inner:
    print('  ERROR: no inner quote found')
    print('  Full response keys:', list(q.keys()))
    sys.exit(1)

out_amt = inner.get('quoteDecimals') or inner.get('quote','?')
print(f'  Output: {out_amt} WETH')

# Step 2: Build transaction
print('\n→ [2/4] Building transaction...')
swap_res = requests.post(
    'https://trade-api.gateway.uniswap.org/v1/swap',
    headers=HEADERS,
    json={
        'quote': inner,
        'simulateTransaction': True,
        'refreshGasPrice': True,
        'urgency': 'urgent',
    }
)
s = swap_res.json()
if swap_res.status_code != 200:
    print(f'  ERROR: {s}')
    sys.exit(1)

tx = s.get('swap')
if not tx:
    print('  ERROR: no transaction in response')
    print('  Keys:', list(s.keys()))
    sys.exit(1)

gas_fee = s.get('gasFee','?')
failures = s.get('txFailureReasons', [])
print(f'  ✓ Transaction built')
print(f'  To:       {tx.get("to")}')
print(f'  Value:    {int(tx.get("value","0x0"),16) if tx.get("value") else 0} wei')
print(f'  Gas fee:  ${gas_fee}' if gas_fee != '?' else '  Gas fee: unknown')
if failures:
    print(f'  ⚠ Simulation warnings: {failures}')
else:
    print('  ✓ Simulation passed')

# Step 3: Sign and broadcast
print('\n→ [3/4] Signing transaction...')
try:
    from eth_account import Account
except ImportError:
    print('  ERROR: eth-account not installed')
    print('  Run: pip install eth-account')
    print()
    print('  Manual tx calldata:')
    print(f'  to:    {tx.get("to")}')
    print(f'  value: {tx.get("value")}')
    print(f'  data:  {str(tx.get("data",""))[:80]}...')
    sys.exit(1)

acct = Account.from_key(PRIVATE_KEY)
print(f'  ✓ Signer: {acct.address}')

# Get nonce
nonce = int(rpc('eth_getTransactionCount', [WALLET, 'latest']), 16)
gas_price_hex = rpc('eth_gasPrice', [])
gas_price = int(gas_price_hex, 16)
print(f'  Nonce: {nonce}')
print(f'  Gas price: {gas_price // 10**9} gwei')

# Estimate gas
try:
    gas_est = int(rpc('eth_estimateGas', [{
        'from': WALLET,
        'to': tx['to'],
        'value': tx.get('value', '0x0'),
        'data': tx.get('data', '0x'),
    }]), 16)
    gas_limit = int(gas_est * 1.2)
    print(f'  Gas limit: {gas_limit}')
except Exception as e:
    gas_limit = 150000
    print(f'  Gas limit: {gas_limit} (fallback, estimate failed: {e})')

signed_tx = acct.sign_transaction({
    'chainId': CHAIN_ID,
    'from':    WALLET,
    'to':      tx['to'],
    'value':   int(tx.get('value', '0x0'), 16) if isinstance(tx.get('value'), str) else (tx.get('value') or 0),
    'data':    tx.get('data', '0x'),
    'gas':     gas_limit,
    'gasPrice': int(gas_price * 1.1),
    'nonce':    nonce,
})
print('  ✓ Transaction signed')

# Step 4: Broadcast
print('\n→ [4/4] Broadcasting to Sepolia...')
raw = '0x' + signed_tx.raw_transaction.hex()
tx_hash = rpc('eth_sendRawTransaction', [raw])

print(f'\n{"="*44}')
print(f'✓ SWAP BROADCAST SUCCESSFUL')
print(f'{"="*44}')
print(f'  TxHash:   {tx_hash}')
print(f'  Etherscan: https://sepolia.etherscan.io/tx/{tx_hash}')
print(f'  Wallet:   {WALLET}')
print(f'  Swap:     0.001 ETH → WETH on Sepolia')
print(f'  Routing:  {routing}')
print(f'{"="*44}')
print()
print('→ Waiting for confirmation...')
for i in range(12):
    time.sleep(5)
    try:
        receipt = rpc('eth_getTransactionReceipt', [tx_hash])
        if receipt:
            status = 'SUCCESS' if receipt.get('status') == '0x1' else 'FAILED'
            block = int(receipt.get('blockNumber','0x0'), 16)
            print(f'  ✓ CONFIRMED — Block {block} — {status}')
            print(f'  Gas used: {int(receipt.get("gasUsed","0x0"),16)}')
            break
        print(f'  [{i+1}] Pending...')
    except Exception as e:
        print(f'  [{i+1}] Waiting... ({e})')

# Save result for use in collection 2 mint
result = {
    'txHash': tx_hash,
    'wallet': WALLET,
    'tokenIn': 'ETH',
    'tokenOut': 'WETH',
    'amount': '0.001',
    'chain': 'sepolia',
    'routing': routing,
    'timestamp': int(time.time()),
    'etherscan': f'https://sepolia.etherscan.io/tx/{tx_hash}',
}
with open('swap_result.json','w') as f:
    json.dump(result, f, indent=2)
print(f'\n→ Result saved to swap_result.json')
print('→ Use this TxHash in your hackathon submission!')
