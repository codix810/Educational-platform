/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  }, 
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ده يمنع Vercel يوقف الـ build بسبب ESLint
  },
};


