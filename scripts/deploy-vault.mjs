// deploy-vault.mjs — compiles + deploys GhostTownVault.sol to Sepolia
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const require  = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load env ─────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, "../.env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const [k,...v] = l.split("="); return [k.trim(), v.join("=").trim()]; })
);

const RPC_URL     = env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = env.RARE_PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
  console.error("Missing SEPOLIA_RPC_URL or RARE_PRIVATE_KEY in .env.local");
  process.exit(1);
}

// ── Compile ───────────────────────────────────────────────────────────────────
console.log("Compiling GhostTownVault.sol...");
const solc = require("solc");

const source = readFileSync(
  path.join(__dirname, "../contracts/GhostTownVault.sol"),
  "utf8"
);

const input = JSON.stringify({
  language: "Solidity",
  sources: { "GhostTownVault.sol": { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
  },
});

const output = JSON.parse(solc.compile(input));

if (output.errors) {
  const fatal = output.errors.filter(e => e.severity === "error");
  if (fatal.length) {
    fatal.forEach(e => console.error(e.formattedMessage));
    process.exit(1);
  }
  output.errors.forEach(e => console.warn(e.formattedMessage));
}

const contract  = output.contracts["GhostTownVault.sol"]["GhostTownVault"];
const abi       = contract.abi;
const bytecode  = contract.evm.bytecode.object;
console.log(`✓ Compiled — bytecode ${bytecode.length / 2} bytes`);

// ── Deploy ────────────────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);

console.log(`Deployer: ${wallet.address}`);
const balance = await provider.getBalance(wallet.address);
console.log(`Balance:  ${ethers.formatEther(balance)} ETH`);

if (balance < ethers.parseEther("0.01")) {
  console.error("❌ Balance too low — get Sepolia ETH from sepoliafaucet.com");
  process.exit(1);
}

const BASE_URI = "https://living-swarm.vercel.app/api/items/";
const factory  = new ethers.ContractFactory(abi, bytecode, wallet);

console.log("Deploying...");
const tx = await factory.deploy(BASE_URI);
console.log(`TX hash: ${tx.deploymentTransaction()?.hash}`);
console.log("Waiting for confirmation...");
await tx.waitForDeployment();

const address = await tx.getAddress();
console.log(`\n✅ GhostTownVault deployed to Sepolia:`);
console.log(`   ${address}`);
console.log(`   https://sepolia.etherscan.io/address/${address}`);

// ── Save result ───────────────────────────────────────────────────────────────
const result = { address, abi, network: "sepolia", deployedAt: new Date().toISOString() };
writeFileSync(
  path.join(__dirname, "../contracts/out/GhostTownVault-sepolia.json"),
  JSON.stringify(result, null, 2)
);
console.log("\nSaved to contracts/out/GhostTownVault-sepolia.json");
console.log("\nNext: update CONTRACT_ADDRESSES in app/lib/vault.ts with:");
console.log(`  sepolia: "${address}"`);
