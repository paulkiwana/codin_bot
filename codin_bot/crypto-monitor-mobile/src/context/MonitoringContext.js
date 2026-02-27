import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import CryptoService from '../services/CryptoService';

const MonitoringContext = createContext();

export const useMonitoring = () => useContext(MonitoringContext);

export const MonitoringProvider = ({ children }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [symbols, setSymbols] = useState(['BTC/USDT', 'ETH/USDT', 'SOL/USDT']);
  const [alerts, setAlerts] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [config, setConfig] = useState({
    checkInterval: 300,
    rsiOverbought: 90,
    rsiOversold: 10,
    srThreshold: 0.02,
    autoDiscover: false,
    quoteCurrencies: ['USDT'],
    minVolume: 1000000,
    maxSymbols: 50,
  });
  const [lastCheck, setLastCheck] = useState(null);
  const [monitoringInterval, setMonitoringInterval] = useState(null);

  useEffect(() => {
    loadConfig();
    loadAlerts();
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    
    return () => stopMonitoring();
  }, [isMonitoring, symbols, config]);

  const loadConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
      
      const savedSymbols = await AsyncStorage.getItem('symbols');
      if (savedSymbols) {
        setSymbols(JSON.parse(savedSymbols));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const saveConfig = async (newConfig) => {
    try {
      await AsyncStorage.setItem('config', JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const saveSymbols = async (newSymbols) => {
    try {
      await AsyncStorage.setItem('symbols', JSON.stringify(newSymbols));
      setSymbols(newSymbols);
    } catch (error) {
      console.error('Error saving symbols:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const savedAlerts = await AsyncStorage.getItem('alerts');
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const addAlert = async (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedAlerts = [newAlert, ...alerts].slice(0, 100);
    setAlerts(updatedAlerts);
    
    try {
      await AsyncStorage.setItem('alerts', JSON.stringify(updatedAlerts));
    } catch (error) {
      console.error('Error saving alert:', error);
    }
    
    await sendNotification(newAlert);
  };

  const clearAlerts = async () => {
    setAlerts([]);
    try {
      await AsyncStorage.removeItem('alerts');
    } catch (error) {
      console.error('Error clearing alerts:', error);
    }
  };

  const sendNotification = async (alert) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${alert.symbol} Alert!`,
          body: `Price: $${alert.currentPrice.toFixed(2)}\nNear ${alert.levelType?.toUpperCase()}: $${alert.nearLevel?.toFixed(2)}\nCondition: ${alert.condition}`,
          data: { alert },
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const checkSymbols = async () => {
    const newMarketData = {};
    const lastAlerts = await AsyncStorage.getItem('lastAlerts');
    const lastAlertsMap = lastAlerts ? JSON.parse(lastAlerts) : {};
    const now = Date.now();
    const alertCooldown = 3600000; // 1 hour

    for (const symbol of symbols) {
      try {
        const analysis = await CryptoService.analyzeSymbol(symbol, config);
        
        if (analysis) {
          newMarketData[symbol] = analysis;

          if (analysis.shouldAlert) {
            const lastAlertTime = lastAlertsMap[symbol] || 0;
            
            if (now - lastAlertTime > alertCooldown) {
              await addAlert(analysis);
              lastAlertsMap[symbol] = now;
            }
          }
        }
      } catch (error) {
        console.error(`Error checking ${symbol}:`, error);
      }
    }

    setMarketData(newMarketData);
    setLastCheck(new Date());
    
    try {
      await AsyncStorage.setItem('lastAlerts', JSON.stringify(lastAlertsMap));
    } catch (error) {
      console.error('Error saving last alerts:', error);
    }
  };

  const discoverSymbols = async () => {
    try {
      const discovered = await CryptoService.discoverTopSymbols(
        config.quoteCurrencies,
        config.minVolume,
        config.maxSymbols
      );
      
      if (discovered.length > 0) {
        await saveSymbols(discovered);
        return discovered;
      }
    } catch (error) {
      console.error('Error discovering symbols:', error);
    }
    return symbols;
  };

  const startMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
    }

    checkSymbols();

    const interval = setInterval(() => {
      checkSymbols();
    }, config.checkInterval * 1000);

    setMonitoringInterval(interval);
  };

  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  const value = {
    isMonitoring,
    symbols,
    alerts,
    marketData,
    config,
    lastCheck,
    toggleMonitoring,
    saveConfig,
    saveSymbols,
    clearAlerts,
    checkSymbols,
    discoverSymbols,
  };

  return (
    <MonitoringContext.Provider value={value}>
      {children}
    </MonitoringContext.Provider>
  );
};
