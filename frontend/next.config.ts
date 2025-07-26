/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
   images: {
  remotePatterns:[
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      port: '',
      pathname: '/dl5t2l1sc/image/upload/**',
      search: '',
    },
       {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**', 
      }
  ]
  },
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
