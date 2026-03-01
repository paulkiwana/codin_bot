// Crypto Monitor App - Pure JavaScript
class CryptoMonitorApp {
    constructor() {
        this.symbols = [];
        this.alerts = [];
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.settings = {
            checkInterval: 30,
            rsiBuy: 30,
            rsiSell: 70,
            autoDiscovery: false
        };

        this.initializeFromStorage();
        this.setupEventListeners();
        this.render();

        // Register service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    }

    initializeFromStorage() {
        const stored = localStorage.getItem('cryptoMonitorData');
        if (stored) {
            const data = JSON.parse(stored);
            this.symbols = data.symbols || [];
            this.alerts = data.alerts || [];
            this.settings = { ...this.settings, ...data.settings };
        } else {
            // Default symbols
            this.symbols = [
                { symbol: 'BTCUSDT', enabled: true, support: 40000, resistance: 50000, lastPrice: 0, lastRSI: 50, lastAlert: null },
                { symbol: 'ETHUSDT', enabled: true, support: 2000, resistance: 3000, lastPrice: 0, lastRSI: 50, lastAlert: null }
            ];
        }
    }

    saveToStorage() {
        localStorage.setItem('cryptoMonitorData', JSON.stringify({
            symbols: this.symbols,
            alerts: this.alerts,
            settings: this.settings
        }));
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
            });
        });

        // Bottom navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.nav;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
                document.getElementById(tab).classList.add('active');
            });
        });

        // Modal
        document.getElementById('addSymbolModal').addEventListener('click', (e) => {
            if (e.target.id === 'addSymbolModal') this.closeAddSymbolModal();
        });
    }

    startMonitoring() {
        if (this.isMonitoring) return;
        this.isMonitoring = true;
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('stopBtn').style.display = 'block';
        this.saveToStorage();

        const check = async () => {
            for (const symbol of this.symbols) {
                if (symbol.enabled) {
                    await this.checkSymbol(symbol);
                }
            }
            this.updateUI();
        };

        check();
        this.monitoringInterval = setInterval(check, this.settings.checkInterval * 1000);
    }

    stopMonitoring() {
        this.isMonitoring = false;
        clearInterval(this.monitoringInterval);
        document.getElementById('startBtn').style.display = 'block';
        document.getElementById('stopBtn').style.display = 'none';
        this.saveToStorage();
    }

    async checkSymbol(symbol) {
        try {
            const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.symbol}&interval=1h&limit=14`);
            if (!response.ok) throw new Error('API Error');
            
            const klines = await response.json();
            if (klines.length < 14) return;

            // Calculate RSI
            const closes = klines.map(k => parseFloat(k[4]));
            const rsi = this.calculateRSI(closes);

            // Get current price
            const currentPrice = closes[closes.length - 1];
            symbol.lastPrice = currentPrice;
            symbol.lastRSI = rsi;

            // Check for alerts
            const alertType = this.checkForAlert(symbol, rsi, currentPrice);
            if (alertType) {
                this.createAlert(symbol, alertType, rsi, currentPrice);
                this.showNotification(symbol.symbol, alertType, rsi, currentPrice);
            }
        } catch (error) {
            console.error(`Error checking ${symbol.symbol}:`, error);
        }
    }

    calculateRSI(closes, period = 14) {
        if (closes.length < period) return 50;

        let gains = 0;
        let losses = 0;

        for (let i = 1; i < period; i++) {
            const diff = closes[i] - closes[i - 1];
            if (diff > 0) gains += diff;
            else losses += Math.abs(diff);
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        for (let i = period; i < closes.length; i++) {
            const diff = closes[i] - closes[i - 1];
            const change = diff > 0 ? diff : 0;
            const loss = diff < 0 ? Math.abs(diff) : 0;

            avgGain = (avgGain * (period - 1) + change) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;
        }

        const rs = avgGain / (avgLoss || 0.0001);
        return 100 - (100 / (1 + rs));
    }

    checkForAlert(symbol, rsi, price) {
        // Support level alert
        if (price <= symbol.support && rsi < this.settings.rsiBuy) {
            if (!symbol.lastAlert || symbol.lastAlert.type !== 'support') {
                return 'support';
            }
        }

        // Resistance level alert
        if (price >= symbol.resistance && rsi > this.settings.rsiSell) {
            if (!symbol.lastAlert || symbol.lastAlert.type !== 'resistance') {
                return 'resistance';
            }
        }

        // RSI buy signal
        if (rsi < this.settings.rsiBuy && (!symbol.lastAlert || symbol.lastAlert.type !== 'rsiBuy')) {
            return 'rsiBuy';
        }

        // RSI sell signal
        if (rsi > this.settings.rsiSell && (!symbol.lastAlert || symbol.lastAlert.type !== 'rsiSell')) {
            return 'rsiSell';
        }

        return null;
    }

    createAlert(symbol, type, rsi, price) {
        const alertMessages = {
            support: `Support level reached for ${symbol.symbol}`,
            resistance: `Resistance level reached for ${symbol.symbol}`,
            rsiBuy: `RSI Buy Signal for ${symbol.symbol}`,
            rsiSell: `RSI Sell Signal for ${symbol.symbol}`
        };

        const alert = {
            id: Date.now(),
            symbol: symbol.symbol,
            type: type,
            message: alertMessages[type],
            rsi: rsi.toFixed(2),
            price: price.toFixed(2),
            timestamp: Date.now()
        };

        this.alerts.unshift(alert);
        symbol.lastAlert = alert;
        this.saveToStorage();
    }

    showNotification(symbol, type, rsi, price) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const messages = {
                support: `Support level reached! RSI: ${rsi.toFixed(2)}`,
                resistance: `Resistance level reached! RSI: ${rsi.toFixed(2)}`,
                rsiBuy: `RSI Buy Signal (${rsi.toFixed(2)})`,
                rsiSell: `RSI Sell Signal (${rsi.toFixed(2)})`
            };

            new Notification(`${symbol} Alert`, {
                body: messages[type],
                icon: 'icon-96.png',
                tag: `crypto-alert-${Date.now()}`
            });
        }
    }

    toggleSymbol(symbol) {
        symbol.enabled = !symbol.enabled;
        this.saveToStorage();
        this.updateUI();
    }

    removeSymbol(symbol) {
        this.symbols = this.symbols.filter(s => s.symbol !== symbol.symbol);
        this.saveToStorage();
        this.updateUI();
    }

    addSymbol() {
        const input = document.getElementById('symbolInput');
        const support = parseFloat(document.getElementById('supportInput').value);
        const resistance = parseFloat(document.getElementById('resistanceInput').value);

        if (!input.value) {
            alert('Please enter a symbol');
            return;
        }

        if (isNaN(support) || isNaN(resistance)) {
            alert('Please enter valid support and resistance levels');
            return;
        }

        const existing = this.symbols.find(s => s.symbol === input.value.toUpperCase());
        if (existing) {
            alert('Symbol already exists');
            return;
        }

        this.symbols.push({
            symbol: input.value.toUpperCase(),
            enabled: true,
            support: support,
            resistance: resistance,
            lastPrice: 0,
            lastRSI: 50,
            lastAlert: null
        });

        this.saveToStorage();
        this.closeAddSymbolModal();
        this.updateUI();
    }

    openAddSymbolModal() {
        document.getElementById('addSymbolModal').classList.add('active');
        document.getElementById('symbolInput').focus();
    }

    closeAddSymbolModal() {
        document.getElementById('addSymbolModal').classList.remove('active');
        document.getElementById('symbolInput').value = '';
        document.getElementById('supportInput').value = '';
        document.getElementById('resistanceInput').value = '';
    }

    updateSettings() {
        this.settings.checkInterval = parseInt(document.getElementById('checkInterval').value);
        this.settings.rsiBuy = parseInt(document.getElementById('rsiBuy').value);
        this.settings.rsiSell = parseInt(document.getElementById('rsiSell').value);
        this.settings.autoDiscovery = document.getElementById('autoDiscovery').checked;
        this.saveToStorage();
    }

    clearAllAlerts() {
        if (confirm('Clear all alerts?')) {
            this.alerts = [];
            this.saveToStorage();
            this.updateUI();
        }
    }

    updateUI() {
        this.renderDashboard();
        this.renderAlerts();
        this.updateStats();
    }

    updateStats() {
        document.getElementById('symbolCount').textContent = this.symbols.filter(s => s.enabled).length;
        document.getElementById('alertCount').textContent = this.alerts.length;
        
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    renderDashboard() {
        const list = document.getElementById('symbolsList');
        
        if (this.symbols.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>No symbols added yet</p></div>';
            return;
        }

        list.innerHTML = this.symbols.map(symbol => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${symbol.symbol}</div>
                        <div class="card-subtitle">
                            <span class="badge ${symbol.enabled ? 'success' : 'alert'}">${symbol.enabled ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                    <button class="danger" onclick="app.removeSymbol(app.symbols.find(s => s.symbol === '${symbol.symbol}'))">Remove</button>
                </div>

                <div class="symbol-info">
                    <div class="info-item">
                        <div class="info-label">Price</div>
                        <div class="info-value ${symbol.lastPrice > 0 ? 'price-up' : ''}">${symbol.lastPrice.toFixed(2)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">RSI (14)</div>
                        <div class="info-value">${symbol.lastRSI.toFixed(2)}</div>
                        <div class="rsi-bar">
                            <div class="rsi-fill" style="width: ${symbol.lastRSI}%"></div>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Support</div>
                        <div class="info-value">${symbol.support.toFixed(2)}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Resistance</div>
                        <div class="info-value">${symbol.resistance.toFixed(2)}</div>
                    </div>
                </div>

                <label style="margin-top: 12px;">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" ${symbol.enabled ? 'checked' : ''} onchange="app.toggleSymbol(app.symbols.find(s => s.symbol === '${symbol.symbol}'))">
                        <span>Enable monitoring</span>
                    </div>
                </label>
            </div>
        `).join('');
    }

    renderAlerts() {
        const list = document.getElementById('alertsList');
        
        if (this.alerts.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✨</div><p>No alerts yet</p></div>';
            return;
        }

        list.innerHTML = this.alerts.map(alert => {
            const timeAgo = this.getTimeAgo(alert.timestamp);
            return `
                <div class="alert-card triggered">
                    <div class="flex-between">
                        <div>
                            <div style="font-weight: 600; color: #00d4aa;">${alert.symbol}</div>
                            <div style="margin-top: 4px;">${alert.message}</div>
                            <div style="margin-top: 8px; font-size: 13px; color: #64748b;">
                                Price: $${alert.price} | RSI: ${alert.rsi}
                            </div>
                        </div>
                        <button class="danger" style="padding: 8px 12px; font-size: 12px;" onclick="app.removeAlert(${alert.id})">Delete</button>
                    </div>
                    <div class="alert-time">${timeAgo}</div>
                </div>
            `;
        }).join('');
    }

    removeAlert(id) {
        this.alerts = this.alerts.filter(a => a.id !== id);
        this.saveToStorage();
        this.updateUI();
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    render() {
        document.getElementById('checkInterval').value = this.settings.checkInterval;
        document.getElementById('rsiBuy').value = this.settings.rsiBuy;
        document.getElementById('rsiSell').value = this.settings.rsiSell;
        document.getElementById('autoDiscovery').checked = this.settings.autoDiscovery;
        
        this.updateUI();

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// Initialize app
const app = new CryptoMonitorApp();
