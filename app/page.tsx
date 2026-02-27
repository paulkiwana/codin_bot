'use client';

import { useState } from 'react';
import { useMonitoring } from '@/lib/context/MonitoringContext';
import DashboardCard from '@/components/DashboardCard';
import { Play, Square, Plus } from 'lucide-react';
import Modal from '@/components/Modal';
import SymbolForm from '@/components/SymbolForm';

export default function Dashboard() {
  const context = useMonitoring();
  
  if (!context) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Loading...</h2>
          <p className="text-foreground/60">Initializing crypto monitor</p>
        </div>
      </div>
    );
  }
  
  const { symbols, isMonitoring, lastUpdateTime, startMonitoring, stopMonitoring, toggleSymbol, removeSymbol, addSymbol } = context;
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);

  const activeSymbols = symbols.filter(s => s.enabled).length;
  const lastUpdate = lastUpdateTime ? new Date(lastUpdateTime).toLocaleTimeString() : 'Never';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-muted/80 backdrop-blur-md border-b border-primary/20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Crypto Monitor</h1>
              <p className="text-xs text-foreground/50 mt-1">Real-time Price Alerts</p>
            </div>
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`p-3 rounded-full transition-all ${
                isMonitoring
                  ? 'bg-destructive/20 border border-destructive/50 hover:bg-destructive/30'
                  : 'bg-primary/20 border border-primary/50 hover:bg-primary/30'
              }`}
              aria-label={isMonitoring ? 'Stop monitoring' : 'Start monitoring'}
            >
              {isMonitoring ? (
                <Square size={20} className="text-destructive" />
              ) : (
                <Play size={20} className="text-primary" />
              )}
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-foreground/60 bg-muted p-2 rounded-lg">
            <div>
              <span className="font-semibold text-foreground">{activeSymbols}</span> active • {symbols.length} total
            </div>
            <span className={isMonitoring ? 'text-primary' : 'text-foreground/40'}>
              {isMonitoring ? '🔴 Monitoring' : '⭕ Paused'}
            </span>
            <span className="text-foreground/40">Last: {lastUpdate}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        {symbols.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Plus className="text-primary" size={32} />
            </div>
            <h2 className="text-lg font-semibold mb-2">No Cryptocurrencies Yet</h2>
            <p className="text-foreground/60 mb-6">Add your first cryptocurrency to start monitoring prices and receiving alerts.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-background font-semibold rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Cryptocurrency
            </button>
          </div>
        ) : (
          <>
            {symbols.map((symbol) => (
              <DashboardCard
                key={symbol.id}
                symbol={symbol}
                onToggle={() => toggleSymbol(symbol.id)}
                onEdit={() => setEditingSymbol(symbol.id)}
              />
            ))}
          </>
        )}
      </main>

      {/* Floating Action Button */}
      {symbols.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-28 right-4 w-14 h-14 bg-primary hover:bg-primary/90 text-background rounded-full shadow-lg flex items-center justify-center transition-all"
          aria-label="Add cryptocurrency"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Modals */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="card-glass border border-primary/20 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 gradient-text">Add Cryptocurrency</h2>
            <SymbolForm
              onSubmit={(symbol) => {
                addSymbol(symbol);
                setShowAddModal(false);
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
