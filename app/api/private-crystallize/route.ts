// Gap 2 — Private inference: PII-stripped crystallization
// Identical to /api/crystallize but strips PII before sending to Gemini

import { NextRequest, NextResponse } from 'next/server';
import { stripPII } from '@/lib/pii-stripper';
import {
  calculateWisdomScore, getTierFromScore, getPaletteForTier,
  deriveShaderSeed, deriveGeometryParams, generateMemoryId,
  selectEditionSize, InteractionType,
} from '@/lib/memoryEngine';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(req: NextRequest) {
  try {
    const { rawInput, interactionType, interactionCount = 1 } = await req.json();

    if (!rawInput || rawInput.trim().length < 3) {
      return NextResponse.json({ error: 'Memory too brief to crystallize' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });

    // Gap 2: Strip PII before sending to external AI
    const { stripped, redactions, piiFound } = stripPII(rawInput);

    const wisdomScore = calculateWisdomScore(rawInput, interactionCount, interactionType as InteractionType);
    const ageTier     = getTierFromScore(wisdomScore);
    const palette     = getPaletteForTier(ageTier);
    const seed        = deriveShaderSeed(rawInput);
    const geometry    = deriveGeometryParams(ageTier, seed);
    const editionSize = selectEditionSize(wisdomScore);
    const timestamp   = Date.now();
    const id          = generateMemoryId(timestamp, seed);

    const prompt = `You are a temporal memory crystallizer. Transform this interaction into crystalline art metadata.

INTERACTION TYPE: ${interactionType.replace('_', ' ').toUpperCase()}
AGE TIER: ${ageTier} (wisdom: ${wisdomScore}/100)
RAW MEMORY: "${stripped}"

Return ONLY valid JSON with this exact structure:
{
  "title": "A poetic 2-5 word title, evocative and cryptic",
  "haiku": "Line one (5 syllables)\nLine two (7 syllables)\nLine three (5 syllables)",
  "essence": "One precise sentence capturing the deepest truth of this memory",
  "keywords": ["word1", "word2", "word3", "word4", "word5"]
}

Rules:
- Title: mysterious, temporal, never literal
- Haiku: reference the interaction type (${interactionType.replace('_',' ')}) and wisdom tier (${ageTier})
- Essence: philosophical, not descriptive
- Keywords: concepts that could manifest as visual elements
- No markdown, no explanation, pure JSON only`;

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, topP: 0.95, maxOutputTokens: 512 },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return NextResponse.json({ error: `Gemini error: ${err}` }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const tokensUsed = geminiData.usageMetadata?.totalTokenCount ?? 0;

    let crystallized;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      crystallized = JSON.parse(jsonMatch?.[0] ?? rawText);
    } catch {
      return NextResponse.json({ error: 'Failed to parse Gemini crystallization', raw: rawText }, { status: 500 });
    }

    const memory = {
      id,
      timestamp,
      ageTier,
      interaction: interactionType,
      rawInput,          // original preserved locally
      shaderSeed: seed,
      wisdomScore,
      collectionIndex: 0,
      editionSize,
      mintedTokenIds: [],
      privacy: { piiFound, redactions, strippedForInference: stripped },
      crystallized: {
        ...crystallized,
        colorPalette: palette,
        geometryParams: geometry,
        metadata: {
          model: 'gemini-2.0-flash',
          tokensUsed,
          crystallizedAt: timestamp,
          privateMode: true,
        },
      },
    };

    return NextResponse.json({ memory });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
