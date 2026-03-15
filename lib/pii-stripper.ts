// Gap 2 — PII stripping before private inference

export interface StripResult {
  stripped: string;
  redactions: string[];
  piiFound: boolean;
}

const PATTERNS: { name: string; pattern: RegExp; replacement: string }[] = [
  { name: 'eth_address',   pattern: /0x[a-fA-F0-9]{40}/g,                      replacement: '[ETH_ADDR]' },
  { name: 'tx_hash',       pattern: /0x[a-fA-F0-9]{64}/g,                      replacement: '[TX_HASH]' },
  { name: 'wei_amount',    pattern: /\b\d{15,}\b/g,                             replacement: '[AMOUNT_WEI]' },
  { name: 'email',         pattern: /[\w.+\-]+@[\w\-]+\.\w{2,}/g,              replacement: '[EMAIL]' },
  { name: 'name_prefix',   pattern: /\b(Mr|Ms|Dr|Mrs|Prof)\.?\s+[A-Z][a-z]+/g, replacement: '[NAME]' },
  { name: 'ip_address',    pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[IP]' },
  { name: 'private_key',   pattern: /0x[a-fA-F0-9]{64}/g,                      replacement: '[PRIVATE_KEY]' },
  { name: 'phone',         pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/g, replacement: '[PHONE]' },
  { name: 'ssn',           pattern: /\b\d{3}-\d{2}-\d{4}\b/g,                  replacement: '[SSN]' },
];

export function stripPII(text: string): StripResult {
  let stripped = text;
  const redactions: string[] = [];

  for (const { name, pattern, replacement } of PATTERNS) {
    const matches = stripped.match(pattern);
    if (matches?.length) {
      redactions.push(`${name}×${matches.length}`);
      stripped = stripped.replace(pattern, replacement);
    }
  }

  return { stripped, redactions, piiFound: redactions.length > 0 };
}
