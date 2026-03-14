// ═══════════════════════════════════════════════════════════════
// ROYAL LOGS — /api/mint
// Mints a crystallized memory as ERC-721 edition via Rare CLI
// ═══════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { memory, editionIndex } = await req.json();
    const contractAddress = process.env.RARE_CONTRACT_ADDRESS;

    if (!contractAddress) {
      return NextResponse.json({ error: 'RARE_CONTRACT_ADDRESS not configured. Run deploy first.' }, { status: 500 });
    }

    const { crystallized, id, ageTier, interaction, wisdomScore, editionSize, shaderSeed } = memory;

    // Build metadata JSON for IPFS
    const tokenName = `${crystallized.title} #${editionIndex + 1}/${editionSize}`;
    const metadata = {
      name: tokenName,
      description: crystallized.essence,
      attributes: [
        { trait_type: 'Age Tier',         value: ageTier },
        { trait_type: 'Interaction',       value: interaction.replace('_',' ') },
        { trait_type: 'Wisdom Score',      value: wisdomScore },
        { trait_type: 'Edition Size',      value: editionSize },
        { trait_type: 'Edition Number',    value: editionIndex + 1 },
        { trait_type: 'Haiku',             value: crystallized.haiku },
        { trait_type: 'Keywords',          value: crystallized.keywords.join(', ') },
        { trait_type: 'Shader Seed',       value: shaderSeed.toFixed(6) },
      ],
      external_url: `${process.env.NEXT_PUBLIC_BASE_URL}/log/${id}`,
    };

    // Write temp metadata file
    const metaDir = path.join(process.cwd(), 'public', 'metadata');
    mkdirSync(metaDir, { recursive: true });
    const metaPath = path.join(metaDir, `${id}_${editionIndex}.json`);
    writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

    // Mint via Rare CLI
    const mintCmd = [
      'rare mint',
      `--contract ${contractAddress}`,
      `--name "${tokenName.replace(/"/g, '\\"')}"`,
      `--description "${crystallized.essence.replace(/"/g, '\\"')}"`,
      `--chain sepolia`,
      `--tag royal-logs`,
      `--tag ${ageTier.toLowerCase()}`,
      `--tag ${interaction}`,
      `--attribute "AgeTier=${ageTier}"`,
      `--attribute "WisdomScore=${wisdomScore}"`,
      `--attribute "EditionSize=${editionSize}"`,
      `--attribute "InteractionType=${interaction}"`,
    ].join(' ');

    let tokenId: number | null = null;
    let txHash = '';

    try {
      const result = execSync(mintCmd, { timeout: 60000, encoding: 'utf8' });
      // Parse token ID from CLI output
      const tokenMatch = result.match(/token[_\s]?id[:\s]+(\d+)/i) ||
                         result.match(/minted[:\s]+(\d+)/i) ||
                         result.match(/#(\d+)/);
      tokenId = tokenMatch ? parseInt(tokenMatch[1]) : null;
      const txMatch = result.match(/0x[a-fA-F0-9]{64}/);
      txHash = txMatch ? txMatch[0] : '';
    } catch (cliErr: any) {
      return NextResponse.json({
        error: 'Rare CLI mint failed',
        details: cliErr.message,
        cmd: mintCmd,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tokenId,
      txHash,
      tokenName,
      contractAddress,
      sepoliaUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
      rareUrl: `https://rare.xyz/token/${contractAddress}/${tokenId}`,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
