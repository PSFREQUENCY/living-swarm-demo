import type { Metadata } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const mono = Share_Tech_Mono({ weight: '400', subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Royal Logs — Recursive Memory Onchain',
  description: 'Crystallize agent memories into living onchain art. Agent × Human × World. Synthesis 2026.',
  openGraph: {
    title: 'Royal Logs',
    description: 'Temporal memory → crystallized onchain art → eternal auction',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="bg-[#030308] antialiased">{children}</body>
    </html>
  );
}
