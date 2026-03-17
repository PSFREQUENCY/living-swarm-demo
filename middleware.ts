// Gap 6 — SENTRY-03: HMAC inter-agent request verification
// Runs on Edge Runtime; verifies X-Swarm-Sig on internal /api/swarm/internal/* routes
// Public demo routes (execute, status, log, capabilities) are exempt — browser-callable

import { NextRequest, NextResponse } from 'next/server';

const SWARM_AGENT_ROUTES = /^\/api\/swarm\//;

// These are public-facing demo endpoints — no HMAC required
const PUBLIC_SWARM_PATHS = new Set([
  '/api/swarm/execute',
  '/api/swarm/status',
  '/api/swarm/log',
  '/api/swarm/capabilities',
  '/api/swarm/rebalance',
]);

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSign(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(req: NextRequest) {
  if (!SWARM_AGENT_ROUTES.test(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Public demo endpoints — bypass HMAC, allow browser calls
  if (PUBLIC_SWARM_PATHS.has(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'SENTRY-03: no secret configured' }, { status: 500 });
  }

  const ts = req.headers.get('X-Swarm-Timestamp') || '';
  const bh = req.headers.get('X-Swarm-Body-Hash') || '';
  const sig = req.headers.get('X-Swarm-Sig') || '';

  if (!ts || !bh || !sig) {
    return NextResponse.json({ error: 'SENTRY-03: missing HMAC headers' }, { status: 401 });
  }

  // Replay protection: reject if timestamp > 30s old
  if (Math.abs(Date.now() - parseInt(ts)) > 30_000) {
    return NextResponse.json({ error: 'SENTRY-03: timestamp expired' }, { status: 401 });
  }

  const expected = await hmacSign(secret, `${ts}:${bh}`);
  const sigPadded = sig.padEnd(64, '0').slice(0, 64);

  if (!timingSafeEqual(expected, sigPadded)) {
    return NextResponse.json({ error: 'SENTRY-03: invalid signature' }, { status: 401 });
  }

  const res = NextResponse.next();
  res.headers.set('X-Swarm-Sentry', 'SENTRY-03 ✓');
  return res;
}

export const config = {
  matcher: '/api/swarm/:path*',
};
