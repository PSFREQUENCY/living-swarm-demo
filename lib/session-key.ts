// Gap 1 — Wallet-derived session key (browser only)
// Uses eth_personal_sign + HKDF → AES-256-GCM CryptoKey
// The key is non-extractable and lives only in JS heap for the session

export const SESSION_MSG =
  'Living Swarm Session Key v1\n' +
  'Sign to derive your local encryption key.\n' +
  'This signature never leaves your browser.';

function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex;
  const arr = new Uint8Array(h.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}

export async function deriveSessionKey(address: string): Promise<CryptoKey> {
  if (typeof window === 'undefined') throw new Error('Browser only');
  const eth = (window as any).ethereum;
  if (!eth) throw new Error('No wallet detected');

  // Request personal_sign
  const sig: string = await eth.request({
    method: 'personal_sign',
    params: [SESSION_MSG, address],
  });

  const sigBytes = hexToBytes(sig).buffer as ArrayBuffer;

  // Import signature bytes as HKDF key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw', sigBytes, { name: 'HKDF' }, false, ['deriveKey']
  );

  // Derive AES-256-GCM key — non-extractable
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      salt: new TextEncoder().encode('living-swarm-session-v1'),
      info: new TextEncoder().encode(address.toLowerCase()),
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function aesEncrypt(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  // Return iv+ciphertext as hex
  const combined = new Uint8Array(iv.length + ct.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ct), iv.length);
  return Array.from(combined).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function aesDecrypt(key: CryptoKey, hex: string): Promise<string> {
  const bytes = hexToBytes(hex);
  const iv = bytes.slice(0, 12);
  const ct = bytes.slice(12);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new TextDecoder().decode(pt);
}
