export interface Symbol {
  id: string;
  name: string;
  pair: string;
  supportLevel: number;
  resistanceLevel: number;
  rsiThreshold: number;
  enabled: boolean;
  lastPrice?: number;
  lastRSI?: number;
  lastUpdated?: number;
  percentageChange?: number;
  priceHistory?: Array<{ time: number; price: number }>;
}

export interface Alert {
  id: string;
  symbolId: string;
  symbolName: string;
  type: 'support_breach' | 'resistance_breach' | 'rsi_oversold' | 'rsi_overbought';
  price: number;
  rsi?: number;
  timestamp: number;
  message: string;
  read: boolean;
}

export interface MonitoringContextType {
  symbols: Symbol[];
  alerts: Alert[];
  isMonitoring: boolean;
  lastUpdateTime: number | null;
  
  addSymbol: (symbol: Symbol) => void;
  updateSymbol: (id: string, updates: Partial<Symbol>) => void;
  removeSymbol: (id: string) => void;
  toggleSymbol: (id: string) => void;
  
  addAlert: (alert: Alert) => void;
  clearAlert: (id: string) => void;
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;
  
  startMonitoring: () => void;
  stopMonitoring: () => void;
  
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

export interface CryptoData {
  symbol: string;
  price: number;
  rsi: number;
  percentageChange: number;
  timestamp: number;
}

export interface BinanceKline {
  [key: number]: any;
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
  7: string; // Quote asset volume
  8: number; // Number of trades
  9: string; // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
}
