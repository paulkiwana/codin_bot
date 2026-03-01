# Testing Crypto Monitor Locally

## Using Python HTTP Server (Recommended)

Run this command from the project root directory:

```bash
python -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

The app will load and work exactly as it does when deployed. You can:
- Add/remove crypto symbols
- Start/stop monitoring
- View alerts
- Access settings
- Install as PWA (if supported by your OS/browser)

## Using Python 2 (if Python 3 not available)

```bash
python -m SimpleHTTPServer 8000
```

## Accessing the App

- **Desktop**: http://localhost:8000
- **Phone on same network**: http://[your-computer-ip]:8000 (find IP with `ipconfig` on Windows or `ifconfig` on Mac/Linux)

## Testing Features

1. **Real-time Monitoring**: Click "Start Monitoring" to fetch live Binance prices
2. **Add Symbols**: Click "+" to add new cryptocurrencies to monitor
3. **View Alerts**: Switch to "Alerts" tab to see triggered opportunities
4. **Configure**: Adjust RSI thresholds and check intervals in Settings
5. **Data Persists**: Refresh the page - your data stays via localStorage

## Service Worker & Offline

The app registers a service worker at `/sw.js` for offline support:
- Works offline after first load
- Caches API responses
- Shows cached data when no internet

## Deploying to Vercel After Testing

Once working locally:
1. Push changes to GitHub
2. Go to vercel.com and connect your repo
3. It will auto-deploy (no build step needed)
4. Click the PWA install icon to add as Chrome app
