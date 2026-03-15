// Gap 4 — Onchain arbiter attestation via ArbitersLedger.sol (Sepolia)
// Fire-and-forget: never blocks the quote response

import { ethers } from 'ethers';

const ABI = [
  'function logScore(bytes32 inputHash, uint8 score, bytes1 band) external',
  'event ScoreLogged(bytes32 indexed inputHash, uint8 score, bytes1 band, address indexed arbiter, uint256 timestamp)',
];

let _contract: ethers.Contract | null = null;

function getContract(): ethers.Contract | null {
  const rpc = process.env.SEPOLIA_RPC_URL;
  const key = process.env.SWAPPER_KEY;
  const addr = process.env.ARBITER_LEDGER_ADDRESS;
  if (!rpc || !key || !addr) return null;
  if (!_contract) {
    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(key, provider);
    _contract = new ethers.Contract(addr, ABI, wallet);
  }
  return _contract;
}

/** Fire-and-forget: log an arbiter score onchain. Never throws. */
export function attestScore(
  inputHash: string,
  score: number,
  band: 'P' | 'L' | 'H' | 'B'
): void {
  const contract = getContract();
  if (!contract) return;

  const hash32 = ethers.zeroPadValue(
    ethers.hexlify(ethers.toUtf8Bytes(inputHash)).slice(0, 66),
    32
  );
  const bandByte = ethers.hexlify(new TextEncoder().encode(band)) as `0x${string}`;

  contract.logScore(hash32, score, bandByte).catch((e: unknown) => {
    console.error('[arbiter-ledger] attestScore failed:', e);
  });
}
