'use client';
import dynamic from 'next/dynamic';

const GhostTown = dynamic(() => import('../components/GhostTown'), { ssr: false });

export default function GamePage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#030308' }}>
      <GhostTown />
    </div>
  );
}
