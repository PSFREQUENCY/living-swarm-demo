/** @type {import('next').NextConfig} */
const isGH = process.env.GITHUB_PAGES === '1';
const base  = isGH ? '/living-swarm-demo' : '';

const nextConfig = {
  // Static export for GitHub Pages; full server mode for Vercel
  output:      isGH ? 'export'    : undefined,
  basePath:    base,
  assetPrefix: base,
  trailingSlash: isGH,

  images: {
    unoptimized: true,                // required for static export
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
  },

  // rewrites only work in server mode (Vercel)
  ...(!isGH && {
    async rewrites() {
      return [
        { source: '/royal-logs',     destination: '/royal-logs/index.html' },
        { source: '/royal-logs/',    destination: '/royal-logs/index.html' },
        { source: '/uniswap',        destination: '/swap/index.html' },
        { source: '/uniswap/',       destination: '/swap/index.html' },
        { source: '/swarm-signals',  destination: '/swarm-signals/index.html' },
        { source: '/swarm-signals/', destination: '/swarm-signals/index.html' },
      ];
    },
  }),
};

module.exports = nextConfig;
