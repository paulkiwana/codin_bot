# Crypto Monitor - Web App

A modern, progressive web app for monitoring cryptocurrency prices with real-time alerts. Install as a Chrome app on your phone, tablet, or desktop.

## Features

✨ **Real-time Monitoring**
- Track cryptocurrency prices from Binance API
- Monitor support/resistance levels
- Track RSI (Relative Strength Index) for overbought/oversold conditions

🔔 **Smart Alerts**
- Receive notifications when prices breach your configured levels
- Track RSI oversold/overbought conditions
- Complete alert history with timestamps

📱 **Installable App**
- Install directly on Chrome for mobile and desktop
- Works offline with cached data
- Native app-like experience

⚙️ **Customizable**
- Add multiple cryptocurrencies
- Set custom support/resistance levels
- Configure RSI thresholds
- Enable/disable monitoring per symbol

💾 **Data Management**
- Export/import your configuration
- Local data persistence
- Clear data when needed

## Getting Started

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deploy to Vercel

The easiest way to deploy is to use Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Click Deploy
4. Your site will be live at a Vercel URL

Then you can:
- Visit the URL on your phone
- Click the install icon in Chrome address bar
- Select "Install app"
- The app will appear on your home screen

## How to Use

### 1. Add Cryptocurrencies
- Click the "+" button on the dashboard
- Enter the cryptocurrency name and trading pair (e.g., BTC, ETH)
- Set support and resistance levels
- Set your RSI threshold (1-50)
- Click "Add"

### 2. Monitor & Alerts
- Start monitoring by clicking the play button
- The app checks prices every 5 minutes
- You'll receive notifications when:
  - Price breaks below support level
  - Price breaks above resistance level
  - RSI drops below your threshold (oversold)
  - RSI rises above your threshold (overbought)

### 3. View Alerts
- Check the Alerts tab to see your alert history
- Mark alerts as read or dismiss them
- Each alert shows the price and RSI at the time of trigger

### 4. Manage Settings
- Export your configuration as JSON backup
- Import previous backups
- Enable/disable notifications
- Delete all data

## Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: next-pwa
- **API**: Binance REST API
- **Storage**: Browser localStorage
- **Notifications**: Web Notifications API

## Data & Privacy

- All data is stored locally in your browser
- No data is sent to any server except Binance API for price data
- You can export and delete your data anytime
- App works offline with cached data

## API Information

This app uses the free Binance API to fetch cryptocurrency data:
- No API key required
- Public data only
- Rate limits apply (check Binance documentation)

## Troubleshooting

### App not installing
- Make sure you're using Chrome or Edge browser
- Visit on HTTPS (required for PWA)
- Check if popup is blocked

### Notifications not working
- Enable notifications when prompted
- Check browser notification settings
- Ensure app has notification permission

### Data not syncing
- Data is stored locally, not in the cloud
- Export your data for backup
- Check browser storage settings

## Development

### Project Structure
```
├── app/                 # Next.js app router pages
├── components/          # React components
├── lib/
│   ├── context/        # React context for state management
│   ├── services/       # Business logic services
│   └── types.ts        # TypeScript type definitions
├── public/             # Static assets and PWA files
└── tailwind.config.ts  # Tailwind CSS configuration
```

### Key Components

- **MonitoringContext**: Manages app state (symbols, alerts, monitoring status)
- **CryptoService**: Handles Binance API calls and calculations
- **StorageService**: Manages localStorage and notifications
- **DashboardCard**: Displays cryptocurrency monitoring card
- **AlertCard**: Displays alert notifications

## Future Enhancements

- [ ] Multiple alert types (email, Telegram)
- [ ] Advanced charting
- [ ] Historical data analysis
- [ ] Watchlist sharing
- [ ] More cryptocurrencies from other exchanges
- [ ] Dark/light theme toggle
- [ ] Multiple user profiles

## License

This project is open source and available under the MIT License.

## Support

For issues, feature requests, or questions:
1. Check the GitHub issues
2. Open a new issue with detailed information
3. Include screenshots and steps to reproduce

---

**Start monitoring crypto prices on your terms. Install as a Chrome app and never miss a trading opportunity!**
