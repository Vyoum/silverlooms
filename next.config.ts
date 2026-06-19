import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
        pathname: "/api/mcp/asset/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shop-jewellery",
        destination: "/jewellery",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
