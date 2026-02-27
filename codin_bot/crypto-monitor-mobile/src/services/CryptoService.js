import axios from 'axios';

class CryptoService {
  constructor() {
    this.baseURL = 'https://api.binance.com/api/v3';
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  async fetchOHLCV(symbol, interval, limit = 100) {
    const cacheKey = `${symbol}-${interval}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/klines`, {
        params: {
          symbol: symbol.replace('/', ''),
          interval: interval,
          limit: limit,
        },
      });

      const data = response.data.map(candle => ({
        timestamp: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching OHLCV for ${symbol}:`, error);
      throw error;
    }
  }

  async getCurrentPrice(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/ticker/price`, {
        params: {
          symbol: symbol.replace('/', ''),
        },
      });
      return parseFloat(response.data.price);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }

  async get24hStats(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/ticker/24hr`, {
        params: {
          symbol: symbol.replace('/', ''),
        },
      });
      
      return {
        priceChange: parseFloat(response.data.priceChange),
        priceChangePercent: parseFloat(response.data.priceChangePercent),
        volume: parseFloat(response.data.volume),
        quoteVolume: parseFloat(response.data.quoteVolume),
        high: parseFloat(response.data.highPrice),
        low: parseFloat(response.data.lowPrice),
      };
    } catch (error) {
      console.error(`Error fetching 24h stats for ${symbol}:`, error);
      throw error;
    }
  }

  calculateRSI(prices, period = 6) {
    if (prices.length < period + 1) {
      return null;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) {
      return 100;
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  }

  findSupportResistance(ohlcv, threshold = 0.02) {
    const levels = [];
    
    for (let i = 2; i < ohlcv.length - 2; i++) {
      const current = ohlcv[i];
      const prev1 = ohlcv[i - 1];
      const prev2 = ohlcv[i - 2];
      const next1 = ohlcv[i + 1];
      const next2 = ohlcv[i + 2];

      if (current.high > prev1.high && current.high > prev2.high &&
          current.high > next1.high && current.high > next2.high) {
        levels.push({ price: current.high, type: 'resistance' });
      }

      if (current.low < prev1.low && current.low < prev2.low &&
          current.low < next1.low && current.low < next2.low) {
        levels.push({ price: current.low, type: 'support' });
      }
    }

    const clustered = this.clusterLevels(levels, threshold);
    return clustered;
  }

  clusterLevels(levels, threshold) {
    if (levels.length === 0) return [];

    const sorted = [...levels].sort((a, b) => a.price - b.price);
    const clusters = [];
    let currentCluster = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.abs(sorted[i].price - currentCluster[0].price) / currentCluster[0].price;
      
      if (diff <= threshold) {
        currentCluster.push(sorted[i]);
      } else {
        const avgPrice = currentCluster.reduce((sum, l) => sum + l.price, 0) / currentCluster.length;
        const type = currentCluster[0].type;
        clusters.push({ price: avgPrice, type, count: currentCluster.length });
        currentCluster = [sorted[i]];
      }
    }

    if (currentCluster.length > 0) {
      const avgPrice = currentCluster.reduce((sum, l) => sum + l.price, 0) / currentCluster.length;
      const type = currentCluster[0].type;
      clusters.push({ price: avgPrice, type, count: currentCluster.length });
    }

    return clusters.sort((a, b) => b.count - a.count);
  }

  async analyzeSymbol(symbol, config) {
    try {
      const currentPrice = await this.getCurrentPrice(symbol);
      
      const [weeklyData, monthlyData, dailyData, fourHourData] = await Promise.all([
        this.fetchOHLCV(symbol, '1w', 100),
        this.fetchOHLCV(symbol, '1M', 100),
        this.fetchOHLCV(symbol, '1d', 100),
        this.fetchOHLCV(symbol, '4h', 100),
      ]);

      const weeklySR = this.findSupportResistance(weeklyData, config.srThreshold);
      const monthlySR = this.findSupportResistance(monthlyData, config.srThreshold);
      const allSR = [...weeklySR, ...monthlySR];

      const dailyPrices = dailyData.map(d => d.close);
      const fourHourPrices = fourHourData.map(d => d.close);

      const rsiDaily = this.calculateRSI(dailyPrices, 6);
      const rsi4h = this.calculateRSI(fourHourPrices, 6);

      let nearLevel = null;
      let levelType = null;

      for (const level of allSR) {
        const diff = Math.abs(currentPrice - level.price) / level.price;
        if (diff <= config.srThreshold) {
          nearLevel = level.price;
          levelType = level.type;
          break;
        }
      }

      let condition = null;
      if (rsiDaily > config.rsiOverbought || rsi4h > config.rsiOverbought) {
        condition = 'OVERSOLD';
      } else if (rsiDaily < config.rsiOversold || rsi4h < config.rsiOversold) {
        condition = 'OVERBOUGHT';
      }

      const shouldAlert = nearLevel !== null && condition !== null;

      return {
        symbol,
        currentPrice,
        nearLevel,
        levelType,
        condition,
        rsiDaily,
        rsi4h,
        shouldAlert,
        supportLevels: allSR.filter(l => l.type === 'support').slice(0, 3),
        resistanceLevels: allSR.filter(l => l.type === 'resistance').slice(0, 3),
      };
    } catch (error) {
      console.error(`Error analyzing ${symbol}:`, error);
      return null;
    }
  }

  async discoverTopSymbols(quoteCurrencies = ['USDT'], minVolume = 1000000, maxSymbols = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/ticker/24hr`);
      const tickers = response.data;

      const filtered = tickers
        .filter(ticker => {
          const symbol = ticker.symbol;
          const hasQuote = quoteCurrencies.some(quote => symbol.endsWith(quote));
          const volume = parseFloat(ticker.quoteVolume);
          return hasQuote && volume >= minVolume;
        })
        .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, maxSymbols)
        .map(ticker => {
          const symbol = ticker.symbol;
          let base = symbol;
          for (const quote of quoteCurrencies) {
            if (symbol.endsWith(quote)) {
              base = symbol.slice(0, -quote.length);
              return `${base}/${quote}`;
            }
          }
          return null;
        })
        .filter(s => s !== null);

      return filtered;
    } catch (error) {
      console.error('Error discovering symbols:', error);
      return [];
    }
  }
}

export default new CryptoService();
