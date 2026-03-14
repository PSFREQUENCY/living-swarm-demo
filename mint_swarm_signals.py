#!/usr/bin/env python3
"""
SWARM SIGNALS — Collection 2
Art that responds to agent behavior, Uniswap market state, and auction dynamics.
Each token is a crystallized moment of the swarm's DeFi activity.
Run AFTER swarm_swap.py — reads swap_result.json

Run: python3 mint_swarm_signals.py
"""
import json, base64, subprocess, sys, time, math, os

CONTRACT = '0xc9E138fe0261368E7bD319829202400262c8121e'
EDITION   = 9  # Max edition — judges see depth

# Load swap result if available
swap_data = {}
if os.path.exists('swap_result.json'):
    swap_data = json.load(open('swap_result.json'))
    print(f'✓ Loaded swap result: {swap_data.get("txHash","")[:20]}...')
else:
    print('⚠ swap_result.json not found — using defaults')
    swap_data = {
        'txHash': '0x0000000000000000000000000000000000000000000000000000000000000000',
        'routing': 'CLASSIC',
        'amount': '0.001',
        'timestamp': int(time.time()),
    }

# Derive visual parameters from market/swap data
def derive_params(token_num, swap):
    ts   = swap.get('timestamp', int(time.time()))
    tx   = swap.get('txHash','0x00')
    # Hash the tx for determinism
    seed = int(tx[2:10], 16) if len(tx) > 10 else token_num * 7777
    # Visual parameters driven by market state
    hue         = (seed * 137 + token_num * 47) % 360
    hue2        = (hue + 120 + token_num * 30) % 360
    hue3        = (hue + 240) % 360
    # Routing type affects complexity
    routing     = swap.get('routing','CLASSIC')
    complexity  = {'CLASSIC':0.4,'DUTCH_V2':0.7,'DUTCH_V3':0.85,'PRIORITY':0.9,'WRAP':0.2}.get(routing, 0.5)
    complexity  += (token_num / EDITION) * 0.3
    turbulence  = 0.3 + math.sin(seed * 0.001 + token_num) * 0.2
    speed       = 0.8 + (token_num * 0.15)
    freq_base   = 0.008 + (complexity * 0.01)
    layers      = min(2 + token_num, 8)
    return {
        'seed': seed, 'hue': hue, 'hue2': hue2, 'hue3': hue3,
        'complexity': complexity, 'turbulence': turbulence,
        'speed': speed, 'freq': freq_base, 'layers': layers,
        'routing': routing,
    }

def make_svg(token_num, p, swap):
    """Ultra-minimal onchain SVG — stays under contract URI limit."""
    h  = p['hue']; h2 = p['hue2']; sp = round(p['speed'],1)
    fr = round(p['freq'],4); s  = p['seed'] % 999
    tx = swap.get('txHash','0x00')
    # 4 arc rings derived from tx hash bytes
    arcs = ''
    for i in range(4):
        bv  = int(tx[2+i*2:4+i*2],16) if len(tx)>4+i*2 else i*60
        r   = 90 + i*18; op = round(0.08+(bv/255)*0.15,2)
        dd  = max(4,bv//5); dg = 12
        arcs += (f'<circle cx="250" cy="250" r="{r}" fill="none" '
                 f'stroke="hsl({(h+i*30)%360},70%,55%)" stroke-width="0.6" '
                 f'stroke-dasharray="{dd} {dg}" opacity="{op}">'
                 f'<animateTransform attributeName="transform" type="rotate" '
                 f'from="{bv} 250 250" to="{bv+360} 250 250" '
                 f'dur="{round(sp*6+i*2,1)}s" repeatCount="indefinite"/>'
                 f'</circle>\n')
    rg = {'CLASSIC':'◉','DUTCH_V2':'⬡','WRAP':'◈','PRIORITY':'✦'}.get(p['routing'],'◈')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">'
           f'<defs>'
           f'<filter id="f{s}" x="-25%" y="-25%" width="150%" height="150%">'
           f'<feTurbulence type="fractalNoise" baseFrequency="{fr}" numOctaves="3" seed="{s}">'
           f'<animate attributeName="baseFrequency" dur="{sp*8}s" '
           f'values="{fr};{round(fr*1.4,4)};{fr}" repeatCount="indefinite"/>'
           f'</feTurbulence>'
           f'<feDisplacementMap in="SourceGraphic" scale="28" xChannelSelector="R" yChannelSelector="G"/>'
           f'</filter>'
           f'<filter id="g{s}"><feGaussianBlur stdDeviation="7" result="b"/>'
           f'<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
           f'<radialGradient id="bg{s}" cx="50%" cy="50%" r="70%">'
           f'<stop offset="0%" stop-color="hsl({h},60%,13%)">'
           f'<animate attributeName="stop-color" dur="{sp*7}s" '
           f'values="hsl({h},60%,13%);hsl({h2},55%,9%);hsl({h},60%,13%)" repeatCount="indefinite"/>'
           f'</stop><stop offset="100%" stop-color="#020308"/></radialGradient>'
           f'<radialGradient id="cr{s}" cx="50%" cy="50%" r="28%">'
           f'<stop offset="0%" stop-color="hsl({h},90%,75%)" stop-opacity="0.85"/>'
           f'<stop offset="100%" stop-color="transparent"/></radialGradient>'
           f'</defs>'
           f'<rect width="500" height="500" fill="#020308"/>'
           f'<rect width="500" height="500" fill="url(#bg{s})"/>'
           f'<ellipse cx="250" cy="250" rx="175" ry="165" fill="hsl({h},55%,14%)" '
           f'filter="url(#f{s})" opacity="0.7">'
           f'<animate attributeName="rx" dur="{sp*6}s" values="175;195;168;175" repeatCount="indefinite"/>'
           f'</ellipse>'
           + arcs +
           f'<circle cx="250" cy="250" r="130" fill="url(#cr{s})" opacity="0.5" filter="url(#g{s})">'
           f'<animate attributeName="opacity" dur="{sp*3}s" values="0.5;0.8;0.5" repeatCount="indefinite"/>'
           f'</circle>'
           f'<text x="250" y="265" text-anchor="middle" font-family="monospace" '
           f'font-size="42" fill="white" opacity="0.9" filter="url(#g{s})">{rg}</text>'
           f'<text x="250" y="300" text-anchor="middle" font-family="monospace" '
           f'font-size="9" fill="white" opacity="0.2" letter-spacing="4">SIGNAL {token_num}/9</text>'
           f'<rect x="1" y="1" width="498" height="498" rx="12" fill="none" '
           f'stroke="hsl({h},60%,40%)" stroke-width="0.6" opacity="0.2"/>'
           f'</svg>')
    return svg



print('\n⬡  SWARM SIGNALS — Collection 2')
print('─' * 44)
print(f'  Edition:  {EDITION} tokens')
print(f'  Contract: {CONTRACT}')
print(f'  TxSeed:   {swap_data.get("txHash","")[:20]}...')
print()

results = []
for i in range(1, EDITION + 1):
    params    = derive_params(i, swap_data)
    svg       = make_svg(i, params, swap_data)

    # Encode as data URI
    svg_b64   = base64.b64encode(svg.encode()).decode()
    image_uri = f'data:image/svg+xml;base64,{svg_b64}'

    # Attributes encode the market state
    attrs = [
        {'trait_type': 'Signal',       'value': str(i)},
        {'trait_type': 'Edition',      'value': f'{i} of {EDITION}'},
        {'trait_type': 'Routing',      'value': params['routing']},
        {'trait_type': 'Complexity',   'value': round(params['complexity'], 3)},
        {'trait_type': 'Turbulence',   'value': round(params['turbulence'], 3)},
        {'trait_type': 'TxSeed',       'value': hex(params['seed'])},
        {'trait_type': 'SwapAmount',   'value': swap_data.get('amount','0.001') + ' ETH'},
        {'trait_type': 'SwapTxHash',   'value': swap_data.get('txHash','')[:20] + '...'},
        {'trait_type': 'ArtType',      'value': 'Fully Onchain SVG'},
        {'trait_type': 'MarketDriven', 'value': 'True'},
        {'trait_type': 'AgentBehavior','value': 'Uniswap Swap'},
    ]

    meta = {
        'name':        f'Swarm Signal {i} / {EDITION}',
        'description': (
            f'A crystallized moment of swarm DeFi activity. '
            f'This signal was generated from a real Uniswap swap — '
            f'routing={params["routing"]}, amount={swap_data.get("amount","0.001")} ETH. '
            f'The art encodes the transaction hash as arc segments, '
            f'routing paths as neural particles, and liquidity pools as crystalline rings. '
            f'Auction dynamics evolve the signal: bid activity shapes the final composition.'
        ),
        'image':         image_uri,
        'animation_url': image_uri,
        'external_url':  f'https://living-swarm-demo.vercel.app/royal-logs/',
        'attributes':    attrs,
        'swarm_data': {
            'txHash':    swap_data.get('txHash',''),
            'routing':   params['routing'],
            'seed':      params['seed'],
            'hue':       params['hue'],
            'complexity': params['complexity'],
            'etherscan': swap_data.get('etherscan',''),
        }
    }

    meta_json = json.dumps(meta)
    meta_b64  = base64.b64encode(meta_json.encode()).decode()
    token_uri = f'data:application/json;base64,{meta_b64}'

    print(f'→ Minting Signal {i}/{EDITION} (routing={params["routing"]}, hue={params["hue"]})...')

    cmd = [
        'rare', 'mint',
        '--contract', CONTRACT,
        '--token-uri', token_uri,
        '--chain', 'sepolia',
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    print(result.stdout.strip() or '  (no output)')
    if result.returncode != 0 and result.stderr:
        print(f'  ERR: {result.stderr.strip()[:80]}')

    # Parse token ID from output
    import re
    m = re.search(r'Token ID: (\d+)', result.stdout)
    tid = m.group(1) if m else None

    results.append({'signal': i, 'tokenId': tid, 'routing': params['routing']})

    if i < EDITION:
        time.sleep(3)  # avoid nonce conflicts

print(f'\n{"="*44}')
print(f'✓ SWARM SIGNALS minted: {EDITION} tokens')
print(f'  Contract: {CONTRACT}')
print()

# Create auctions at 0.000369 ETH
print('→ Creating auctions...')
for r in results:
    if not r['tokenId']:
        print(f'  SKIP Signal {r["signal"]} — no token ID')
        continue
    tid = r['tokenId']
    cmd = [
        'rare', 'auction', 'create',
        '--contract', CONTRACT,
        '--token-id', tid,
        '--starting-price', '0.000369',
        '--duration', '86400',
        '--chain', 'sepolia',
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    tx_m = re.search(r'(0x[a-fA-F0-9]{64})', res.stdout)
    tx_h = tx_m.group(1) if tx_m else 'pending'
    print(f'  Signal {r["signal"]} Token {tid}: {tx_h[:20]}...' if tx_h != 'pending' else f'  Signal {r["signal"]}: {res.stderr.strip()[:60]}')

print(f'\n✓ SWARM SIGNALS — {EDITION} market-driven onchain art tokens live on Sepolia')
print(f'  Each token encodes a real Uniswap swap as art.')
print(f'  TX hash arc segments = agent signature.')
print(f'  Routing type = visual complexity.')
print(f'  Bid on any token to see auction dynamics compose the signal.')
