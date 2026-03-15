// Deploy ArbitersLedger.sol to Sepolia
// Usage: node scripts/deploy-arbiter.mjs

import { ethers } from 'ethers';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .trim().split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

// Compiled bytecode of ArbitersLedger.sol (via solc 0.8.24 optimizer=200)
// Recompile via: solc --bin --abi contracts/ArbitersLedger.sol
const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"inputHash","type":"bytes32"},{"indexed":false,"internalType":"uint8","name":"score","type":"uint8"},{"indexed":false,"internalType":"bytes1","name":"band","type":"bytes1"},{"indexed":true,"internalType":"address","name":"arbiter","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ScoreLogged","type":"event"},{"inputs":[{"internalType":"bytes32","name":"inputHash","type":"bytes32"},{"internalType":"uint8","name":"score","type":"uint8"},{"internalType":"bytes1","name":"band","type":"bytes1"}],"name":"logScore","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const BYTECODE = '0x6080604052348015600e575f5ffd5b506103138061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610029575f3560e01c8063e45ed0f21461002d575b5f5ffd5b610047600480360381019061004291906101aa565b610049565b005b60648260ff161115610090576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161008790610254565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16837f5b0eb433684542cbf09fa61b7a043b4bed5640e0af259415c2f82f09f0dfd8348484426040516100db939291906102a8565b60405180910390a3505050565b5f5ffd5b5f819050919050565b6100fe816100ec565b8114610108575f5ffd5b50565b5f81359050610119816100f5565b92915050565b5f60ff82169050919050565b6101348161011f565b811461013e575f5ffd5b50565b5f8135905061014f8161012b565b92915050565b5f7fff0000000000000000000000000000000000000000000000000000000000000082169050919050565b61018981610155565b8114610193575f5ffd5b50565b5f813590506101a481610180565b92915050565b5f5f5f606084860312156101c1576101c06100e8565b5b5f6101ce8682870161010b565b93505060206101df86828701610141565b92505060406101f086828701610196565b9150509250925092565b5f82825260208201905092915050565b7f73636f7265206f7574206f662072616e676500000000000000000000000000005f82015250565b5f61023e6012836101fa565b91506102498261020a565b602082019050919050565b5f6020820190508181035f83015261026b81610232565b9050919050565b61027b8161011f565b82525050565b61028a81610155565b82525050565b5f819050919050565b6102a281610290565b82525050565b5f6060820190506102bb5f830186610272565b6102c86020830185610281565b6102d56040830184610299565b94935050505056fea2646970667358221220f6f2f02fb062c9beca97c009c4d173466d4aaf3f81a2f852f6555c94ea265f3064736f6c63430008220033';

const provider = new ethers.JsonRpcProvider(env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(env.SWAPPER_KEY, provider);

console.log('Deploying ArbitersLedger to Sepolia...');
console.log('Deployer:', wallet.address);

const factory = new ethers.ContractFactory(ABI, BYTECODE, wallet);
const contract = await factory.deploy();
console.log('Tx hash:', contract.deploymentTransaction()?.hash);
await contract.waitForDeployment();
const address = await contract.getAddress();
console.log('\n✓ ArbitersLedger deployed at:', address);
console.log('\nAdd to .env.local:');
console.log(`ARBITER_LEDGER_ADDRESS=${address}`);
console.log('\nVerify on Etherscan:');
console.log(`https://sepolia.etherscan.io/address/${address}`);
