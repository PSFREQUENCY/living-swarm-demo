// Gap 6 — HMAC inter-agent signing (SENTRY-03)
// Used by middleware (verifier) and API routes (signer)

import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

const secret = () => process.env.HMAC_SECRET!;

export function signSwarmRequest(timestamp: string, bodyHash: string): string {
  return createHmac('sha256', secret())
    .update(`${timestamp}:${bodyHash}`)
    .digest('hex');
}

export function verifySwarmSignature(
  timestamp: string,
  bodyHash: string,
  sig: string
): boolean {
  if (!secret()) return false;
  // Replay protection: reject if timestamp > 30s old
  if (Math.abs(Date.now() - parseInt(timestamp)) > 30_000) return false;
  const expected = signSwarmRequest(timestamp, bodyHash);
  try {
    return timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(sig.padEnd(64, '0').slice(0, 64), 'hex')
    );
  } catch { return false; }
}

export function hashBody(body: string): string {
  return createHmac('sha256', 'body-hash-salt')
    .update(body)
    .digest('hex');
}

/** Fetch wrapper that adds SENTRY-03 HMAC headers for inter-agent calls */
export async function agentFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const ts = Date.now().toString();
  const body = options.body ? String(options.body) : '';
  const bh = hashBody(body);
  const sig = signSwarmRequest(ts, bh);
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
      'X-Swarm-Origin': 'agent',
      'X-Swarm-Timestamp': ts,
      'X-Swarm-Body-Hash': bh,
      'X-Swarm-Sig': sig,
    },
  });
}
