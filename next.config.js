/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
  },
  async rewrites() {
    return [
      { source: '/royal-logs',    destination: '/royal-logs/index.html' },
      { source: '/royal-logs/',   destination: '/royal-logs/index.html' },
      { source: '/uniswap',       destination: '/uniswap/index.html' },
      { source: '/uniswap/',      destination: '/uniswap/index.html' },
      { source: '/swarm-signals', destination: '/swarm-signals/index.html' },
      { source: '/swarm-signals/',destination: '/swarm-signals/index.html' },
    ];
  },
};
module.exports = nextConfig;
