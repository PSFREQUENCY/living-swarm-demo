'use client';

export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#030308',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16,
      fontFamily: "'Share Tech Mono',monospace", color: 'rgba(0,255,231,0.6)',
    }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: '#f56565' }}>⚠ GHOST TOWN ERROR</div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', maxWidth: 400, textAlign: 'center' }}>
        {error.message || 'A client-side exception occurred.'}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={reset}
          style={{ background: 'rgba(0,255,231,0.08)', border: '1px solid rgba(0,255,231,0.3)',
            color: '#00ffe7', padding: '8px 20px', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 9, letterSpacing: 3, borderRadius: 4 }}>
          RETRY
        </button>
        <a href="/"
          style={{ background: 'transparent', border: '1px solid rgba(0,255,231,0.15)',
            color: 'rgba(0,255,231,0.4)', padding: '8px 20px', textDecoration: 'none',
            fontFamily: 'inherit', fontSize: 9, letterSpacing: 3, borderRadius: 4 }}>
          ← HOME
        </a>
      </div>
    </div>
  );
}
