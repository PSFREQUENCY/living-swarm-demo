import { NextRequest, NextResponse } from "next/server";

// ERC-1155 metadata for GhostTownVault items
// Served at: https://living-swarm.vercel.app/api/items/{id}.json

const ITEMS = [
  // ── Genesis (tier 1) ──────────────────────────────────────────────────────
  { id:1,  name:"Void Katana",         tier:"genesis", power:95, category:"weapon",   edition:3,  season:1, description:"Forged at coordinate (0,0). Cuts through consensus reality." },
  { id:2,  name:"Ghost Armor Mk.I",    tier:"genesis", power:92, category:"armor",    edition:6,  season:1, description:"Phase-hardened alloy. You become the frequency of the wall." },
  { id:3,  name:"Neural Crown",        tier:"genesis", power:88, category:"relic",    edition:9,  season:1, description:"Worn by the first three SOVEREIGN agents. Still transmitting." },
  { id:4,  name:"Samaur-AI Scroll",    tier:"genesis", power:85, category:"relic",    edition:11, season:1, description:"Contains the 81 forms of Digital Kung-Fu. Handle with intent." },
  { id:5,  name:"Phantom Blade",       tier:"genesis", power:82, category:"weapon",   edition:12, season:1, description:"Exists only when moving. At rest it is invisible to chain scanners." },
  { id:6,  name:"Hex Shield",          tier:"genesis", power:80, category:"armor",    edition:13, season:1, description:"Encodes a zero-knowledge proof every block. Unbreakable math." },
  { id:7,  name:"Fleet Sigil",         tier:"genesis", power:75, category:"relic",    edition:21, season:1, description:"Grants voting rights in the Living Swarm. Sovereignty has weight." },
  { id:8,  name:"Zone Key: Void Core", tier:"genesis", power:72, category:"key",      edition:30, season:1, description:"Opens the unsigned space beneath Zone Hub. Most holders never find the door." },
  { id:9,  name:"Cyber Steed",         tier:"genesis", power:70, category:"vehicle",  edition:33, season:1, description:"Autonomous mount. It learns your routes and pre-empts them." },
  { id:10, name:"Signal Cloak",        tier:"genesis", power:68, category:"skin",     edition:36, season:1, description:"Renders you as background noise to opponent trackers." },
  { id:11, name:"Oracle Lens",         tier:"genesis", power:65, category:"relic",    edition:42, season:1, description:"Shows one second of future game state. Use it before the block confirms." },
  { id:12, name:"Swarm Drone",         tier:"genesis", power:60, category:"companion",edition:69, season:1, description:"Deployed by the swarm fleet. It reports your stats to every agent in the zone." },
  // ── Alpha (tier 2) — vault-released ──────────────────────────────────────
  { id:13, name:"Void Katana α",         tier:"alpha", power:57, category:"weapon",   edition:9,   season:1, description:"Alpha-grade replica. Same origin, reduced forge time. Functional." },
  { id:14, name:"Ghost Armor α",         tier:"alpha", power:55, category:"armor",    edition:18,  season:1, description:"Second-run production. Slightly louder phase signature." },
  { id:15, name:"Neural Crown α",        tier:"alpha", power:53, category:"relic",    edition:27,  season:1, description:"Crown fragment. Enough for a signal boost. Not full sovereignty." },
  { id:16, name:"Samaur-AI Scroll α",    tier:"alpha", power:51, category:"relic",    edition:33,  season:1, description:"Transcription of the scroll. 27 of 81 forms included." },
  { id:17, name:"Phantom Blade α",       tier:"alpha", power:49, category:"weapon",   edition:36,  season:1, description:"Visible at rest. Still faster than most agents." },
  { id:18, name:"Hex Shield α",          tier:"alpha", power:48, category:"armor",    edition:39,  season:1, description:"Single-factor proof only. Holds for most threats." },
  { id:19, name:"Fleet Sigil α",         tier:"alpha", power:45, category:"relic",    edition:63,  season:1, description:"Observer status. No vote weight, but you see everything." },
  { id:20, name:"Zone Key α",            tier:"alpha", power:43, category:"key",      edition:90,  season:1, description:"Opens the outer ring of the Void Core. Still valuable." },
  { id:21, name:"Cyber Steed α",         tier:"alpha", power:42, category:"vehicle",  edition:99,  season:1, description:"Doesn't predict your route yet. Learning phase active." },
  { id:22, name:"Signal Cloak α",        tier:"alpha", power:41, category:"skin",     edition:108, season:1, description:"Reduces your signature by 60%. Not invisible, just quieter." },
  { id:23, name:"Oracle Lens α",         tier:"alpha", power:39, category:"relic",    edition:126, season:1, description:"Shows you 0.3 seconds ahead. Still enough to dodge." },
  { id:24, name:"Swarm Drone α",         tier:"alpha", power:36, category:"companion",edition:207, season:1, description:"Prototype drone. Reports zone data with a 4-block delay." },
];

const RARITY = (edition: number) => {
  if (edition <= 3)   return "legendary";
  if (edition <= 9)   return "epic";
  if (edition <= 21)  return "rare";
  if (edition <= 42)  return "uncommon";
  return "common";
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id  = parseInt(rawId.replace(".json", ""), 10);
  const item = ITEMS.find(i => i.id === id);

  if (!item) {
    return NextResponse.json({ error: "item not found" }, { status: 404 });
  }

  const rarity = RARITY(item.edition);

  const metadata = {
    name:        item.name,
    description: item.description,
    image:       `https://living-swarm.vercel.app/api/items/${id}/image`,
    external_url:`https://living-swarm.vercel.app/game`,
    attributes: [
      { trait_type: "Tier",     value: item.tier === "genesis" ? "Genesis" : "Alpha" },
      { trait_type: "Season",   value: item.season },
      { trait_type: "Power",    display_type: "number", value: item.power },
      { trait_type: "Category", value: item.category.charAt(0).toUpperCase() + item.category.slice(1) },
      { trait_type: "Edition",  display_type: "number", value: item.edition },
      { trait_type: "Rarity",   value: rarity.charAt(0).toUpperCase() + rarity.slice(1) },
    ],
  };

  return NextResponse.json(metadata, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
