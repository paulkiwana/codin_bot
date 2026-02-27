'use client';

import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import type { Symbol } from '@/lib/types';

interface DashboardCardProps {
  symbol: Symbol;
  onToggle: () => void;
  onEdit: () => void;
}

export default function DashboardCard({ symbol, onToggle, onEdit }: DashboardCardProps) {
  const price = symbol.lastPrice || 0;
  const rsi = symbol.lastRSI || 0;
  const change = symbol.percentageChange || 0;
  const isPositive = change >= 0;

  const getRSIColor = (rsi: number) => {
    if (rsi < 30) return 'text-success'; // Oversold
    if (rsi > 70) return 'text-destructive'; // Overbought
    return 'text-primary';
  };

  const getStatusColor = () => {
    if (!symbol.enabled) return 'opacity-50';
    if (price <= symbol.supportLevel) return 'bg-destructive/20 border-destructive/50';
    if (price >= symbol.resistanceLevel) return 'bg-success/20 border-success/50';
    return 'bg-primary/5 border-primary/20';
  };

  return (
    <div className={`card-glass p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold gradient-text">{symbol.name}</h3>
          <p className="text-xs text-foreground/50 mt-1">{symbol.pair}</p>
        </div>
        <button
          onClick={onToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            symbol.enabled
              ? 'bg-primary/20 border border-primary/50 hover:bg-primary/30'
              : 'bg-muted border border-foreground/20 hover:bg-muted/80'
          }`}
          aria-label={symbol.enabled ? 'Disable monitoring' : 'Enable monitoring'}
        >
          {symbol.enabled ? (
            <Zap size={18} className="text-primary" />
          ) : (
            <Zap size={18} className="text-foreground/30" />
          )}
        </button>
      </div>

      <div className="space-y-2">
        {/* Price Display */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
          </div>
        </div>

        {/* RSI Display */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/70">RSI</span>
          <span className={`font-semibold ${getRSIColor(rsi)}`}>{rsi.toFixed(2)}</span>
        </div>

        {/* Support/Resistance */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-foreground/10">
          <div className="text-xs">
            <p className="text-foreground/50 mb-1">Support</p>
            <p className="text-sm font-semibold text-primary">${symbol.supportLevel.toFixed(2)}</p>
          </div>
          <div className="text-xs">
            <p className="text-foreground/50 mb-1">Resistance</p>
            <p className="text-sm font-semibold text-secondary">${symbol.resistanceLevel.toFixed(2)}</p>
          </div>
        </div>

        {/* Status indicator */}
        {symbol.enabled && (
          <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
            <span className="text-xs text-foreground/50">Status</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              price <= symbol.supportLevel
                ? 'bg-destructive/30 text-destructive'
                : price >= symbol.resistanceLevel
                  ? 'bg-success/30 text-success'
                  : 'bg-primary/30 text-primary'
            }`}>
              {price <= symbol.supportLevel
                ? 'Support'
                : price >= symbol.resistanceLevel
                  ? 'Resistance'
                  : 'Neutral'}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onEdit}
        className="w-full mt-3 py-2 px-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg text-sm font-medium text-primary transition-colors"
      >
        Edit Levels
      </button>
    </div>
  );
}
