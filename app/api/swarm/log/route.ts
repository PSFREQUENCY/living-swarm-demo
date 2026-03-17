import { NextResponse } from 'next/server';

export async function GET() {
  // Serve the static seed log — in production this would be updated per run
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://living-swarm-demo.vercel.app';
  try {
    const res = await fetch(`${baseUrl}/agent_log.json`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('log not found');
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
    });
  } catch {
    return NextResponse.json({ status: 'no_log', message: 'No execution log yet. POST /api/swarm/execute to generate.' }, { status: 404 });
  }
}
