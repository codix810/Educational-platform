/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // ✅ صح
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ علشان ما يوقفش على التحذيرات
  },
  typescript: {
    ignoreBuildErrors: false, // خليه false علشان تشوف الأخطاء المهمة بس
  },
};

module.exports = nextConfig;
