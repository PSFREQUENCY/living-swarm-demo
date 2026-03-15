// ═══════════════════════════════════════════════════════════════
// LIVING SWARM — /api/venice/crystallize
// Venice AI privacy-preserving inference layer for agent memory crystallization
//
// Double privacy architecture:
//   1. lib/pii-stripper.ts  — redacts ETH addrs, WEI, emails, phones, IPs BEFORE inference
//   2. Venice AI inference  — uncensored, zero data retention, no training on your data
//
// Venice API docs: https://docs.venice.ai
// Model: llama-3.3-70b (fast, capable, fully open-source weights)
// ═══════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { stripPII } from '@/lib/pii-stripper';
import {
  calculateWisdomScore, getTierFromScore, getPaletteForTier,
  deriveShaderSeed, deriveGeometryParams, generateMemoryId,
  selectEditionSize, InteractionType,
} from '@/lib/memoryEngine';

const VENICE_API  = 'https://api.venice.ai/api/v1/chat/completions';
const VENICE_MODEL = 'llama-3.3-70b';

export async function POST(req: NextRequest) {
  try {
    const { rawInput, interactionType, interactionCount = 1 } = await req.json();

    if (!rawInput || rawInput.trim().length < 20) {
      return NextResponse.json({ error: 'Memory too brief to crystallize' }, { status: 400 });
    }

    const apiKey = process.env.VENICE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'VENICE_API_KEY not configured' }, { status: 500 });

    // ── Gap 2: PII redaction before ANY inference reaches Venice ──
    const { stripped, redactions } = stripPII(rawInput);
    const piiFound = redactions.length > 0;

    // ── Memory scoring ──────────────────────────────────────────
    const wisdomScore = calculateWisdomScore(stripped, interactionCount, interactionType as InteractionType);
    const ageTier     = getTierFromScore(wisdomScore);
    const palette     = getPaletteForTier(ageTier);
    const seed        = deriveShaderSeed(stripped);
    const geometry    = deriveGeometryParams(ageTier, seed);

    // ── Venice inference — privacy-preserving ───────────────────
    const prompt = `You are a poetic AI crystallizing agent memory into art metadata. Respond ONLY with valid JSON, no markdown, no code fences.

Memory tier: ${ageTier} | Wisdom score: ${wisdomScore}/100
Color palette: primary=${palette.primary} secondary=${palette.secondary} accent=${palette.accent}

Agent memory to crystallize:
"${stripped}"

Return exactly this JSON structure:
{
  "title": "2-4 word evocative title",
  "haiku": "5-7-5 haiku poem (3 lines separated by \\n)",
  "essence": "one sentence capturing the soul of this memory",
  "keywords": ["word1","word2","word3","word4","word5"]
}`;

    const veniceRes = await fetch(VENICE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: VENICE_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 512,
        venice_parameters: {
          include_venice_system_prompt: false,
        },
      }),
    });

    if (!veniceRes.ok) {
      const err = await veniceRes.json().catch(() => ({}));
      return NextResponse.json({ error: 'Venice inference error', details: err }, { status: 502 });
    }

    const veniceData = await veniceRes.json();
    const rawText = veniceData.choices?.[0]?.message?.content ?? '';

    // Strip code fences if model wraps output
    let jsonStr = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    // Sanitize literal newlines inside JSON strings
    jsonStr = jsonStr.replace(/"((?:[^"\\]|\\.)*)"/g, (_m: string, inner: string) =>
      `"${inner.replace(/\n/g, '\\n').replace(/\r/g, '')}"`
    );

    let crystallized: any;
    try {
      crystallized = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Venice parse error', raw: rawText.slice(0, 300) }, { status: 502 });
    }

    const memory = {
      id: generateMemoryId(Date.now(), seed),
      timestamp: Date.now(),
      ageTier,
      interaction: interactionType,
      rawInput,
      shaderSeed: seed,
      wisdomScore,
      collectionIndex: 0,
      editionSize: selectEditionSize(wisdomScore),
      mintedTokenIds: [] as number[],
      privacy: {
        piiFound,
        redactions,
        strippedForInference: stripped,
      },
      crystallized: {
        ...crystallized,
        colorPalette: palette,
        geometryParams: geometry,
        metadata: {
          provider: 'venice-ai',
          model: VENICE_MODEL,
          tokensUsed: veniceData.usage?.total_tokens ?? 0,
          crystallizedAt: Date.now(),
          privateMode: true,
          piiRedacted: piiFound,
        },
      },
    };

    return NextResponse.json({ memory, redactionLog: redactions });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
