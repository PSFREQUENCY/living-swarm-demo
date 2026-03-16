'use client';
import dynamic from 'next/dynamic';

// ssr:false requires a Client Component page — that is correct and required.
// The BAILOUT_TO_CLIENT_SIDE_RENDERING in the server HTML is expected / harmless.
const GhostTown = dynamic(() => import('../components/GhostTown'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw', height: '100vh', background: '#030308',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Share Tech Mono',monospace", fontSize: 11,
      letterSpacing: 4, color: 'rgba(0,255,231,0.4)'
    }}>
      LOADING 81 GHOST TOWN...
    </div>
  ),
});

export default function GamePage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#030308' }}>
      <GhostTown />
    </div>
  );
}
