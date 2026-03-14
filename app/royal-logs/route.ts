import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const html = readFileSync(join(process.cwd(), 'public/royal-logs/index.html'), 'utf-8');
  return new NextResponse(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
