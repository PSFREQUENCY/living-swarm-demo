'use client';
// Gap 5 — Wallet-gated data room (Living Swarm)
// Signs a server-issued nonce to prove wallet ownership, then renders classified intel

import { useState } from 'react';

const INTEL = [
  { id: 'DR-001', label: 'Arbiter Threat Model v1.2', content: 'Score bands: PASS ≤25 / LOG ≤50 / HOLD ≤75 / BLOCK >75. Onchain attestations via ArbitersLedger on Sepolia.' },
  { id: 'DR-002', label: 'Session Key Architecture', content: 'AES-256-GCM keys derived from eth_personal_sign via HKDF. Non-extractable. Never leaves browser heap.' },
  { id: 'DR-003', label: 'SENTRY-03 Protocol', content: 'HMAC-SHA256 inter-agent signing. 30-second replay window. X-Swarm-Sig header on all /api/swarm/* routes.' },
  { id: 'DR-004', label: 'Private Inference Pipeline', content: 'PII stripped (ETH addrs, TX hashes, WEI amounts, email, phone, SSN, IP) before Gemini inference. Redaction log returned.' },
  { id: 'DR-005', label: 'Swap Execution Flow', content: 'Quote → Permit2 approval (EIP-712) → Swap. Chain enforcement via wallet_switchEthereumChain. Sepolia default.' },
];

export default function DataRoomPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'authed' | 'error'>('idle');
  const [address, setAddress] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  async function authenticate() {
    setStatus('loading');
    setError('');
    try {
      const eth = (window as any).ethereum;
      if (!eth) throw new Error('No wallet detected');

      const [addr] = await eth.request({ method: 'eth_requestAccounts' });
      setAddress(addr);

      // Get nonce from server
      const nonceRes = await fetch(`/api/data-room/auth?address=${addr}`);
      const { nonce } = await nonceRes.json();

      // Sign nonce with wallet
      const signature = await eth.request({ method: 'personal_sign', params: [nonce, addr] });

      // Verify with server, receive token
      const authRes = await fetch('/api/data-room/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, nonce, signature }),
      });
      if (!authRes.ok) throw new Error('Authentication failed');
      const { token: t } = await authRes.json();
      setToken(t);
      setStatus('authed');
    } catch (e: any) {
      setError(e.message);
      setStatus('error');
    }
  }

  const navLink = (href: string, label: string, active = false, purple = false) => ({
    color: active ? '#fbbf24' : purple ? 'rgba(160,100,255,.5)' : 'rgba(0,255,231,.38)',
    textDecoration: 'none' as const,
    fontSize: '9px',
    letterSpacing: '3px',
    whiteSpace: 'nowrap' as const,
    fontFamily: 'monospace',
    transition: 'color .2s',
  });

  return (
    <>
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, height: 44,
      background: 'rgba(0,3,8,.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(0,255,231,.1)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px', boxSizing: 'border-box' }}>
      <a href="/" style={{ color: 'rgba(0,255,231,.55)', textDecoration: 'none', fontSize: '10px', letterSpacing: '4px', fontFamily: 'monospace' }}>▓ LIVING SWARM</a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto' }}>
        <a href="/royal-logs/" style={navLink('/royal-logs/', 'ROYAL LOGS')}>ROYAL LOGS</a>
        <span style={{ color: 'rgba(0,255,231,.1)', fontSize: 9 }}>·</span>
        <a href="/swap/" style={navLink('/swap/', 'SWARMSWAP')}>SWARMSWAP</a>
        <span style={{ color: 'rgba(0,255,231,.1)', fontSize: 9 }}>·</span>
        <a href="/data-room" style={navLink('/data-room', 'DATA ROOM', true)}>DATA ROOM</a>
        <span style={{ color: 'rgba(0,255,231,.1)', fontSize: 9 }}>·</span>
        <a href="/swarm-signals/" style={navLink('/swarm-signals/', 'SIGNALS')}>SIGNALS</a>
      </div>
    </nav>
    <main style={{ fontFamily: 'monospace', background: '#0a0a0a', color: '#e2e8f0', minHeight: '100vh', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ borderBottom: '1px solid #1a1a2e', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <div style={{ color: '#f59e0b', fontSize: '0.7rem', letterSpacing: '0.2em' }}>LIVING SWARM</div>
          <h1 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#fbbf24' }}>DATA ROOM</h1>
          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Classified intelligence — wallet authentication required</div>
        </div>

        {status !== 'authed' && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ color: '#ef4444', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              [RESTRICTED ACCESS]
            </div>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '0.85rem' }}>
              Sign a challenge with your wallet to prove ownership and access classified intel.
            </p>
            <button
              onClick={authenticate}
              disabled={status === 'loading'}
              style={{
                background: status === 'loading' ? '#374151' : '#f59e0b',
                color: '#0a0a0a', border: 'none', padding: '0.75rem 2rem',
                fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer',
                fontSize: '0.85rem', letterSpacing: '0.05em',
              }}
            >
              {status === 'loading' ? 'AUTHENTICATING...' : 'CONNECT WALLET & AUTHENTICATE'}
            </button>
            {error && <div style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.75rem' }}>{error}</div>}
          </div>
        )}

        {status === 'authed' && (
          <>
            <div style={{ background: '#052e16', border: '1px solid #16a34a', padding: '0.75rem 1rem', marginBottom: '2rem', fontSize: '0.75rem' }}>
              <span style={{ color: '#4ade80' }}>ACCESS GRANTED</span>
              <span style={{ color: '#64748b', marginLeft: '1rem' }}>{address}</span>
            </div>

            {INTEL.map(doc => (
              <div key={doc.id} style={{ border: '1px solid #1e293b', marginBottom: '1rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.7rem' }}>{doc.id}</span>
                  <span style={{ color: '#16a34a', fontSize: '0.65rem' }}>DECLASSIFIED</span>
                </div>
                <div style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{doc.label}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6 }}>{doc.content}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
    </>
  );
}
