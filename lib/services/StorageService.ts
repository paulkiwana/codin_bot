import type { Symbol, Alert } from '../types';

const STORAGE_KEYS = {
  SYMBOLS: 'crypto_monitor_symbols',
  ALERTS: 'crypto_monitor_alerts',
  SETTINGS: 'crypto_monitor_settings',
};

export class StorageService {
  /**
   * Save symbols to localStorage
   */
  static saveSymbols(symbols: Symbol[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SYMBOLS, JSON.stringify(symbols));
    } catch (error) {
      console.error('Failed to save symbols:', error);
    }
  }

  /**
   * Load symbols from localStorage
   */
  static loadSymbols(): Symbol[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYMBOLS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load symbols:', error);
      return [];
    }
  }

  /**
   * Save alerts to localStorage
   */
  static saveAlerts(alerts: Alert[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (error) {
      console.error('Failed to save alerts:', error);
    }
  }

  /**
   * Load alerts from localStorage
   */
  static loadAlerts(): Alert[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load alerts:', error);
      return [];
    }
  }

  /**
   * Clear old alerts (keep last 100)
   */
  static pruneAlerts(alerts: Alert[], maxAlerts: number = 100): Alert[] {
    if (alerts.length <= maxAlerts) return alerts;
    return alerts.slice(-maxAlerts);
  }

  /**
   * Check if notification permission is granted
   */
  static hasNotificationPermission(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    return Notification.permission === 'granted';
  }

  /**
   * Request notification permission
   */
  static async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Send notification
   */
  static sendNotification(title: string, options?: NotificationOptions): void {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (this.hasNotificationPermission()) {
      try {
        new Notification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'crypto-alert',
          requireInteraction: true,
          ...options,
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  }

  /**
   * Get key info from IndexedDB or localStorage
   */
  static getSettings(): Record<string, any> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    }
  }

  /**
   * Save settings
   */
  static saveSettings(settings: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Clear all stored data
   */
  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SYMBOLS);
      localStorage.removeItem(STORAGE_KEYS.ALERTS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}
