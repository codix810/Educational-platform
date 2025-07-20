/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // ✅ كده تمام
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
