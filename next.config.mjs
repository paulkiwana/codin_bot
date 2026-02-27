/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
};

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
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
  ],
});

export default withPWAConfig(nextConfig);
