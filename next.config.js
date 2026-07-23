const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // ✅ This fixes the recharts/react-is build error on Vercel
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-is': require.resolve('react-is'),
    };
    return config;
  },
};

module.exports = withNextIntl(nextConfig);