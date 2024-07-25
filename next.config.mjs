import { createProxyMiddleware } from "http-proxy-middleware";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://hap-home.ddns.net:8001/:path*", 
      },
    ];
  },
};

export default nextConfig;
