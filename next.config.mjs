/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Disable Turbopack to use webpack with next-pwa
  experimental: {
    turbopack: false,
  },
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [375, 428, 768, 1024],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Enable SWC minification for faster builds
  swcMinify: true,
  // Optimize production builds
  compress: true,
  poweredByHeader: false,
  // Production source maps (optional, remove if too large)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default withPWAConfig(nextConfig);
