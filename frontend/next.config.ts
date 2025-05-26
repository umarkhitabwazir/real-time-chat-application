/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.FRONTEND_URL}/api/:path*`, // fix path as well if needed
      },
    ];
  },
};

module.exports = nextConfig;
