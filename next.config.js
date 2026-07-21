/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@react-pdf/renderer'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these on the client
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        buffer: false,
        stream: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;