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
      "sc-erp.s3.amazonaws.com",
      "localhost",
    ],
  },
};

module.exports = nextConfig;
