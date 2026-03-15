// Gap 5 — Wallet-gated data room: challenge/response auth
// Server issues a nonce; client signs it; server verifies the signature

import { ethers } from 'ethers';

const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory nonce store (single-use, TTL-bounded)
const nonces = new Map<string, number>(); // nonce → expiry ts

export function issueNonce(address: string): string {
  const nonce = `living-swarm-access:${address.toLowerCase()}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  nonces.set(nonce, Date.now() + NONCE_TTL_MS);
  return nonce;
}

export function verifyNonce(nonce: string, signature: string, expectedAddress: string): boolean {
  const expiry = nonces.get(nonce);
  if (!expiry || Date.now() > expiry) return false;
  nonces.delete(nonce); // single-use

  try {
    const recovered = ethers.verifyMessage(nonce, signature);
    return recovered.toLowerCase() === expectedAddress.toLowerCase();
  } catch {
    return false;
  }
}

/** Generate a short-lived JWT-like access token (HMAC-signed, base64url) */
export function issueAccessToken(address: string): string {
  const payload = JSON.stringify({ sub: address.toLowerCase(), iat: Date.now(), exp: Date.now() + NONCE_TTL_MS });
  const b64 = Buffer.from(payload).toString('base64url');
  const secret = process.env.HMAC_SECRET || 'fallback';
  const { createHmac } = require('crypto');
  const sig = createHmac('sha256', secret).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyAccessToken(token: string): { sub: string } | null {
  try {
    const [b64, sig] = token.split('.');
    const secret = process.env.HMAC_SECRET || 'fallback';
    const { createHmac } = require('crypto');
    const expected = createHmac('sha256', secret).update(b64).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString());
    if (Date.now() > payload.exp) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}
