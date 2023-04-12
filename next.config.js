/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "firebasestorage.googleapis.com",
      "localhost",
    ],
  },
};

module.exports = nextConfig;
