'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Bell, Settings } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-muted border-t border-primary/20 z-50 safe-area-inset-bottom">
      <div className="flex justify-around max-w-md mx-auto">
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center py-4 px-2 transition-colors ${
            isActive('/')
              ? 'text-primary bg-primary/10'
              : 'text-foreground/60 hover:text-foreground'
          }`}
          aria-label="Dashboard"
        >
          <BarChart3 size={24} />
        </Link>
        <Link
          href="/alerts"
          className={`flex-1 flex items-center justify-center py-4 px-2 transition-colors relative ${
            isActive('/alerts')
              ? 'text-primary bg-primary/10'
              : 'text-foreground/60 hover:text-foreground'
          }`}
          aria-label="Alerts"
        >
          <Bell size={24} />
        </Link>
        <Link
          href="/settings"
          className={`flex-1 flex items-center justify-center py-4 px-2 transition-colors ${
            isActive('/settings')
              ? 'text-primary bg-primary/10'
              : 'text-foreground/60 hover:text-foreground'
          }`}
          aria-label="Settings"
        >
          <Settings size={24} />
        </Link>
      </div>
    </nav>
  );
}
