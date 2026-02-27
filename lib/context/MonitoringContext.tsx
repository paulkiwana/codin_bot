'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Symbol, Alert, MonitoringContextType } from '../types';
import { CryptoService } from '../services/CryptoService';
import { StorageService } from '../services/StorageService';

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export function MonitoringProvider({ children }: { children: React.ReactNode }) {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const savedSymbols = StorageService.loadSymbols();
      const savedAlerts = StorageService.loadAlerts();
      setSymbols(savedSymbols);
      setAlerts(savedAlerts);

      // Request notification permission
      await StorageService.requestNotificationPermission();
    };

    loadData();
  }, []);

  // Symbol management
  const addSymbol = useCallback((symbol: Symbol) => {
    setSymbols((prev) => {
      const updated = [...prev, symbol];
      StorageService.saveSymbols(updated);
      return updated;
    });
  }, []);

  const updateSymbol = useCallback((id: string, updates: Partial<Symbol>) => {
    setSymbols((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      StorageService.saveSymbols(updated);
      return updated;
    });
  }, []);

  const removeSymbol = useCallback((id: string) => {
    setSymbols((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      StorageService.saveSymbols(updated);
      return updated;
    });
  }, []);

  const toggleSymbol = useCallback((id: string) => {
    updateSymbol(id, { enabled: !symbols.find((s) => s.id === id)?.enabled });
  }, [symbols, updateSymbol]);

  // Alert management
  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => {
      let updated = [alert, ...prev];
      updated = StorageService.pruneAlerts(updated);
      StorageService.saveAlerts(updated);
      return updated;
    });

    // Send notification
    StorageService.sendNotification(`${alert.symbolName} Alert`, {
      body: alert.message,
      tag: `alert-${alert.id}`,
    });
  }, []);

  const clearAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      StorageService.saveAlerts(updated);
      return updated;
    });
  }, []);

  const markAlertAsRead = useCallback((id: string) => {
    setAlerts((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, read: true } : a));
      StorageService.saveAlerts(updated);
      return updated;
    });
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
    StorageService.saveAlerts([]);
  }, []);

  // Monitoring
  const checkSymbols = useCallback(async () => {
    const enabledSymbols = symbols.filter((s) => s.enabled);
    if (enabledSymbols.length === 0) return;

    for (const symbol of enabledSymbols) {
      try {
        const data = await CryptoService.getCryptoData(symbol.pair);
        if (!data) continue;

        // Update symbol with latest data
        updateSymbol(symbol.id, {
          lastPrice: data.price,
          lastRSI: data.rsi,
          lastUpdated: data.timestamp,
          percentageChange: data.percentageChange,
        });

        // Check for alerts
        const alertId = `${symbol.id}-${Date.now()}`;

        // Support level breach
        if (data.price < symbol.supportLevel && !symbol.lastPrice) {
          addAlert({
            id: alertId,
            symbolId: symbol.id,
            symbolName: symbol.name,
            type: 'support_breach',
            price: data.price,
            timestamp: Date.now(),
            message: `${symbol.name} broke below support at $${symbol.supportLevel.toFixed(2)}`,
            read: false,
          });
        } else if (data.price < symbol.supportLevel && symbol.lastPrice! > symbol.supportLevel) {
          addAlert({
            id: alertId,
            symbolId: symbol.id,
            symbolName: symbol.name,
            type: 'support_breach',
            price: data.price,
            timestamp: Date.now(),
            message: `${symbol.name} broke below support at $${symbol.supportLevel.toFixed(2)}`,
            read: false,
          });
        }

        // Resistance level breach
        if (data.price > symbol.resistanceLevel && !symbol.lastPrice) {
          addAlert({
            id: alertId,
            symbolId: symbol.id,
            symbolName: symbol.name,
            type: 'resistance_breach',
            price: data.price,
            rsi: data.rsi,
            timestamp: Date.now(),
            message: `${symbol.name} broke above resistance at $${symbol.resistanceLevel.toFixed(2)}`,
            read: false,
          });
        } else if (data.price > symbol.resistanceLevel && symbol.lastPrice! < symbol.resistanceLevel) {
          addAlert({
            id: alertId,
            symbolId: symbol.id,
            symbolName: symbol.name,
            type: 'resistance_breach',
            price: data.price,
            rsi: data.rsi,
            timestamp: Date.now(),
            message: `${symbol.name} broke above resistance at $${symbol.resistanceLevel.toFixed(2)}`,
            read: false,
          });
        }

        // RSI conditions
        if (data.rsi < symbol.rsiThreshold) {
          const previousRSI = symbol.lastRSI || 50;
          if (previousRSI >= symbol.rsiThreshold) {
            addAlert({
              id: alertId,
              symbolId: symbol.id,
              symbolName: symbol.name,
              type: 'rsi_oversold',
              price: data.price,
              rsi: data.rsi,
              timestamp: Date.now(),
              message: `${symbol.name} RSI dropped to ${data.rsi.toFixed(2)} (Oversold)`,
              read: false,
            });
          }
        }

        if (data.rsi > (100 - symbol.rsiThreshold)) {
          const previousRSI = symbol.lastRSI || 50;
          if (previousRSI <= (100 - symbol.rsiThreshold)) {
            addAlert({
              id: alertId,
              symbolId: symbol.id,
              symbolName: symbol.name,
              type: 'rsi_overbought',
              price: data.price,
              rsi: data.rsi,
              timestamp: Date.now(),
              message: `${symbol.name} RSI rose to ${data.rsi.toFixed(2)} (Overbought)`,
              read: false,
            });
          }
        }
      } catch (error) {
        console.error(`Error checking symbol ${symbol.name}:`, error);
      }
    }

    setLastUpdateTime(Date.now());
  }, [symbols, updateSymbol, addAlert]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    checkSymbols(); // Check immediately

    // Check every 5 minutes
    monitoringIntervalRef.current = setInterval(() => {
      checkSymbols();
    }, 5 * 60 * 1000);
  }, [isMonitoring, checkSymbols]);

  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);

  const saveSettings = useCallback(async () => {
    StorageService.saveSymbols(symbols);
    StorageService.saveAlerts(alerts);
  }, [symbols, alerts]);

  const loadSettings = useCallback(async () => {
    const savedSymbols = StorageService.loadSymbols();
    const savedAlerts = StorageService.loadAlerts();
    setSymbols(savedSymbols);
    setAlerts(savedAlerts);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, []);

  const value: MonitoringContextType = {
    symbols,
    alerts,
    isMonitoring,
    lastUpdateTime,
    addSymbol,
    updateSymbol,
    removeSymbol,
    toggleSymbol,
    addAlert,
    clearAlert,
    markAlertAsRead,
    clearAllAlerts,
    startMonitoring,
    stopMonitoring,
    saveSettings,
    loadSettings,
  };

  return (
    <MonitoringContext.Provider value={value}>
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within MonitoringProvider');
  }
  return context;
}
