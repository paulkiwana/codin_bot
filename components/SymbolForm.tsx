'use client';

import { useState } from 'react';
import { CryptoService } from '@/lib/services/CryptoService';
import type { Symbol } from '@/lib/types';
import { AlertCircle, Loader2 } from 'lucide-react';

interface SymbolFormProps {
  onSubmit: (symbol: Symbol) => void;
  onCancel: () => void;
  initialSymbol?: Symbol;
}

export default function SymbolForm({ onSubmit, onCancel, initialSymbol }: SymbolFormProps) {
  const [name, setName] = useState(initialSymbol?.name || '');
  const [pair, setPair] = useState(initialSymbol?.pair || '');
  const [support, setSupport] = useState(initialSymbol?.supportLevel.toString() || '');
  const [resistance, setResistance] = useState(initialSymbol?.resistanceLevel.toString() || '');
  const [rsiThreshold, setRsiThreshold] = useState(initialSymbol?.rsiThreshold.toString() || '30');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const popularSymbols = CryptoService.getPopularSymbols();

  const handleValidatePair = async () => {
    if (!pair) {
      setError('Please enter a trading pair');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isValid = await CryptoService.validateSymbol(pair);
      if (!isValid) {
        setError('Invalid trading pair. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate pair. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter a cryptocurrency name');
      return;
    }

    if (!pair.trim()) {
      setError('Please enter a trading pair');
      return;
    }

    if (!support || !resistance || !rsiThreshold) {
      setError('Please fill in all fields');
      return;
    }

    const supportNum = parseFloat(support);
    const resistanceNum = parseFloat(resistance);
    const rsiNum = parseFloat(rsiThreshold);

    if (isNaN(supportNum) || isNaN(resistanceNum) || isNaN(rsiNum)) {
      setError('Please enter valid numbers');
      return;
    }

    if (supportNum >= resistanceNum) {
      setError('Support level must be less than resistance level');
      return;
    }

    if (rsiNum < 1 || rsiNum > 50) {
      setError('RSI threshold must be between 1 and 50');
      return;
    }

    const newSymbol: Symbol = {
      id: initialSymbol?.id || `symbol-${Date.now()}`,
      name: name.trim(),
      pair: pair.trim().toUpperCase(),
      supportLevel: supportNum,
      resistanceLevel: resistanceNum,
      rsiThreshold: rsiNum,
      enabled: initialSymbol?.enabled ?? true,
      lastPrice: initialSymbol?.lastPrice,
      lastRSI: initialSymbol?.lastRSI,
      lastUpdated: initialSymbol?.lastUpdated,
      percentageChange: initialSymbol?.percentageChange,
    };

    onSubmit(newSymbol);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Cryptocurrency Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bitcoin"
          className="w-full px-3 py-2 bg-muted border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Trading Pair Input */}
      <div>
        <label htmlFor="pair" className="block text-sm font-medium mb-2">
          Trading Pair
        </label>
        <div className="flex gap-2">
          <input
            id="pair"
            type="text"
            value={pair}
            onChange={(e) => setPair(e.target.value.toUpperCase())}
            placeholder="e.g., BTC"
            className="flex-1 px-3 py-2 bg-muted border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            type="button"
            onClick={handleValidatePair}
            disabled={loading}
            className="px-3 py-2 bg-secondary/20 hover:bg-secondary/30 border border-secondary/50 rounded-lg text-secondary font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Check'}
          </button>
        </div>
        <p className="text-xs text-foreground/50 mt-2">Popular: {popularSymbols.slice(0, 5).join(', ')}</p>
      </div>

      {/* Support Level */}
      <div>
        <label htmlFor="support" className="block text-sm font-medium mb-2">
          Support Level ($)
        </label>
        <input
          id="support"
          type="number"
          step="0.01"
          value={support}
          onChange={(e) => setSupport(e.target.value)}
          placeholder="e.g., 40000"
          className="w-full px-3 py-2 bg-muted border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Resistance Level */}
      <div>
        <label htmlFor="resistance" className="block text-sm font-medium mb-2">
          Resistance Level ($)
        </label>
        <input
          id="resistance"
          type="number"
          step="0.01"
          value={resistance}
          onChange={(e) => setResistance(e.target.value)}
          placeholder="e.g., 50000"
          className="w-full px-3 py-2 bg-muted border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* RSI Threshold */}
      <div>
        <label htmlFor="rsi" className="block text-sm font-medium mb-2">
          RSI Threshold (1-50)
        </label>
        <input
          id="rsi"
          type="number"
          step="1"
          min="1"
          max="50"
          value={rsiThreshold}
          onChange={(e) => setRsiThreshold(e.target.value)}
          placeholder="30"
          className="w-full px-3 py-2 bg-muted border border-foreground/20 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
        <p className="text-xs text-foreground/50 mt-2">Alert when RSI drops below this value (oversold) or rises above {100 - parseInt(rsiThreshold || '30')} (overbought)</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-3 bg-destructive/20 border border-destructive/50 rounded-lg">
          <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-3 bg-muted hover:bg-muted/80 border border-foreground/20 rounded-lg text-foreground font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-3 bg-primary hover:bg-primary/90 text-background font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {initialSymbol ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
