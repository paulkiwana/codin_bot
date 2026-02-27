# 📱 Crypto Monitor Mobile App

A React Native mobile application for monitoring cryptocurrency prices with real-time alerts based on technical analysis (Support/Resistance levels and RSI indicators).

## 🎯 Features

- ✅ **Real-time Price Monitoring** - Track multiple cryptocurrencies simultaneously
- ✅ **Support/Resistance Detection** - Automatically identifies key price levels
- ✅ **RSI Monitoring** - Tracks RSI(6) on 4-hour and daily timeframes
- ✅ **Push Notifications** - Get instant alerts on your mobile device
- ✅ **Auto-Discovery** - Automatically find high-volume trading pairs
- ✅ **Beautiful Dark UI** - Modern, easy-to-use interface
- ✅ **Offline Storage** - Settings and alerts saved locally
- ✅ **Customizable Thresholds** - Configure alerts to your preferences

## 📸 Screenshots

The app includes three main screens:
- **Dashboard** - Real-time market overview with price and indicators
- **Alerts** - History of all triggered alerts
- **Settings** - Configure symbols, thresholds, and monitoring options

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (will be installed automatically)
- For Android APK: Expo account (free)

### Installation

1. **Navigate to the mobile app directory:**
```bash
cd crypto-monitor-mobile
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

4. **Run on your device:**
   - Install "Expo Go" app on your phone (iOS/Android)
   - Scan the QR code shown in terminal
   - The app will load on your device

## 📦 Building APK for Android

### Method 1: Using Expo EAS (Recommended)

1. **Install EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login to Expo:**
```bash
eas login
```

3. **Configure the project:**
```bash
eas build:configure
```

4. **Build the APK:**
```bash
npm run build:apk
```

Or directly:
```bash
eas build -p android --profile preview
```

5. **Download the APK:**
   - After build completes, you'll get a download link
   - Download the APK to your computer
   - Transfer to your Android device
   - Install and enjoy!

### Method 2: Local Build (Advanced)

1. **Install Android Studio and SDK**

2. **Build locally:**
```bash
eas build --platform android --local
```

## 🔧 Configuration

The app stores configuration locally on your device. You can configure:

### Monitoring Symbols
- Add/remove cryptocurrency pairs manually
- Use auto-discovery to find top volume coins
- Supports any symbol available on Binance

### Alert Thresholds
- **RSI Overbought**: Default 90 (triggers when RSI > 90)
- **RSI Oversold**: Default 10 (triggers when RSI < 10)
- **S/R Threshold**: Default 2% (price proximity to support/resistance)

### Monitoring Settings
- **Check Interval**: How often to check prices (default: 300 seconds)
- **Quote Currencies**: Which quote currencies to use (USDT, USD, BTC, etc.)
- **Min Volume**: Minimum 24h volume for auto-discovery
- **Max Symbols**: Maximum number of symbols to monitor

## 📱 How to Use

1. **Start Monitoring:**
   - Open the app
   - Go to Settings and add symbols (or use Auto-Discover)
   - Return to Dashboard
   - Tap "Start" button

2. **Receive Alerts:**
   - Keep the app running in background
   - You'll receive push notifications when conditions are met
   - View alert history in the Alerts tab

3. **Customize Settings:**
   - Adjust RSI thresholds based on your strategy
   - Change check interval (longer = less battery usage)
   - Add/remove symbols as needed

## 🔔 Alert Conditions

An alert is triggered when **BOTH** conditions are met:

1. **Price is near Support or Resistance**
   - Calculated from 1-week and 1-month timeframes
   - Within configured threshold (default 2%)

2. **RSI shows extreme conditions**
   - **Oversold**: RSI(6) > 90 on 4H or 1D timeframe
   - **Overbought**: RSI(6) < 10 on 4H or 1D timeframe

## 🛠️ Technical Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build tooling
- **React Navigation** - Navigation between screens
- **React Native Paper** - Material Design UI components
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local data persistence
- **Expo Notifications** - Push notification system

## 📊 API Integration

The app uses Binance public API (no authentication required):
- Real-time price data
- Historical OHLCV data
- 24-hour statistics
- Market tickers

No API keys needed - all data is publicly available.

## 🔒 Privacy & Security

- ✅ No user accounts required
- ✅ No personal data collected
- ✅ All data stored locally on your device
- ✅ No trading capabilities (read-only)
- ✅ Open source code

## 🐛 Troubleshooting

### App won't start
- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Notifications not working
- Grant notification permissions in device settings
- Ensure app is not in battery optimization mode
- Test on physical device (notifications don't work in simulator)

### Build fails
- Ensure you're logged into Expo: `eas login`
- Check your internet connection
- Try building again (sometimes servers are busy)

### Symbols not loading
- Check internet connection
- Binance API might be rate-limited (wait a few minutes)
- Try different symbols

## 📝 Development

### Project Structure
```
crypto-monitor-mobile/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── eas.json                    # Build configuration
├── package.json                # Dependencies
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.js  # Main dashboard
│   │   ├── AlertsScreen.js     # Alert history
│   │   └── SettingsScreen.js   # Configuration
│   ├── services/
│   │   └── CryptoService.js    # API and analysis logic
│   └── context/
│       └── MonitoringContext.js # State management
└── assets/                     # Icons and images
```

### Running in Development
```bash
npm start          # Start Expo dev server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

## 🚢 Distribution

### Sharing the APK

After building:
1. Download the APK from Expo
2. Upload to cloud storage (Google Drive, Dropbox, etc.)
3. Share the link with users
4. Users download and install on Android devices

### Publishing to Google Play Store

1. Build production version:
```bash
eas build -p android --profile production
```

2. Follow Google Play Console submission process
3. App will be available in Play Store

## ⚠️ Disclaimer

This tool is for **informational and educational purposes only**:
- Not financial, investment, or trading advice
- Cryptocurrency trading carries significant risk
- No guarantees of accuracy or profitability
- Always do your own research (DYOR)
- Only invest what you can afford to lose

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review Expo documentation
- Check React Native documentation

## 🎉 Credits

Built with:
- React Native & Expo
- Binance API
- React Native Paper
- React Navigation

---

**Happy Trading! 🚀📈**

*Remember: This is a monitoring tool, not a trading bot. Always make informed decisions and manage your risk appropriately.*
