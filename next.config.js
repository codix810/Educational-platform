/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // ✅ لازم تبقى جوه object
  },
};

module.exports = nextConfig;
