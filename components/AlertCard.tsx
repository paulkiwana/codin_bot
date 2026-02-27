'use client';

import { memo } from 'react';
import { AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react';
import type { Alert } from '@/lib/types';

interface AlertCardProps {
  alert: Alert;
  onDismiss: () => void;
  onMarkRead: () => void;
}

function AlertCardComponent({ alert, onDismiss, onMarkRead }: AlertCardProps) {
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'support_breach':
      case 'rsi_oversold':
        return 'border-destructive/50 bg-destructive/10';
      case 'resistance_breach':
      case 'rsi_overbought':
        return 'border-warning/50 bg-warning/10';
      default:
        return 'border-primary/50 bg-primary/10';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'support_breach':
        return <AlertCircle className="text-destructive" size={20} />;
      case 'resistance_breach':
        return <AlertCircle className="text-warning" size={20} />;
      case 'rsi_oversold':
        return <AlertCircle className="text-success" size={20} />;
      case 'rsi_overbought':
        return <AlertCircle className="text-warning" size={20} />;
      default:
        return <AlertCircle className="text-primary" size={20} />;
    }
  };

  const getAlertTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'support_breach':
        return 'Support Breach';
      case 'resistance_breach':
        return 'Resistance Breach';
      case 'rsi_oversold':
        return 'RSI Oversold';
      case 'rsi_overbought':
        return 'RSI Overbought';
      default:
        return 'Alert';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const timeAgo = getTimeAgo(alert.timestamp);

  return (
    <div className={`card-glass border rounded-lg p-4 transition-all ${getAlertColor(alert.type)} ${alert.read ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getAlertIcon(alert.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground">
                {alert.symbolName}
              </h4>
              <p className="text-xs text-foreground/60 mt-1">
                {getAlertTypeLabel(alert.type)}
              </p>
            </div>
            <span className="text-xs text-foreground/50 whitespace-nowrap">
              {timeAgo}
            </span>
          </div>

          <p className="text-sm mt-2 text-foreground/80">
            {alert.message}
          </p>

          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-foreground/60">Price:</span>
            <span className="font-semibold text-primary">${alert.price.toFixed(2)}</span>
            {alert.rsi !== undefined && (
              <>
                <span className="text-foreground/60 ml-2">RSI:</span>
                <span className="font-semibold text-primary">{alert.rsi.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-foreground/10">
        {!alert.read && (
          <button
            onClick={onMarkRead}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg text-primary transition-colors"
            aria-label="Mark as read"
          >
            <CheckCircle2 size={16} />
            Mark as Read
          </button>
        )}
        <button
          onClick={onDismiss}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm bg-destructive/20 hover:bg-destructive/30 border border-destructive/50 rounded-lg text-destructive transition-colors"
          aria-label="Dismiss alert"
        >
          <Trash2 size={16} />
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default memo(AlertCardComponent);
