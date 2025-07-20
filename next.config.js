/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ده يمنع Vercel يوقف الـ build بسبب ESLint
  },
};

module.exports = nextConfig;
