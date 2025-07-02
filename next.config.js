/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ عشان يتجاهل أخطاء ESLint
  },
  experimental: {
    serverActions: {}, // ✅ استخدم كائن فاضي بدل true
  },
};

module.exports = nextConfig;
