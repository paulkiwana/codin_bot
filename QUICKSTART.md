# Quick Start Guide

Get your Crypto Monitor app live and installed on your phone in 5 minutes!

## Step 1: Deploy (2 minutes)

### Option A: Vercel (Recommended - Easiest)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Deploy"
6. Wait for deployment to complete
7. **Copy the URL** (looks like `https://your-project.vercel.app`)

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add New Site"
3. Select "Connect to Git"
4. Choose your GitHub repo
5. Deploy settings are auto-detected
6. Click "Deploy"

### Option C: GitHub Pages

1. Update `next.config.mjs` to use `output: 'export'`
2. Push changes
3. Go to repository Settings → Pages
4. Select deploy from branch
5. Choose `gh-pages` branch

## Step 2: Test on Phone (1 minute)

1. On your **Android or iPhone**, open **Chrome** or **Safari**
2. Visit your deployed app URL (from Step 1)
3. You should see the Crypto Monitor dashboard

## Step 3: Install as App (1 minute)

### Android (Chrome):
1. Look for the **Install** button at the bottom
2. Or tap menu (⋮) → "Install app"
3. Tap "Install"
4. App appears on your home screen!

### iPhone (Safari):
1. Tap the Share button (⬆️)
2. Scroll down and select **"Add to Home Screen"**
3. Tap "Add"
4. App appears on your home screen!

### Desktop:
1. Open in Chrome
2. Click the install icon (⊞) in the address bar
3. Confirm installation
4. Opens as standalone window

## Step 4: Start Using (1 minute)

1. **Allow Notifications**
   - When prompted, click "Allow"
   - This enables price alerts

2. **Add Your First Crypto**
   - Click the "+" button
   - Name: `Bitcoin`
   - Pair: `BTC`
   - Support: `40000`
   - Resistance: `50000`
   - RSI: `30`
   - Click "Add"

3. **Start Monitoring**
   - Click the play button (▶) at the top
   - You're now monitoring prices!
   - Status shows "🔴 Monitoring"

4. **Wait for Alerts**
   - App checks prices every 5 minutes
   - When price breaches your levels or RSI triggers
   - You'll get a notification! 🔔

## Understanding the Dashboard

**Top Section:**
- Play/Stop button to control monitoring
- Status showing active symbols
- Last update time

**Symbol Cards:**
- Show current price and 24h change (% green/red)
- RSI indicator (30=oversold, 70=overbought)
- Support/Resistance levels
- Status (Support, Neutral, Resistance)
- Toggle power icon to enable/disable

**Bottom Navigation:**
- 📊 Dashboard: Monitor prices
- 🔔 Alerts: View triggered opportunities
- ⚙️ Settings: Configure app

## Understanding Alerts

You get alerts when:

1. **Price Breaches Support**
   - Price drops below your support level
   - Signal: Potential bounce/strong downtrend

2. **Price Breaches Resistance**
   - Price rises above your resistance level
   - Signal: Potential pullback/strong uptrend

3. **RSI Oversold** (RSI < threshold)
   - RSI drops below your threshold (usually 30)
   - Signal: Extreme selling pressure, bounce likely

4. **RSI Overbought** (RSI > 100-threshold)
   - RSI rises above 70 (with 30 threshold)
   - Signal: Extreme buying pressure, pullback likely

## Tips for Success

### Choose Good Levels
- **Support**: Recent price floor
- **Resistance**: Recent price ceiling
- **RSI Threshold**: Use 30 (standard oversold)

### Monitor Smart
- Start with 2-3 cryptocurrencies
- Use realistic support/resistance
- Check alerts when you can respond
- Don't overwhelm yourself

### Manage Notifications
- Settings → Enable notifications
- You won't miss opportunities!
- Mark alerts as read to keep track

### Backup Your Data
- Settings → Export Data (regularly!)
- Save the JSON file somewhere safe
- Import if you reinstall

## Common First-Time Issues

**"Install button not showing"**
- Make sure your deployment is HTTPS
- Refresh the page
- Try a different browser

**"No notifications"**
- Settings → Enable notifications
- Allow when browser asks
- Restart the app

**"Can't add cryptocurrency"**
- Click "Check" to validate the pair
- Try popular symbols: BTC, ETH, SOL, DOGE
- Check your internet connection

**"Data disappeared"**
- Settings → Import Data (if you exported)
- Or add your cryptocurrencies again
- Browser might have cleared storage

## What Happens Next?

1. **App runs on your home screen** - Like a native app!
2. **You get price alerts** - Notifications when opportunities occur
3. **Data syncs locally** - Everything stays on your phone
4. **Works offline** - Can view cached data without internet

## Advanced: Custom Domain

Want a custom domain like `crypto.yourname.com`?

1. Buy domain from any registrar
2. Go to Vercel project settings
3. Add custom domain
4. Update DNS records (Vercel shows how)
5. Done! More professional look

## Sharing With Others

**Send them your URL:**
```
https://your-project.vercel.app
```

They can:
1. Visit on their phone
2. Click install
3. App on their home screen
4. No app store needed!

## Updating Your App

When you make changes:
1. Commit and push to GitHub
2. Vercel auto-deploys
3. Users close and reopen the app
4. New version loads automatically
5. No manual updates needed!

## Need Help?

- Check `README.md` for detailed documentation
- Read `CHROME_APP_GUIDE.md` for installation details
- Check your deployment logs for errors
- Make sure all files are properly deployed

## You're All Set! 🚀

Your crypto monitor is:
- ✅ Deployed live on the internet
- ✅ Installed as a Chrome app on your phone
- ✅ Ready to send you price alerts
- ✅ Fully customizable and offline-capable

**Start monitoring cryptocurrencies and never miss a trading opportunity!**

---

Next: Customize your cryptocurrencies and set up your perfect monitoring configuration!
