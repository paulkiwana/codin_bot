import type { CryptoData, BinanceKline } from '../types';

const BINANCE_API = 'https://api.binance.com/api/v3';

export class CryptoService {
  /**
   * Fetch klines data from Binance API
   */
  static async getKlines(
    symbol: string,
    interval: string = '1h',
    limit: number = 14
  ): Promise<BinanceKline[]> {
    try {
      const response = await fetch(
        `${BINANCE_API}/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`Binance API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch klines for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Fetch current price from Binance API
   */
  static async getPrice(symbol: string): Promise<number | null> {
    try {
      const response = await fetch(
        `${BINANCE_API}/ticker/price?symbol=${symbol}USDT`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch price for ${symbol}`);
      }

      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Calculate RSI (Relative Strength Index)
   * RSI = 100 - (100 / (1 + RS))
   * RS = Average Gain / Average Loss
   */
  static calculateRSI(closes: number[], period: number = 14): number {
    if (closes.length < period + 1) {
      return 50; // Return neutral value if not enough data
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate smoothed averages for remaining data
    for (let i = closes.length - period + 1; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) {
        avgGain = (avgGain * (period - 1) + change) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
      }
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi * 100) / 100;
  }

  /**
   * Fetch and calculate RSI for a symbol
   */
  static async getRSI(symbol: string, interval: string = '1h'): Promise<number> {
    try {
      const klines = await this.getKlines(symbol, interval, 30);
      if (klines.length === 0) {
        return 50; // Neutral value if no data
      }

      const closes = klines.map((kline) => parseFloat(kline[4]));
      return this.calculateRSI(closes);
    } catch (error) {
      console.error(`Failed to calculate RSI for ${symbol}:`, error);
      return 50;
    }
  }

  /**
   * Get 24h price change percentage
   */
  static async get24hChange(symbol: string): Promise<number> {
    try {
      const response = await fetch(
        `${BINANCE_API}/ticker/24hr?symbol=${symbol}USDT`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch 24h data for ${symbol}`);
      }

      const data = await response.json();
      return parseFloat(data.priceChangePercent);
    } catch (error) {
      console.error(`Failed to get 24h change for ${symbol}:`, error);
      return 0;
    }
  }

  /**
   * Fetch comprehensive crypto data
   */
  static async getCryptoData(symbol: string): Promise<CryptoData | null> {
    try {
      const [price, rsi, change] = await Promise.all([
        this.getPrice(symbol),
        this.getRSI(symbol),
        this.get24hChange(symbol),
      ]);

      if (price === null) {
        return null;
      }

      return {
        symbol,
        price,
        rsi,
        percentageChange: change,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Failed to get crypto data for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Validate symbol exists
   */
  static async validateSymbol(symbol: string): Promise<boolean> {
    try {
      const price = await this.getPrice(symbol);
      return price !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get list of popular cryptocurrencies
   */
  static getPopularSymbols(): string[] {
    return ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'LINK', 'MATIC'];
  }
}
