/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
  serverActions: {}
}

  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ده يمنع Vercel يوقف الـ build بسبب ESLint
  },
};

module.exports = nextConfig;
