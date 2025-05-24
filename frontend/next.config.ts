import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};
module.exports={
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*` // Proxy to Backend
      }
    ]
  }
}
module.exports = nextConfig;

export default nextConfig;
