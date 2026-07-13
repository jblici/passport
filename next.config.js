/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid circular structure errors in Vercel
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
