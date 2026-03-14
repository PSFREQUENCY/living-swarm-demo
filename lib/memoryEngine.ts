// ═══════════════════════════════════════════════════════════════
// ROYAL LOGS — Memory Engine v2
// Age-tic memory: snapshots categorized by temporal wisdom tier
// ═══════════════════════════════════════════════════════════════

export type AgeTier = 'INFANT' | 'YOUTH' | 'MATURE' | 'ELDER' | 'TRANSCENDENT';
export type EditionSize = 3 | 6 | 9;
export type InteractionType = 'with_human' | 'with_agent' | 'with_world';

export interface MemorySnapshot {
  id:             string;
  timestamp:      number;
  ageTier:        AgeTier;
  interaction:    InteractionType;
  rawInput:       string;
  crystallized:   CrystalizedMemory;
  shaderSeed:     number;
  wisdomScore:    number;
  collectionIndex:number;
  editionSize:    EditionSize;
  mintedTokenIds: number[];
  contractAddress?: string;
}

export interface CrystalizedMemory {
  title:          string;
  haiku:          string;
  essence:        string;
  keywords:       string[];
  colorPalette:   ColorPalette;
  geometryParams: GeometryParams;
  metadata: {
    model:          string;
    tokensUsed:     number;
    crystallizedAt: number;
  };
}

export interface ColorPalette {
  primary:   string;
  secondary: string;
  accent:    string;
  void:      string;
}

export interface GeometryParams {
  complexity:    number;
  turbulence:    number;
  crystallinity: number;
  luminosity:    number;
  temporalSpeed: number;
}

const TIER_THRESHOLDS: Record<AgeTier, { min: number; max: number }> = {
  INFANT:       { min: 0,  max: 19  },
  YOUTH:        { min: 20, max: 39  },
  MATURE:       { min: 40, max: 64  },
  ELDER:        { min: 65, max: 89  },
  TRANSCENDENT: { min: 90, max: 100 },
};

export const TIER_PALETTES: Record<AgeTier, ColorPalette> = {
  INFANT:       { primary: '#9b59ff', secondary: '#c084fc', accent: '#ff6ef7', void: '#050510' },
  YOUTH:        { primary: '#00f5ff', secondary: '#22d3ee', accent: '#39ff8f', void: '#050518' },
  MATURE:       { primary: '#ffd700', secondary: '#fde047', accent: '#f97316', void: '#0a0804' },
  ELDER:        { primary: '#34d399', secondary: '#6ee7b7', accent: '#818cf8', void: '#030e08' },
  TRANSCENDENT: { primary: '#f0abfc', secondary: '#e879f9', accent: '#ffd700', void: '#080014' },
};

export const EDITION_PRICES: Record<EditionSize, string> = {
  3: '0.000369',
  6: '0.000369',
  9: '0.000369',
};

export function calculateWisdomScore(
  input: string,
  interactionCount: number,
  interactionType: InteractionType
): number {
  const lengthScore  = Math.min(input.length / 500, 1) * 20;
  const depthBonus   = interactionType === 'with_world' ? 10 : interactionType === 'with_agent' ? 7 : 5;
  const countBonus   = Math.min(interactionCount * 3, 30);
  const complexScore = (input.split(' ').length / 100) * 20;
  const entropy      = Math.random() * 20;
  return Math.min(Math.round(lengthScore + depthBonus + countBonus + complexScore + entropy), 100);
}

export function getTierFromScore(score: number): AgeTier {
  for (const [tier, { min, max }] of Object.entries(TIER_THRESHOLDS)) {
    if (score >= min && score <= max) return tier as AgeTier;
  }
  return 'INFANT';
}

export function getPaletteForTier(tier: AgeTier): ColorPalette { return TIER_PALETTES[tier]; }

export function deriveShaderSeed(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash / 0xffffffff;
}

export function deriveGeometryParams(tier: AgeTier, seed: number): GeometryParams {
  const idx = ['INFANT','YOUTH','MATURE','ELDER','TRANSCENDENT'].indexOf(tier) / 4;
  return {
    complexity:    0.2 + idx * 0.6 + seed * 0.2,
    turbulence:    idx < 0.5 ? 0.7 - idx * 0.4 : 0.2 + seed * 0.3,
    crystallinity: idx * 0.8 + seed * 0.2,
    luminosity:    0.4 + seed * 0.4,
    temporalSpeed: 0.3 + (1 - idx) * 0.5,
  };
}

export function selectEditionSize(wisdomScore: number): EditionSize {
  if (wisdomScore >= 90) return 3;  // TRANSCENDENT — rarest
  if (wisdomScore >= 65) return 6;  // ELDER
  return 9;                          // common editions
}

export function generateMemoryId(timestamp: number, seed: number): string {
  const hex = (n: number) => Math.floor(n * 0xffffff).toString(16).padStart(6, '0');
  return `rl_${timestamp.toString(36)}_${hex(seed)}`;
}

const STORAGE_KEY = 'royal_logs_memories';

export function saveMemory(memory: MemorySnapshot): void {
  if (typeof window === 'undefined') return;
  const existing = loadMemories();
  const updated  = [memory, ...existing].slice(0, 99);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadMemories(): MemorySnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getMemoryById(id: string): MemorySnapshot | null {
  return loadMemories().find(m => m.id === id) ?? null;
}

export function clearMemories(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
