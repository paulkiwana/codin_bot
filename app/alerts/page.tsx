'use client';

import { useMonitoring } from '@/lib/context/MonitoringContext';
import AlertCard from '@/components/AlertCard';
import { Trash2, Bell } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, clearAlert, markAlertAsRead, clearAllAlerts } = useMonitoring();

  const unreadCount = alerts.filter(a => !a.read).length;

  if (alerts.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-6 pb-24">
        <header className="sticky top-0 z-10 bg-muted/80 backdrop-blur-md border-b border-primary/20 mb-6">
          <div className="max-w-md mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold gradient-text">Alerts</h1>
            <p className="text-xs text-foreground/50 mt-1">Trading opportunities and price movements</p>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Bell className="text-primary" size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">No Alerts Yet</h2>
            <p className="text-foreground/60">
              Alerts will appear here when cryptocurrency prices hit your configured support/resistance levels or RSI thresholds.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-24">
      <header className="sticky top-0 z-10 bg-muted/80 backdrop-blur-md border-b border-primary/20 mb-6">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold gradient-text">Alerts</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-destructive/20 border border-destructive/50 rounded-full text-xs font-semibold text-destructive">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/50">Trading opportunities and price movements</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onDismiss={() => clearAlert(alert.id)}
            onMarkRead={() => markAlertAsRead(alert.id)}
          />
        ))}
      </main>

      {alerts.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-primary/20">
          <button
            onClick={clearAllAlerts}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-destructive/20 hover:bg-destructive/30 border border-destructive/50 rounded-lg text-destructive font-semibold transition-colors"
          >
            <Trash2 size={18} />
            Clear All Alerts
          </button>
        </div>
      )}
    </div>
  );
}
