import type { Metadata, Viewport } from 'next';
import { MonitoringProvider } from '@/lib/context/MonitoringContext';
import Navigation from '@/components/Navigation';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'Crypto Monitor - Real-time Price Alerts',
  description: 'Monitor cryptocurrency prices and receive alerts for trading opportunities. Install as a Chrome app.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Crypto Monitor',
  },
  formatDetection: {
    telephone: false,
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00d4aa',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ServiceWorkerRegister />
        <MonitoringProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 pb-20">
              {children}
            </main>
            <Navigation />
          </div>
        </MonitoringProvider>
      </body>
    </html>
  );
}
