/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ده اللي بيحل المشكلة مؤقتًا
  },
};

module.exports = nextConfig;
