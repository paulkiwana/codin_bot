'use client';

import { useState } from 'react';
import { useMonitoring } from '@/lib/context/MonitoringContext';
import { Trash2, Download, Upload, Settings as SettingsIcon } from 'lucide-react';
import { StorageService } from '@/lib/services/StorageService';

export default function SettingsPage() {
  const { symbols, alerts, clearAllAlerts } = useMonitoring();
  const [notificationsEnabled, setNotificationsEnabled] = useState(StorageService.hasNotificationPermission());

  const handleEnableNotifications = async () => {
    const granted = await StorageService.requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const handleExportData = () => {
    const data = {
      symbols,
      alerts,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crypto-monitor-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.symbols && Array.isArray(data.symbols)) {
        data.symbols.forEach((symbol: any) => {
          StorageService.saveSymbols([...symbols, symbol]);
        });
      }

      if (data.alerts && Array.isArray(data.alerts)) {
        StorageService.saveAlerts(data.alerts);
      }

      alert('Data imported successfully!');
      window.location.reload();
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
      console.error('Import error:', error);
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all data? This cannot be undone.')) {
      StorageService.clearAllData();
      clearAllAlerts();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-24">
      <header className="sticky top-0 z-10 bg-muted/80 backdrop-blur-md border-b border-primary/20 mb-6">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text">Settings</h1>
          <p className="text-xs text-foreground/50 mt-1">App configuration and data management</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-6">
        {/* Notifications Section */}
        <section className="card-glass border border-primary/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon size={20} className="text-primary" />
            Notifications
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Price Alerts</p>
                <p className="text-sm text-foreground/60 mt-1">Get notified when prices hit your levels</p>
              </div>
              <button
                onClick={handleEnableNotifications}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  notificationsEnabled
                    ? 'bg-success/20 border border-success/50 text-success'
                    : 'bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30'
                }`}
              >
                {notificationsEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="card-glass border border-primary/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>

          <div className="space-y-3">
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{symbols.length}</p>
                <p className="text-xs text-foreground/60 mt-1">Cryptocurrencies</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{alerts.length}</p>
                <p className="text-xs text-foreground/60 mt-1">Alerts History</p>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-secondary/20 hover:bg-secondary/30 border border-secondary/50 rounded-lg text-secondary font-semibold transition-colors"
            >
              <Download size={18} />
              Export Data
            </button>

            {/* Import Button */}
            <label className="flex items-center justify-center gap-2 py-3 px-4 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg text-primary font-semibold transition-colors cursor-pointer">
              <Upload size={18} />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="card-glass border border-destructive/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h2>

          <button
            onClick={handleClearAllData}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-destructive/20 hover:bg-destructive/30 border border-destructive/50 rounded-lg text-destructive font-semibold transition-colors"
          >
            <Trash2 size={18} />
            Delete All Data
          </button>
        </section>

        {/* About Section */}
        <section className="card-glass border border-primary/20 rounded-lg p-4 text-center text-foreground/60 text-sm">
          <p>
            <span className="text-foreground font-semibold">Crypto Monitor</span>
            <br />
            v1.0.0
          </p>
          <p className="mt-3">
            Real-time cryptocurrency price monitoring with support/resistance alerts and RSI indicators.
          </p>
        </section>
      </main>
    </div>
  );
}
