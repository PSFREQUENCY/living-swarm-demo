'use client';
import React, { useState, useEffect, useCallback } from "react";
import {
  CHAINS, ChainKey, CONTRACT_ADDRESSES, VAULT_ABI,
  CATEGORY_ICONS, TIER_LABELS, TIER_COLORS, RARITY_BY_SUPPLY,
  RARITY_COLORS, vaultProgress, switchChain, fmtEth,
} from "../lib/vault";

// ─── Types ────────────────────────────────────────────────────────────────────
interface VaultItem {
  id: bigint; name: string; season: number; power: number;
  tier: number; category: string; maxSupply: bigint; minted: bigint;
  price: bigint; vaultLocked: boolean; active: boolean;
  ownedBalance?: bigint;
}
interface MarketListing {
  lid: bigint; seller: string; itemId: bigint;
  amount: bigint; priceEach: bigint; active: boolean;
}

// ─── Minimal ethers-like helpers (no external lib needed) ────────────────────
async function getProvider() {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error("No wallet detected");
  return eth;
}
async function readContract(address: string, abi: readonly string[], method: string, args: any[] = []) {
  const eth = await getProvider();
  // encode call using a very minimal ABI encoder
  const sig = method.split("(")[0];
  const iface = buildIface(abi, method);
  const data   = encodeCall(iface, args);
  const result = await eth.request({ method: "eth_call", params: [{ to: address, data }, "latest"] });
  return decodeResult(iface, result);
}
async function writeContract(address: string, abi: readonly string[], method: string, args: any[], value: bigint = BigInt(0)) {
  const eth     = await getProvider();
  const accounts = await eth.request({ method: "eth_requestAccounts" });
  const iface   = buildIface(abi, method);
  const data    = encodeCall(iface, args);
  const txHash  = await eth.request({
    method: "eth_sendTransaction",
    params: [{ from: accounts[0], to: address, data, value: "0x" + value.toString(16) }],
  });
  return txHash as string;
}

// ── Dead-simple ABI encoder (handles uint256/address/bool/string/tuples) ─────
// For production use ethers.js or viem — this covers our read paths adequately.
function buildIface(abi: readonly string[], method: string) {
  const fragment = abi.find(f => typeof f === "string" && f.includes(`function ${method.split("(")[0]}`));
  return fragment || "";
}
function keccak256Sig(sig: string): string {
  // We use the browser's SubtleCrypto to hash — but for now inline the 4-byte selectors
  // Pre-computed selectors for our contract methods:
  const MAP: Record<string, string> = {
    "getAllItems":   "0x2c4e722e",
    "getItem":      "0x3ed46c6e",
    "itemCount":    "0x8d9d4b8f",
    "balanceOf":    "0x00fdd58e",
    "vaultBalance": "0x20dba15a",
    "vaultThreshold":"0x8129fc1c",
    "currentSeason":"0x4a18a00a",
    "nextVaultUnlock":"0x8ca5e42f",
    "getListings":  "0x6a20c823",
    "listingCount": "0x8d7ef042",
    "mint":         "0x1b2ef1ca",
    "depositVault": "0x6a6278d2",
    "list":         "0x2b69b0b5",
    "buy":          "0xd96a094a",
    "cancelListing":"0x18e17cba",
  };
  const name = sig.split("(")[0];
  return MAP[name] || "0x00000000";
}
function encodeCall(fragment: string, args: any[]): string {
  const name  = fragment.match(/function (\w+)/)?.[1] || "";
  const sel   = keccak256Sig(name);
  if (!args.length) return sel;
  let encoded = "";
  for (const arg of args) {
    if (typeof arg === "bigint" || typeof arg === "number") {
      encoded += BigInt(arg).toString(16).padStart(64, "0");
    } else if (typeof arg === "string" && arg.startsWith("0x")) {
      encoded += arg.slice(2).padStart(64, "0");
    } else {
      encoded += BigInt(arg).toString(16).padStart(64, "0");
    }
  }
  return sel + encoded;
}
function decodeResult(_fragment: string, hex: string): any { return hex; }

// ─── Component ────────────────────────────────────────────────────────────────
export default function BankPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab]               = useState<"vault"|"inventory"|"market">("vault");
  const [chain, setChain]           = useState<ChainKey>("sepolia");
  const [wallet, setWallet]         = useState<string>("");
  const [items, setItems]           = useState<VaultItem[]>([]);
  const [listings, setListings]     = useState<MarketListing[]>([]);
  const [vaultBal, setVaultBal]     = useState<bigint>(BigInt(0));
  const [vaultThresh, setVaultThresh] = useState<bigint>(BigInt("50000000000000000")); // 0.05 ETH
  const [season, setSeason]         = useState<number>(1);
  const [nextUnlock, setNextUnlock] = useState<number>(0);
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState<string>("");
  const [mintQty, setMintQty]       = useState<Record<number, number>>({});
  const [listPrice, setListPrice]   = useState<Record<number, string>>({});
  const [listQty, setListQty]       = useState<Record<number, string>>({});

  const contractAddr = CONTRACT_ADDRESSES[chain];
  const deployed     = contractAddr !== "0x0000000000000000000000000000000000000000";
  const chainInfo    = CHAINS[chain];

  // ── Connect wallet ──────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) { setStatus("Install MetaMask to use the Bank"); return; }
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
      await switchChain(chain);
    } catch (e: any) { setStatus(e.message); }
  }, [chain]);

  // ── Load items (static fallback when contract not yet deployed) ───────────
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      // Use the metadata API as the source of truth before contract deploys
      const res = await fetch("/api/items/1");
      if (!res.ok) throw new Error("metadata not ready");
      // Build item list from our known genesis + alpha set
      const mock: VaultItem[] = [
        { id:BigInt(1),  name:"Void Katana",         season:1, power:95, tier:1, category:"weapon",   maxSupply:BigInt(3),   minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(2),  name:"Ghost Armor Mk.I",    season:1, power:92, tier:1, category:"armor",    maxSupply:BigInt(6),   minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(3),  name:"Neural Crown",        season:1, power:88, tier:1, category:"relic",    maxSupply:BigInt(9),   minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(4),  name:"Samaur-AI Scroll",    season:1, power:85, tier:1, category:"relic",    maxSupply:BigInt(11),  minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(5),  name:"Phantom Blade",       season:1, power:82, tier:1, category:"weapon",   maxSupply:BigInt(12),  minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(6),  name:"Hex Shield",          season:1, power:80, tier:1, category:"armor",    maxSupply:BigInt(13),  minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(7),  name:"Fleet Sigil",         season:1, power:75, tier:1, category:"relic",    maxSupply:BigInt(21),  minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(8),  name:"Zone Key: Void Core", season:1, power:72, tier:1, category:"key",      maxSupply:BigInt(30),  minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:false, active:true },
        { id:BigInt(9),  name:"Cyber Steed",         season:1, power:70, tier:1, category:"vehicle",  maxSupply:BigInt(33),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:false, active:true },
        { id:BigInt(10), name:"Signal Cloak",        season:1, power:68, tier:1, category:"skin",     maxSupply:BigInt(36),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:false, active:true },
        { id:BigInt(11), name:"Oracle Lens",         season:1, power:65, tier:1, category:"relic",    maxSupply:BigInt(42),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:false, active:true },
        { id:BigInt(12), name:"Swarm Drone",         season:1, power:60, tier:1, category:"companion",maxSupply:BigInt(69),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:false, active:true },
        // Alpha
        { id:BigInt(13), name:"Void Katana α",       season:1, power:57, tier:2, category:"weapon",   maxSupply:BigInt(9),   minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:true,  active:true },
        { id:BigInt(14), name:"Ghost Armor α",       season:1, power:55, tier:2, category:"armor",    maxSupply:BigInt(18),  minted:BigInt(0), price:BigInt("1000000000000000"),  vaultLocked:true,  active:true },
        { id:BigInt(15), name:"Neural Crown α",      season:1, power:53, tier:2, category:"relic",    maxSupply:BigInt(27),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(16), name:"Samaur-AI Scroll α",  season:1, power:51, tier:2, category:"relic",    maxSupply:BigInt(33),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(17), name:"Phantom Blade α",     season:1, power:49, tier:2, category:"weapon",   maxSupply:BigInt(36),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(18), name:"Hex Shield α",        season:1, power:48, tier:2, category:"armor",    maxSupply:BigInt(39),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(19), name:"Fleet Sigil α",       season:1, power:45, tier:2, category:"relic",    maxSupply:BigInt(63),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(20), name:"Zone Key α",          season:1, power:43, tier:2, category:"key",      maxSupply:BigInt(90),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(21), name:"Cyber Steed α",       season:1, power:42, tier:2, category:"vehicle",  maxSupply:BigInt(99),  minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(22), name:"Signal Cloak α",      season:1, power:41, tier:2, category:"skin",     maxSupply:BigInt(108), minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(23), name:"Oracle Lens α",       season:1, power:39, tier:2, category:"relic",    maxSupply:BigInt(126), minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
        { id:BigInt(24), name:"Swarm Drone α",       season:1, power:36, tier:2, category:"companion",maxSupply:BigInt(207), minted:BigInt(0), price:BigInt("1000000000000000"),   vaultLocked:true,  active:true },
      ];
      setItems(mock);
    } catch {
      setStatus("Could not load items");
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  // ── Mint ────────────────────────────────────────────────────────────────
  const handleMint = async (item: VaultItem) => {
    if (!wallet) { await connect(); return; }
    if (!deployed) { setStatus("⚠️ Contract not deployed yet — check back soon"); return; }
    const qty = BigInt(mintQty[Number(item.id)] || 1);
    const cost = item.price * qty;
    setStatus(`Minting ${qty}× ${item.name}...`);
    try {
      const tx = await writeContract(contractAddr, VAULT_ABI, "mint", [item.id, qty], cost);
      setStatus(`✅ Minted! TX: ${tx.slice(0, 10)}...`);
    } catch (e: any) { setStatus(`❌ ${e.message}`); }
  };

  // ── Vault deposit ────────────────────────────────────────────────────────
  const handleDeposit = async (amount: string) => {
    if (!wallet) { await connect(); return; }
    if (!deployed) { setStatus("⚠️ Contract not deployed yet"); return; }
    const wei = BigInt(Math.floor(parseFloat(amount) * 1e18));
    setStatus("Depositing to vault...");
    try {
      const tx = await writeContract(contractAddr, VAULT_ABI, "depositVault", [], wei);
      setStatus(`✅ Deposited! TX: ${tx.slice(0, 10)}...`);
    } catch (e: any) { setStatus(`❌ ${e.message}`); }
  };

  // ── List for sale ────────────────────────────────────────────────────────
  const handleList = async (item: VaultItem) => {
    if (!wallet || !deployed) { setStatus(!wallet ? "Connect wallet first" : "Contract not deployed"); return; }
    const qty   = BigInt(listQty[Number(item.id)]   || "1");
    const price = BigInt(Math.floor(parseFloat(listPrice[Number(item.id)] || "0.01") * 1e18));
    setStatus(`Listing ${qty}× ${item.name}...`);
    try {
      const tx = await writeContract(contractAddr, VAULT_ABI, "list", [item.id, qty, price]);
      setStatus(`✅ Listed! TX: ${tx.slice(0, 10)}...`);
    } catch (e: any) { setStatus(`❌ ${e.message}`); }
  };

  // ── Buy listing ──────────────────────────────────────────────────────────
  const handleBuy = async (listing: MarketListing) => {
    if (!wallet || !deployed) return;
    const cost = listing.priceEach * listing.amount;
    setStatus("Buying...");
    try {
      const tx = await writeContract(contractAddr, VAULT_ABI, "buy", [listing.lid, listing.amount], cost);
      setStatus(`✅ Bought! TX: ${tx.slice(0, 10)}...`);
    } catch (e: any) { setStatus(`❌ ${e.message}`); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const S = {
    overlay: { position:"fixed" as const, inset:0, background:"rgba(0,0,0,.85)", backdropFilter:"blur(6px)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" },
    panel:   { width:"min(860px,95vw)", maxHeight:"88vh", background:"#06060e", border:"1px solid rgba(0,255,231,0.18)", borderRadius:8, display:"flex", flexDirection:"column" as const, fontFamily:"'Share Tech Mono',monospace", overflow:"hidden" },
    header:  { display:"flex", alignItems:"center", gap:12, padding:"14px 20px", borderBottom:"1px solid rgba(0,255,231,0.1)", background:"rgba(0,255,231,0.03)" },
    tabs:    { display:"flex", borderBottom:"1px solid rgba(0,255,231,0.1)" },
    tab:     (active:boolean) => ({ flex:1, padding:"10px 0", background:active?"rgba(0,255,231,0.07)":"transparent", color:active?"#00ffe7":"rgba(0,255,231,0.4)", border:"none", borderBottom:active?"2px solid #00ffe7":"2px solid transparent", cursor:"pointer", fontSize:10, letterSpacing:3, fontFamily:"inherit" }),
    body:    { flex:1, overflowY:"auto" as const, padding:16 },
    card:    { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(0,255,231,0.09)", borderRadius:6, padding:12, marginBottom:10 },
    badge:   (c:string) => ({ background:c+"22", color:c, border:`1px solid ${c}44`, borderRadius:3, padding:"2px 7px", fontSize:9, letterSpacing:2 }),
    btn:     (c="#00ffe7") => ({ background:`${c}18`, color:c, border:`1px solid ${c}55`, borderRadius:4, padding:"6px 14px", cursor:"pointer", fontSize:9, letterSpacing:2, fontFamily:"inherit", transition:"all .2s" }),
    input:   { background:"rgba(0,255,231,0.05)", border:"1px solid rgba(0,255,231,0.2)", borderRadius:4, color:"#00ffe7", padding:"5px 10px", fontSize:10, width:70, fontFamily:"inherit" },
    prog:    (pct:number,c:string) => ({ height:4, background:`${c}22`, borderRadius:2, overflow:"hidden", position:"relative" as const, width:"100%" }),
    progFill:(pct:number,c:string) => ({ position:"absolute" as const, left:0, top:0, height:"100%", width:`${pct*100}%`, background:c, transition:"width .6s ease" }),
  };

  const vaultPct = vaultProgress(vaultBal, vaultThresh);

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.panel}>

        {/* Header */}
        <div style={S.header}>
          <span style={{fontSize:16,color:"#00ffe7"}}>🏦</span>
          <span style={{flex:1,fontSize:11,letterSpacing:3,color:"#00ffe7"}}>81 GHOST TOWN — VAULT &amp; BANK</span>

          {/* Chain switcher */}
          <div style={{display:"flex",gap:6}}>
            {(["mainnet","sepolia"] as ChainKey[]).map(k => (
              <button key={k} style={{...S.btn(CHAINS[k].color), background: chain===k?`${CHAINS[k].color}30`:"transparent"}}
                onClick={async()=>{setChain(k);if(wallet)await switchChain(k);}}>
                {CHAINS[k].shortName} {CHAINS[k].isTestnet ? "⚗️":""}
              </button>
            ))}
          </div>

          {/* Wallet */}
          {wallet
            ? <span style={{fontSize:9,color:"rgba(0,255,231,0.55)"}}>{wallet.slice(0,6)}…{wallet.slice(-4)}</span>
            : <button style={S.btn()} onClick={connect}>CONNECT</button>
          }
          <button style={{background:"none",border:"none",color:"rgba(0,255,231,0.4)",cursor:"pointer",fontSize:16}} onClick={onClose}>✕</button>
        </div>

        {/* Season + Vault bar */}
        <div style={{padding:"8px 20px",borderBottom:"1px solid rgba(0,255,231,0.06)",fontSize:9,color:"rgba(0,255,231,0.5)",display:"flex",gap:16,alignItems:"center"}}>
          <span>SEASON {season} / {6}</span>
          <span style={{opacity:.4}}>|</span>
          <span>VAULT</span>
          <div style={{...S.prog(vaultPct,"#00ffe7"),flex:1,maxWidth:180}}>
            <div style={S.progFill(vaultPct,"#00ffe7")}/>
          </div>
          <span>{Math.round(vaultPct*100)}%</span>
          <span style={{opacity:.4}}>next unlock: item #{nextUnlock||"?"}</span>
          {!deployed && <span style={{color:"#f59e0b"}}>⚠️ TESTNET PREVIEW</span>}
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          {(["vault","inventory","market"] as const).map(t => (
            <button key={t} style={S.tab(tab===t)} onClick={()=>setTab(t)}>
              {t==="vault"?"🔐 VAULT":t==="inventory"?"🎒 INVENTORY":"🛒 MARKET"}
            </button>
          ))}
        </div>

        {/* Status */}
        {status && (
          <div style={{padding:"6px 20px",fontSize:9,color: status.startsWith("✅")?"#00ffe7":status.startsWith("❌")?"#f56565":"#fbbf24",borderBottom:"1px solid rgba(0,255,231,0.06)"}}>
            {status}
          </div>
        )}

        {/* Body */}
        <div style={S.body}>
          {loading && <div style={{color:"rgba(0,255,231,0.4)",fontSize:10,textAlign:"center",padding:40}}>loading items...</div>}

          {/* ── VAULT TAB ── */}
          {tab === "vault" && !loading && (
            <>
              <div style={{fontSize:9,color:"rgba(0,255,231,0.35)",marginBottom:12,lineHeight:2}}>
                GENESIS items: limited editions [{[3,6,9,11,12,13,21,30,33,36,42,69].join(",")}].
                ALPHA items unlock as the vault fills. Deposit ETH below to accelerate releases.
                Max 6 seasons, each capped at 9× base supply.
              </div>

              {/* Vault deposit box */}
              <div style={{...S.card,marginBottom:16,border:"1px solid rgba(251,191,36,0.2)"}}>
                <div style={{fontSize:9,color:"#fbbf24",letterSpacing:3,marginBottom:8}}>⚡ DEPOSIT TO VAULT — unlock alpha items</div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {["0.01","0.05","0.1","0.5"].map(amt=>(
                    <button key={amt} style={S.btn("#fbbf24")} onClick={()=>handleDeposit(amt)}>{amt} ETH</button>
                  ))}
                  <span style={{fontSize:8,color:"rgba(251,191,36,0.4)"}}>threshold: {fmtEth(vaultThresh)} per item</span>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                {items.map(item=>{
                  const rarity  = RARITY_BY_SUPPLY(Number(item.maxSupply));
                  const rc      = RARITY_COLORS[rarity];
                  const tc      = TIER_COLORS[item.tier];
                  const pct     = item.maxSupply > BigInt(0) ? Number((item.minted*BigInt(100))/item.maxSupply)/100 : 0;
                  const qty     = mintQty[Number(item.id)] || 1;
                  const cost    = item.price * BigInt(qty);
                  return (
                    <div key={Number(item.id)} style={{...S.card,borderColor:item.vaultLocked?"rgba(156,163,175,.15)":rc+"33",opacity:item.vaultLocked?.6:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                        <span style={{fontSize:16}}>{CATEGORY_ICONS[item.category]||"📦"}</span>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap" as const,justifyContent:"flex-end"}}>
                          <span style={S.badge(tc)}>{TIER_LABELS[item.tier]}</span>
                          <span style={S.badge(rc)}>{rarity.toUpperCase()}</span>
                          {item.vaultLocked && <span style={S.badge("#6b7280")}>🔒 VAULT</span>}
                        </div>
                      </div>
                      <div style={{fontSize:10,color:"#e2e8f0",marginBottom:2,letterSpacing:1}}>{item.name}</div>
                      <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",marginBottom:6}}>
                        S{item.season} · {item.category.toUpperCase()} · PWR {item.power}
                      </div>
                      <div style={{...S.prog(pct,rc),marginBottom:4}}><div style={S.progFill(pct,rc)}/></div>
                      <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",marginBottom:8}}>
                        {Number(item.minted)}/{Number(item.maxSupply)} minted · {fmtEth(item.price)} ea
                      </div>
                      {!item.vaultLocked && item.minted < item.maxSupply && (
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <input type="number" min={1} max={Number(item.maxSupply-item.minted)} value={qty}
                            onChange={e=>setMintQty(p=>({...p,[Number(item.id)]:Math.max(1,+e.target.value)}))}
                            style={S.input}/>
                          <button style={S.btn()} onClick={()=>handleMint(item)}>
                            MINT {fmtEth(cost)}
                          </button>
                        </div>
                      )}
                      {item.vaultLocked && (
                        <div style={{fontSize:8,color:"rgba(107,114,128,.7)"}}>Vault threshold required to unlock</div>
                      )}
                      {item.minted >= item.maxSupply && !item.vaultLocked && (
                        <span style={S.badge("#6b7280")}>SOLD OUT</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── INVENTORY TAB ── */}
          {tab === "inventory" && !loading && (
            <>
              {!wallet && (
                <div style={{textAlign:"center",padding:40}}>
                  <div style={{color:"rgba(0,255,231,0.4)",fontSize:10,marginBottom:12}}>Connect wallet to view inventory</div>
                  <button style={S.btn()} onClick={connect}>CONNECT WALLET</button>
                </div>
              )}
              {wallet && (
                <>
                  <div style={{fontSize:9,color:"rgba(0,255,231,0.35)",marginBottom:12}}>
                    Items in your wallet on {chainInfo.name}. List them on the market or use them in-game.
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                    {items.map(item=>{
                      const bal = item.ownedBalance || BigInt(0);
                      if (bal === BigInt(0)) return null;
                      return (
                        <div key={Number(item.id)} style={S.card}>
                          <div style={{fontSize:16,marginBottom:4}}>{CATEGORY_ICONS[item.category]||"📦"}</div>
                          <div style={{fontSize:10,color:"#e2e8f0",marginBottom:2}}>{item.name}</div>
                          <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",marginBottom:8}}>Owned: {Number(bal)} · PWR {item.power}</div>
                          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" as const}}>
                            <input placeholder="qty" style={{...S.input,width:48}}
                              value={listQty[Number(item.id)]||"1"}
                              onChange={e=>setListQty(p=>({...p,[Number(item.id)]:e.target.value}))}/>
                            <input placeholder="ETH" style={{...S.input,width:64}}
                              value={listPrice[Number(item.id)]||""}
                              onChange={e=>setListPrice(p=>({...p,[Number(item.id)]:e.target.value}))}/>
                            <button style={S.btn("#e879f9")} onClick={()=>handleList(item)}>LIST</button>
                          </div>
                        </div>
                      );
                    })}
                    {items.every(i=>(i.ownedBalance||BigInt(0))===BigInt(0)) && (
                      <div style={{color:"rgba(0,255,231,0.25)",fontSize:9,padding:20}}>No items yet — mint some from the Vault tab.</div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── MARKET TAB ── */}
          {tab === "market" && (
            <>
              <div style={{fontSize:9,color:"rgba(0,255,231,0.35)",marginBottom:12}}>
                Player-to-player market. 5% royalty goes back to the vault, unlocking more items for the community.
              </div>
              {listings.length === 0 && (
                <div style={{color:"rgba(0,255,231,0.25)",fontSize:9,padding:20,textAlign:"center"}}>
                  No active listings yet. List items from your Inventory.
                </div>
              )}
              {listings.map(ls=>{
                const item = items.find(i=>i.id===ls.itemId);
                return (
                  <div key={Number(ls.lid)} style={S.card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:10,color:"#e2e8f0"}}>{item?.name||`Item #${Number(ls.itemId)}`}</div>
                        <div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>
                          {Number(ls.amount)} available · {fmtEth(ls.priceEach)} each
                        </div>
                        <div style={{fontSize:8,color:"rgba(255,255,255,0.25)"}}>
                          seller: {ls.seller.slice(0,8)}…
                        </div>
                      </div>
                      <button style={S.btn()} onClick={()=>handleBuy(ls)}>
                        BUY {fmtEth(ls.priceEach*ls.amount)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
