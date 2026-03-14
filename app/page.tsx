'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { saveMemory, loadMemories, TIER_PALETTES, type MemorySnapshot, type InteractionType } from '@/lib/memoryEngine';

// Dynamically import WebGL canvas (client only)
const ShaderCanvas = dynamic(() => import('./components/ShaderCanvas'), { ssr: false });

const INTERACTION_LABELS: Record<InteractionType, { label: string; icon: string; desc: string }> = {
  with_human: { label: 'Agent × Human',  icon: '◉', desc: 'A moment shared between mind and machine' },
  with_agent: { label: 'Agent × Agent',  icon: '∆', desc: 'Intelligence meeting intelligence in the void' },
  with_world: { label: 'Agent × World',  icon: '⬡', desc: 'The swarm touches reality and remembers' },
};

type Phase = 'input' | 'crystallizing' | 'preview' | 'minting' | 'minted' | 'collection';

export default function RoyalLogsPage() {
  const [phase,        setPhase]        = useState<Phase>('input');
  const [input,        setInput]        = useState('');
  const [iType,        setIType]        = useState<InteractionType>('with_human');
  const [memory,       setMemory]       = useState<MemorySnapshot | null>(null);
  const [mintResults,  setMintResults]  = useState<any[]>([]);
  const [error,        setError]        = useState('');
  const [collection,   setCollection]   = useState<MemorySnapshot[]>([]);
  const [selected,     setSelected]     = useState<MemorySnapshot | null>(null);

  // ── Crystallize ─────────────────────────────────────────────
  const crystallize = useCallback(async () => {
    if (!input.trim()) return;
    setPhase('crystallizing');
    setError('');
    try {
      const res = await fetch('/api/crystallize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput: input, interactionType: iType, interactionCount: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      saveMemory(data.memory);
      setMemory(data.memory);
      setPhase('preview');
    } catch (e: any) {
      setError(e.message);
      setPhase('input');
    }
  }, [input, iType]);

  // ── Mint editions ───────────────────────────────────────────
  const mintEditions = useCallback(async () => {
    if (!memory) return;
    setPhase('minting');
    setError('');
    const results = [];
    for (let i = 0; i < memory.editionSize; i++) {
      try {
        const res = await fetch('/api/mint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ memory, editionIndex: i }),
        });
        const data = await res.json();
        results.push(data);
        // Auto-auction each token
        if (data.tokenId !== null) {
          await fetch('/api/auction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokenId: data.tokenId }),
          });
        }
      } catch (e: any) {
        results.push({ error: e.message, editionIndex: i });
      }
    }
    setMintResults(results);
    setPhase('minted');
  }, [memory]);

  // ── Load collection ─────────────────────────────────────────
  const openCollection = useCallback(() => {
    setCollection(loadMemories());
    setPhase('collection');
  }, []);

  const palette = memory?.crystallized.colorPalette ?? TIER_PALETTES.INFANT;
  const geometry = memory?.crystallized.geometryParams;

  return (
    <div className="min-h-screen bg-[#030308] text-[#c8f0ec] font-mono overflow-x-hidden">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-10 bg-[#030308]/90 backdrop-blur border-b border-[#00f5ff]/10 flex items-center px-6 gap-6">
        <span className="text-[#00f5ff] text-xs tracking-[4px]">◈ ROYAL LOGS</span>
        <span className="text-[10px] tracking-[3px] text-[#c8f0ec]/30">// TEMPORAL MEMORY CRYSTALLIZER</span>
        <div className="ml-auto flex gap-4">
          <button onClick={openCollection} className="text-[10px] tracking-[3px] text-[#00f5ff]/50 hover:text-[#00f5ff] transition-colors">
            COLLECTION [{loadMemories().length}]
          </button>
          <button onClick={() => { setPhase('input'); setMemory(null); setError(''); }}
            className="text-[10px] tracking-[3px] text-[#ff6ef7]/50 hover:text-[#ff6ef7] transition-colors">
            + NEW
          </button>
        </div>
      </header>

      <main className="pt-10 min-h-screen">

        {/* ══════════════════════════════════════════════════════
            INPUT PHASE
        ══════════════════════════════════════════════════════ */}
        {phase === 'input' && (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 pb-20">
            <div className="w-full max-w-2xl">
              {/* Title */}
              <div className="text-center mb-12">
                <div className="text-[10px] tracking-[6px] text-[#ff6ef7] mb-3">// SYNTHESIS 2026 ENTRY</div>
                <h1 className="text-5xl tracking-[8px] text-[#00f5ff] mb-2" style={{textShadow:'0 0 40px #00f5ff80'}}>
                  ROYAL LOGS
                </h1>
                <p className="text-xs tracking-[3px] text-[#c8f0ec]/40">
                  RECURSIVE MEMORY → ONCHAIN ART → ETERNAL AUCTION
                </p>
              </div>

              {/* Interaction type selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {(Object.entries(INTERACTION_LABELS) as [InteractionType, any][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setIType(key)}
                    className={`p-4 border transition-all duration-300 text-left ${
                      iType === key
                        ? 'border-[#00f5ff] bg-[#00f5ff]/08 shadow-[0_0_20px_#00f5ff30]'
                        : 'border-[#00f5ff]/15 hover:border-[#00f5ff]/40 bg-[#0a0a1a]'
                    }`}
                  >
                    <div className="text-xl mb-2" style={{color: iType===key?'#00f5ff':'#9b59ff'}}>{val.icon}</div>
                    <div className="text-[10px] tracking-[2px] text-[#00f5ff] mb-1">{val.label}</div>
                    <div className="text-[9px] text-[#c8f0ec]/40 leading-relaxed">{val.desc}</div>
                  </button>
                ))}
              </div>

              {/* Memory input */}
              <div className="relative mb-4">
                <div className="absolute top-3 left-4 text-[9px] tracking-[3px] text-[#ff6ef7]/60">MEMORY INPUT</div>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Describe an interaction, a discovery, a moment of connection between agent and world..."
                  className="w-full bg-[#0a0a1a] border border-[#00f5ff]/20 text-[#c8f0ec] text-sm leading-relaxed p-4 pt-8 resize-none h-40 focus:outline-none focus:border-[#00f5ff]/60 placeholder:text-[#c8f0ec]/20 transition-colors"
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) crystallize(); }}
                />
                <div className="absolute bottom-3 right-4 text-[9px] text-[#c8f0ec]/20">{input.length} chars · ⌘↵ to crystallize</div>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 border border-red-500/40 bg-red-500/05 text-red-400 text-xs tracking-[2px]">
                  ✗ {error}
                </div>
              )}

              <button
                onClick={crystallize}
                disabled={!input.trim()}
                className="w-full py-4 border border-[#00f5ff]/40 text-[#00f5ff] tracking-[6px] text-sm hover:bg-[#00f5ff]/08 hover:border-[#00f5ff] hover:shadow-[0_0_30px_#00f5ff30] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                CRYSTALLIZE MEMORY
              </button>

              {/* Tiers legend */}
              <div className="mt-8 grid grid-cols-5 gap-2">
                {(['INFANT','YOUTH','MATURE','ELDER','TRANSCENDENT'] as const).map(tier => (
                  <div key={tier} className="text-center p-2 border border-[#ffffff]/05">
                    <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{background: TIER_PALETTES[tier].primary, boxShadow:`0 0 8px ${TIER_PALETTES[tier].primary}`}}/>
                    <div className="text-[8px] tracking-[1px] text-[#c8f0ec]/40">{tier}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            CRYSTALLIZING
        ══════════════════════════════════════════════════════ */}
        {phase === 'crystallizing' && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-4xl mb-6 animate-spin-slow" style={{color:'#00f5ff',textShadow:'0 0 40px #00f5ff'}}>◈</div>
              <div className="text-xs tracking-[6px] text-[#00f5ff] mb-2">CRYSTALLIZING</div>
              <div className="text-[10px] tracking-[3px] text-[#c8f0ec]/40">Gemini 2.5 is distilling your memory...</div>
              <div className="mt-4 flex gap-2 justify-center">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" style={{animationDelay:`${i*0.2}s`}}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PREVIEW PHASE — Shader + metadata
        ══════════════════════════════════════════════════════ */}
        {phase === 'preview' && memory && geometry && (
          <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left: Shader canvas */}
            <div className="relative lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-10">
              <ShaderCanvas geometry={geometry} palette={palette} seed={memory.shaderSeed} className="absolute inset-0"/>
              {/* Overlay info */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div>
                  <div className="text-[9px] tracking-[3px] mb-1" style={{color: palette.accent}}>
                    {memory.ageTier} // WISDOM {memory.wisdomScore}/100
                  </div>
                  <div className="text-[9px] tracking-[2px] text-white/40">
                    EDITION OF {memory.editionSize} // 0.000369 ETH each
                  </div>
                </div>
                <div className="text-[9px] tracking-[2px] text-white/30 text-right">
                  SEED {memory.shaderSeed.toFixed(4)}<br/>
                  SEPOLIA TESTNET
                </div>
              </div>
            </div>

            {/* Right: Metadata + mint */}
            <div className="lg:w-1/2 p-8 lg:overflow-y-auto flex flex-col gap-6">

              {/* Title + essence */}
              <div className="border-l-2 pl-6" style={{borderColor: palette.primary}}>
                <div className="text-[9px] tracking-[4px] mb-2" style={{color: palette.accent}}>
                  {INTERACTION_LABELS[memory.interaction as InteractionType].label.toUpperCase()}
                </div>
                <h2 className="text-3xl tracking-[4px] mb-3" style={{color: palette.primary, textShadow:`0 0 20px ${palette.primary}80`}}>
                  {memory.crystallized.title}
                </h2>
                <p className="text-sm text-[#c8f0ec]/70 leading-relaxed italic">
                  {memory.crystallized.essence}
                </p>
              </div>

              {/* Haiku */}
              <div className="p-5 border border-[#ffffff]/08 bg-[#0a0a1a]">
                <div className="text-[9px] tracking-[4px] text-[#c8f0ec]/30 mb-3">// TEMPORAL HAIKU</div>
                {memory.crystallized.haiku.split('\n').map((line, i) => (
                  <div key={i} className="text-sm tracking-[2px] leading-loose" style={{color: i===1 ? palette.primary : palette.secondary}}>
                    {line}
                  </div>
                ))}
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2">
                {memory.crystallized.keywords.map(kw => (
                  <span key={kw} className="px-3 py-1 text-[9px] tracking-[3px] border" style={{borderColor:`${palette.primary}40`, color: palette.primary}}>
                    {kw.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* Edition info */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'TIER',     value: memory.ageTier },
                  { label: 'EDITION',  value: `× ${memory.editionSize}` },
                  { label: 'PRICE',    value: '0.000369 Ξ' },
                ].map(item => (
                  <div key={item.label} className="p-4 border border-[#ffffff]/08 text-center">
                    <div className="text-[8px] tracking-[3px] text-[#c8f0ec]/30 mb-1">{item.label}</div>
                    <div className="text-sm tracking-[2px]" style={{color: palette.primary}}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Geometry params */}
              <div className="p-4 border border-[#ffffff]/06 bg-[#0a0a1a]">
                <div className="text-[9px] tracking-[4px] text-[#c8f0ec]/30 mb-3">// SHADER PARAMS</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(geometry).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-[9px] tracking-[2px] text-[#c8f0ec]/40 uppercase">{key}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-[#ffffff]/10 rounded">
                          <div className="h-full rounded" style={{width:`${val*100}%`, background: palette.primary}}/>
                        </div>
                        <span className="text-[9px] text-[#c8f0ec]/50">{(val as number).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mint button */}
              <button
                onClick={mintEditions}
                className="w-full py-5 text-sm tracking-[6px] border transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,245,255,0.2)]"
                style={{
                  borderColor: palette.primary,
                  color: palette.primary,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${palette.primary}10`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                MINT {memory.editionSize} EDITIONS → AUCTION
              </button>

              <button onClick={() => { setPhase('input'); setMemory(null); }}
                className="text-[10px] tracking-[3px] text-[#c8f0ec]/30 hover:text-[#c8f0ec]/60 transition-colors text-center">
                ← DISSOLVE AND START AGAIN
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MINTING
        ══════════════════════════════════════════════════════ */}
        {phase === 'minting' && memory && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="text-3xl animate-spin" style={{color: palette.primary}}>∆</div>
            <div className="text-xs tracking-[6px]" style={{color: palette.primary}}>MINTING TO SEPOLIA</div>
            <div className="text-[10px] tracking-[3px] text-[#c8f0ec]/40">
              Creating {memory.editionSize} editions + auctions at 0.000369 ETH...
            </div>
            <div className="flex gap-2 mt-2">
              {Array.from({length: memory.editionSize}).map((_,i) => (
                <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{background: palette.accent, animationDelay:`${i*0.15}s`}}/>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            MINTED
        ══════════════════════════════════════════════════════ */}
        {phase === 'minted' && memory && (
          <div className="flex flex-col items-center justify-center min-h-screen px-6">
            <div className="w-full max-w-xl">
              <div className="text-center mb-8">
                <div className="text-3xl mb-4" style={{color: palette.primary, textShadow:`0 0 30px ${palette.primary}`}}>◈</div>
                <div className="text-xl tracking-[6px]" style={{color: palette.primary}}>CRYSTALLIZED ONCHAIN</div>
                <div className="text-[10px] tracking-[3px] text-[#c8f0ec]/40 mt-2">
                  {memory.crystallized.title}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {mintResults.map((r, i) => (
                  <div key={i} className={`p-4 border ${r.error ? 'border-red-500/30 bg-red-500/05' : 'border-[#00f5ff]/20 bg-[#0a0a1a]'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] tracking-[3px] text-[#c8f0ec]/50">EDITION {i+1}/{memory.editionSize}</span>
                      {r.error ? (
                        <span className="text-[9px] text-red-400">✗ FAILED</span>
                      ) : (
                        <span className="text-[9px]" style={{color: palette.primary}}>✓ MINTED + AUCTIONED</span>
                      )}
                    </div>
                    {r.error ? (
                      <div className="text-[9px] text-red-400/70">{r.error}</div>
                    ) : (
                      <div className="flex gap-4">
                        {r.sepoliaUrl && (
                          <a href={r.sepoliaUrl} target="_blank" rel="noopener noreferrer"
                            className="text-[9px] tracking-[2px] underline" style={{color: palette.accent}}>
                            ETHERSCAN ↗
                          </a>
                        )}
                        {r.rareUrl && (
                          <a href={r.rareUrl} target="_blank" rel="noopener noreferrer"
                            className="text-[9px] tracking-[2px] underline" style={{color: palette.primary}}>
                            RARE.XYZ ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button onClick={() => { setPhase('input'); setMemory(null); setMintResults([]); }}
                  className="flex-1 py-3 border border-[#00f5ff]/30 text-[#00f5ff] text-xs tracking-[4px] hover:bg-[#00f5ff]/08 transition-all">
                  NEW MEMORY
                </button>
                <button onClick={openCollection}
                  className="flex-1 py-3 border text-xs tracking-[4px] transition-all"
                  style={{borderColor:`${palette.primary}40`, color: palette.primary}}>
                  VIEW COLLECTION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            COLLECTION
        ══════════════════════════════════════════════════════ */}
        {phase === 'collection' && (
          <div className="px-6 py-16 max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <div className="text-[9px] tracking-[4px] text-[#ff6ef7] mb-1">// MEMORY ARCHIVE</div>
                <div className="text-2xl tracking-[6px] text-[#00f5ff]">THE COLLECTION</div>
              </div>
              <button onClick={() => setPhase('input')} className="text-[10px] tracking-[3px] text-[#c8f0ec]/40 hover:text-[#c8f0ec]/70 transition-colors">
                + NEW MEMORY
              </button>
            </div>

            {collection.length === 0 ? (
              <div className="text-center py-20 text-[#c8f0ec]/30 text-xs tracking-[4px]">
                NO MEMORIES CRYSTALLIZED YET
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collection.map(mem => {
                  const p = mem.crystallized.colorPalette;
                  return (
                    <button
                      key={mem.id}
                      onClick={() => { setMemory(mem); setPhase('preview'); }}
                      className="p-5 border text-left transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.1)]"
                      style={{borderColor:`${p.primary}20`, background:'#0a0a1a'}}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = `${p.primary}60`)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = `${p.primary}20`)}
                    >
                      {/* Mini shader preview bar */}
                      <div className="h-24 mb-4 relative overflow-hidden rounded-sm">
                        <ShaderCanvas geometry={mem.crystallized.geometryParams} palette={p} seed={mem.shaderSeed}/>
                      </div>
                      <div className="text-[8px] tracking-[3px] mb-1" style={{color: p.accent}}>{mem.ageTier}</div>
                      <div className="text-sm tracking-[2px] mb-1" style={{color: p.primary}}>{mem.crystallized.title}</div>
                      <div className="text-[9px] text-[#c8f0ec]/40 leading-relaxed line-clamp-2">{mem.crystallized.essence}</div>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-[8px] tracking-[2px]" style={{color: p.secondary}}>×{mem.editionSize}</span>
                        <span className="text-[8px] tracking-[2px] text-[#c8f0ec]/30">
                          {new Date(mem.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Status bar */}
      <div className="fixed bottom-0 left-0 right-0 h-7 bg-[#030308]/95 border-t border-[#00f5ff]/08 flex items-center px-6 gap-6 text-[8px] tracking-[2px] text-[#00f5ff]/30 z-50">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse shadow-[0_0_6px_#00f5ff]"/>
        <span>SEPOLIA TESTNET</span>
        <span>RARE PROTOCOL v0.1.1</span>
        <span>GEMINI 2.5</span>
        <span className="ml-auto">SYNTHESIS 2026 // LIVING SWARM</span>
      </div>
    </div>
  );
}
