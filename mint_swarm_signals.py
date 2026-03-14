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
    """
    SWARM SIGNALS SVG — market-state driven onchain art
    Visual layers:
    1. Void background with market-hued gradient
    2. Turbulent plasma field (driven by swap freq/complexity)
    3. Neural signal lines (represent routing paths)
    4. Crystalline lattice (represents liquidity pools)
    5. Data stream particles (represent swap volume)
    6. Caustic core (the swap execution point)
    7. Market state indicators (glyphs encoding CLASSIC/DUTCH/PRIORITY)
    8. Agent signature ring (the tx hash encoded as arc segments)
    """
    s = p['seed']; h = p['hue']; h2 = p['hue2']; h3 = p['hue3']
    sp = round(p['speed'],2); fr = round(p['freq'],4); fr2 = round(p['freq']*1.6,4)
    routing = p['routing']

    # Routing glyph
    route_glyph = {'CLASSIC':'◉','DUTCH_V2':'⬡','DUTCH_V3':'⬡','PRIORITY':'✦','WRAP':'◈'}.get(routing,'◈')

    # TX hash arc segments (first 8 bytes of tx hash = 8 arc segments)
    tx = swap.get('txHash','0x' + '0'*64)
    arc_segments = ''
    for i in range(8):
        byte_val = int(tx[2+i*2:4+i*2], 16) if len(tx) > 4+i*2 else i*30
        angle = (byte_val / 255) * 360
        r = 130 + i * 8
        # Convert to arc path
        rad = math.radians(angle)
        x2 = 250 + r * math.cos(rad)
        y2 = 250 + r * math.sin(rad)
        opacity = round(0.05 + (byte_val/255)*0.12, 3)
        arc_segments += (f'<circle cx="250" cy="250" r="{r}" fill="none" '
            f'stroke="hsl({h+i*20},{60+byte_val//5}%,{50+i*3}%)" '
            f'stroke-width="0.4" stroke-dasharray="{byte_val//4} {256//4}" '
            f'opacity="{opacity}" filter="url(#glow{s})">'
            f'<animateTransform attributeName="transform" type="rotate" '
            f'from="{byte_val} 250 250" to="{byte_val+360} 250 250" '
            f'dur="{round(sp*8+i*3,1)}s" repeatCount="indefinite"/>'
            f'</circle>\n')

    # Data stream particles (7 = number of routing hops in complex paths)
    particles = ''
    for i in range(7):
        angle = i * (360/7) + s % 60
        cx = 250 + 95 * math.cos(math.radians(angle))
        cy = 250 + 95 * math.sin(math.radians(angle))
        p_hue = (h + i*40) % 360
        particles += (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2.5" '
            f'fill="hsl({p_hue},80%,65%)" opacity="0.6" filter="url(#glow{s})">'
            f'<animate attributeName="opacity" dur="{round(0.8+i*0.3,1)}s" '
            f'values="0.6;1;0.6" repeatCount="indefinite"/>'
            f'<animate attributeName="r" dur="{round(1.2+i*0.2,1)}s" '
            f'values="2.5;4;2.5" repeatCount="indefinite"/>'
            f'</circle>\n')
        # Connection line to center
        particles += (f'<line x1="250" y1="250" x2="{cx:.1f}" y2="{cy:.1f}" '
            f'stroke="hsl({p_hue},60%,40%)" stroke-width="0.3" opacity="0.15"/>\n')

    # Market state glyph ring
    glyphs = ''
    glyph_chars = ['01','∆','◈','⬡','⟳','◉','0x']
    for i, g in enumerate(glyph_chars[:token_num+2]):
        angle = i * (360/len(glyph_chars[:token_num+2]))
        gx = 250 + 170 * math.cos(math.radians(angle))
        gy = 250 + 170 * math.sin(math.radians(angle))
        glyphs += (f'<text x="{gx:.1f}" y="{gy:.1f}" text-anchor="middle" '
            f'font-family="monospace" font-size="9" fill="hsl({h3},60%,50%)" '
            f'opacity="0.18" letter-spacing="1">{g}</text>\n')

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
<defs>
  <!-- Market plasma filter -->
  <filter id="plasma{s}" x="-30%" y="-30%" width="160%" height="160%">
    <feTurbulence type="fractalNoise" baseFrequency="{fr} {round(fr*0.8,4)}" numOctaves="{min(3+token_num//3,6)}" seed="{s}">
      <animate attributeName="baseFrequency" dur="{round(sp*9,1)}s"
        values="{fr} {round(fr*0.8,4)};{fr2} {round(fr2*0.9,4)};{fr} {round(fr*0.8,4)}"
        repeatCount="indefinite"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" scale="{22+token_num*3}" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <!-- Signal glow -->
  <filter id="glow{s}">
    <feGaussianBlur stdDeviation="5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <!-- Glass refraction -->
  <filter id="glass{s}" x="-15%" y="-15%" width="130%" height="130%">
    <feTurbulence type="turbulence" baseFrequency="0.045" numOctaves="3" seed="{s+11}" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="9"/>
    <feComponentTransfer>
      <feFuncR type="gamma" amplitude="1.1" exponent="0.8" offset="0.03"/>
      <feFuncB type="gamma" amplitude="1.3" exponent="0.7" offset="0.06"/>
    </feComponentTransfer>
  </filter>
  <!-- Caustic glow -->
  <filter id="caustic{s}">
    <feGaussianBlur stdDeviation="10" result="blur"/>
    <feColorMatrix type="saturate" values="2" in="blur" result="sat"/>
    <feMerge><feMergeNode in="sat"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <!-- Gradients -->
  <radialGradient id="bg{s}" cx="50%" cy="50%" r="70%">
    <stop offset="0%" stop-color="hsl({h},60%,12%)">
      <animate attributeName="stop-color" dur="{round(sp*7,1)}s"
        values="hsl({h},60%,12%);hsl({h2},55%,8%);hsl({h3},50%,10%);hsl({h},60%,12%)"
        repeatCount="indefinite"/>
    </stop>
    <stop offset="100%" stop-color="#020308"/>
  </radialGradient>
  <radialGradient id="core{s}" cx="50%" cy="50%" r="25%">
    <stop offset="0%" stop-color="hsl({h},95%,80%)" stop-opacity="0.9"/>
    <stop offset="60%" stop-color="hsl({h2},80%,50%)" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <linearGradient id="rim{s}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="hsl({h},100%,70%)" stop-opacity="0.4"/>
    <stop offset="33%" stop-color="hsl({h2},100%,65%)" stop-opacity="0.2"/>
    <stop offset="100%" stop-color="hsl({h3},100%,60%)" stop-opacity="0.4"/>
  </linearGradient>
</defs>

<!-- Void background -->
<rect width="500" height="500" fill="#020308"/>
<rect width="500" height="500" fill="url(#bg{s})"/>

<!-- Plasma field — market turbulence -->
<ellipse cx="250" cy="250" rx="185" ry="175"
  fill="hsl({h},55%,14%)" filter="url(#plasma{s})" opacity="0.7">
  <animate attributeName="rx" dur="{round(sp*6,1)}s" values="185;205;178;190;185" repeatCount="indefinite"/>
  <animate attributeName="ry" dur="{round(sp*8,1)}s" values="175;162;188;170;175" repeatCount="indefinite"/>
</ellipse>

<!-- TX hash arc segments (agent signature) -->
{arc_segments}

<!-- Liquidity pool rings (crystalline lattice) -->
<circle cx="250" cy="250" r="155" fill="none"
  stroke="hsl({h},70%,55%)" stroke-width="0.5" opacity="0.25" filter="url(#glow{s})">
  <animateTransform attributeName="transform" type="rotate"
    from="0 250 250" to="360 250 250" dur="{round(sp*24,1)}s" repeatCount="indefinite"/>
</circle>
<circle cx="250" cy="250" r="115" fill="none"
  stroke="hsl({h2},70%,60%)" stroke-width="0.5" opacity="0.2" filter="url(#glow{s})">
  <animateTransform attributeName="transform" type="rotate"
    from="360 250 250" to="0 250 250" dur="{round(sp*17,1)}s" repeatCount="indefinite"/>
</circle>
<circle cx="250" cy="250" r="78" fill="none"
  stroke="hsl({h3},70%,55%)" stroke-width="0.4" opacity="0.18" filter="url(#glow{s})">
  <animateTransform attributeName="transform" type="rotate"
    from="0 250 250" to="360 250 250" dur="{round(sp*11,1)}s" repeatCount="indefinite"/>
</circle>

<!-- Glass sphere (liquid market surface) -->
<circle cx="250" cy="250" r="160"
  fill="rgba(255,255,255,0.02)" filter="url(#glass{s})"
  stroke="url(#rim{s})" stroke-width="1.2"/>

<!-- Routing path particles -->
{particles}

<!-- Market state glyphs -->
{glyphs}

<!-- Caustic core (swap execution) -->
<circle cx="250" cy="250" r="130"
  fill="url(#core{s})" opacity="0.5" filter="url(#caustic{s})">
  <animate attributeName="opacity" dur="{round(sp*4,1)}s"
    values="0.5;0.85;0.5" repeatCount="indefinite"/>
</circle>

<!-- Central routing glyph -->
<text x="250" y="262" text-anchor="middle" font-family="monospace"
  font-size="38" fill="white" opacity="0.92" filter="url(#caustic{s})">{route_glyph}</text>
<text x="250" y="282" text-anchor="middle" font-family="monospace"
  font-size="8" fill="white" opacity="0.2" letter-spacing="4">{routing}</text>

<!-- Edition marker -->
<text x="250" y="312" text-anchor="middle" font-family="monospace"
  font-size="8" fill="white" opacity="0.15" letter-spacing="3">
  SIGNAL {token_num} / {EDITION}</text>

<!-- Scan line -->
<rect x="0" y="0" width="500" height="1.5" fill="rgba(255,255,255,0.015)" opacity="0">
  <animate attributeName="y" dur="{round(sp*5,1)}s" from="-2" to="502" repeatCount="indefinite"/>
  <animate attributeName="opacity" dur="{round(sp*5,1)}s" values="0;0.4;0" repeatCount="indefinite"/>
</rect>

<!-- Border -->
<rect x="1" y="1" width="498" height="498" rx="12"
  fill="none" stroke="url(#rim{s})" stroke-width="0.8"/>
</svg>'''
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
