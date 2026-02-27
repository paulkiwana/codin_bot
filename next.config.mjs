/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

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

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Aggressive caching for offline support
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.binance\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'binance-api-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    {
      urlPattern: /^https:\/\/.+\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    // Cache CSS and JavaScript
    {
      urlPattern: /^https:\/\/.+\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
  ],
});

export default withPWAConfig(nextConfig);
