import { ethers } from 'ethers';

import { readFileSync } from 'fs';
const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8').trim().split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return[l.slice(0,i),l.slice(i+1)];}));
const PRIVATE_KEY = env.SWAPPER_KEY;
const RPC_URL     = 'https://eth-sepolia.g.alchemy.com/v2/ALCHEMY_KEY_REDACTED';
const API_BASE    = 'https://living-swarm-demo.vercel.app';
const CHAIN_ID    = 11155111;
const SWAPPER     = '0x054C9189dE85c3D6E74614F1659867362FC74B1e';

// Sepolia token addresses
const ETH  = '0x0000000000000000000000000000000000000000';
const WETH = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
const USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

const AMOUNT = ethers.parseEther('0.001').toString(); // 0.001 ETH in wei

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);

async function quote(tokenIn, tokenOut) {
  const res = await fetch(`${API_BASE}/api/uniswap/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'EXACT_INPUT', amount: AMOUNT,
      tokenIn, tokenOut,
      tokenInChainId: CHAIN_ID, tokenOutChainId: CHAIN_ID,
      swapper: SWAPPER, routingPreference: 'BEST_PRICE',
      autoSlippage: 'DEFAULT', urgency: 'urgent',
    }),
  });
  const d = await res.json();
  if (!res.ok || d.error) throw new Error('Quote failed: ' + JSON.stringify(d));
  console.log(`  quote: ${d.routingName || d.routing}, arbiter: ${d.arbiter?.verdict?.band}`);
  return d;
}

async function swap(quoteData) {
  const res = await fetch(`${API_BASE}/api/uniswap/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quote: quoteData.quote, urgency: 'urgent' }),
  });
  const d = await res.json();
  if (!res.ok || d.error) throw new Error('Swap build failed: ' + JSON.stringify(d));
  return d.swap || d;
}

async function execute(label, tokenIn, tokenOut) {
  console.log(`\n── ${label} ──`);

  console.log('  getting quote...');
  const quoteData = await quote(tokenIn, tokenOut);

  console.log('  building swap tx...');
  const tx = await swap(quoteData);
  if (!tx?.to) throw new Error('No tx data returned: ' + JSON.stringify(tx));
  console.log(`  to: ${tx.to}`);

  console.log('  sending transaction...');
  const sent = await wallet.sendTransaction({
    to:       tx.to,
    value:    tx.value   ? BigInt(tx.value)   : 0n,
    data:     tx.data,
    gasLimit: tx.gasLimit ? BigInt(tx.gasLimit) : undefined,
  });
  console.log(`  tx hash: ${sent.hash}`);
  console.log(`  waiting for confirmation...`);
  const receipt = await sent.wait();
  console.log(`  ✓ confirmed in block ${receipt.blockNumber} (status: ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'})`);
  console.log(`  https://sepolia.etherscan.io/tx/${sent.hash}`);
  return sent.hash;
}

// Verify wallet address matches
console.log(`wallet: ${wallet.address}`);
if (wallet.address.toLowerCase() !== SWAPPER.toLowerCase()) {
  console.error(`ERROR: wallet ${wallet.address} !== expected ${SWAPPER}`);
  process.exit(1);
}

const bal = await provider.getBalance(wallet.address);
console.log(`balance: ${ethers.formatEther(bal)} ETH`);

await execute('0.001 ETH → WETH', ETH, WETH);
await execute('0.001 ETH → USDC', ETH, USDC);

console.log('\n✓ both trades complete');
