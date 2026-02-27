# Installing Crypto Monitor as a Chrome App

This guide explains how to install your Crypto Monitor web app as a native-like Chrome app on your phone, tablet, or desktop.

## What is a PWA (Progressive Web App)?

A Progressive Web App is a web app that works like a native app:
- ✅ Installable on home screen
- ✅ Works offline
- ✅ Sends notifications
- ✅ Full-screen experience
- ✅ No app store needed

## Installation on Phone (Android/iOS)

### Android with Chrome

1. **Visit the App**
   - Open Chrome on your Android device
   - Navigate to your Crypto Monitor URL

2. **Install the App**
   - You'll see an "Install" prompt at the bottom
   - Or tap the menu (⋮) → "Install app"
   - Confirm the installation

3. **Find Your App**
   - The app appears on your home screen
   - Tap to launch - it opens like a native app!
   - Swipe up to see the app in your drawer

4. **Grant Permissions**
   - Allow notifications when prompted
   - This enables price alerts

### iOS with Chrome/Safari

**Chrome:**
1. Open in Chrome
2. Tap the menu (⋮) → "Add to Home Screen"
3. Name your app and tap "Add"

**Safari (Recommended for iOS):**
1. Open in Safari
2. Tap the share button (⬆️)
3. Scroll and select "Add to Home Screen"
4. Name your app and tap "Add"

## Installation on Desktop

### Chrome Desktop

1. **Open the App in Chrome**
   - Navigate to your Crypto Monitor URL
   - Make sure you're using Chrome

2. **Install**
   - Look for the install icon (⊞) in the address bar
   - Click it and confirm

3. **Launch**
   - Find "Crypto Monitor" in your applications
   - Or use it from Chrome's app launcher

### Edge Browser

1. Click the install icon (⊞) in the address bar
2. Follow the prompts
3. App opens in a standalone window

## Deployment Steps

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy crypto monitor app"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Your app is live! 🎉

3. **Share Your Link**
   - Copy the Vercel deployment URL
   - Share with users to install

### Deploy to Other Platforms

**Netlify:**
- Connect GitHub repo
- Auto-deploys on push
- Generates public URL

**Firebase Hosting:**
- Run `firebase init`
- Configure and deploy
- Custom domain support

**GitHub Pages:**
- Enable Pages in repo settings
- Deploy to `gh-pages` branch

## Usage After Installation

### Opening the App
- Click the icon on your home screen (mobile) or app drawer
- Opens in full-screen mode
- No browser chrome/address bar

### Using Features

**Dashboard Tab**
- See all monitored cryptocurrencies
- Click play (▶) to start monitoring
- Click the power icon on each card to enable/disable
- Click "Edit Levels" to modify support/resistance

**Alerts Tab**
- View triggered trading opportunities
- Mark as read or dismiss
- Clear all alerts at once

**Settings Tab**
- Enable notifications (important!)
- Export/import your configuration
- View statistics
- Clear all data if needed

### Permissions

**Notifications**
- You'll be asked to allow notifications
- **Allow** this so you get price alerts
- Can be changed in browser settings later

**Storage**
- App uses your browser's local storage
- About 10MB available
- Data persists between app launches

## Troubleshooting

### App Won't Install

**On Android/iPhone:**
- Make sure you're on the latest Chrome/Safari version
- Try on a different browser
- Clear browser cache and try again

**Issue**: "Install option not showing"
- Not all sites support PWA
- Your Vercel deployment should support it
- Visit Settings → About → Connection should be HTTPS

### Notifications Not Working

1. **Allow Notifications**
   - On first visit, browser asks for permission
   - Click "Allow"
   - If you clicked "Block", re-enable:
     - Android: Settings → Apps → Chrome → Permissions → Notifications → Allow
     - Desktop: Click lock icon in address bar → Permissions → Allow notifications

2. **Test Notification**
   - Go to Settings page
   - Click "Enable" under Notifications
   - You should get a test notification

3. **Still Not Working?**
   - Check if notifications are enabled on your device
   - Try restarting the app
   - Check notification settings for Chrome

### App Opens in Browser Instead of Full-Screen

- This means it's not installed properly
- Uninstall and reinstall
- Make sure your deployment is HTTPS

### Data Not Persisting

- Check browser storage settings
- Don't clear app data in settings
- Browser might be clearing storage (check settings)
- Export data regularly as backup

## Performance Tips

### Make App Faster

1. **Cache Settings**
   - App caches price data for 5 minutes
   - Reduces API calls
   - Improves performance

2. **Monitoring Interval**
   - Checks prices every 5 minutes by default
   - Adjust in MonitoringContext if needed
   - Balance accuracy vs battery usage

3. **Managing Alerts**
   - Old alerts are automatically cleaned up
   - Keeps most recent 100 alerts
   - Prevents storage from filling up

### Battery & Data Usage

- App only fetches data every 5 minutes
- Minimal data usage (API calls only)
- Battery usage similar to other apps
- Works offline with cached data

## Updating Your App

### When You Update Code

1. Push changes to GitHub
2. Vercel auto-deploys (if connected)
3. Users need to:
   - Close the app completely
   - Reopen it (downloads latest version)
   - Or refresh if launched via browser

### Users Never Need To:
- Visit app stores
- Click "Update" buttons
- Reinstall anything
- Changes happen automatically!

## Uninstalling

### Android
- Long-press the app icon
- Select "Uninstall" or "Remove"

### iOS (Chrome)
- Long-press the icon
- Tap "Remove App"

### Desktop
- Right-click the app in your system applications
- Select "Uninstall"

## Sharing Your App

### Share Link
```
https://your-vercel-app.vercel.app
```

Users can:
1. Visit the link on their phone
2. Click install
3. App appears on home screen

### No Approval Needed!
Unlike app stores:
- No submission process
- No 30% cut
- Updates instantly
- You control everything

## Advanced: Custom Domain

1. **Buy a Domain**
   - From any registrar (GoDaddy, Namecheap, etc.)

2. **Connect to Vercel**
   - Go to Vercel project settings
   - Add custom domain
   - Update DNS records (Vercel provides instructions)

3. **Your Users Visit**
   - https://yourapp.com
   - Much more professional!

## FAQ

**Q: Will it work offline?**
A: Yes! Data is cached for 5 minutes, and your configuration persists offline.

**Q: Is my data safe?**
A: Yes, all data stays on your device. No cloud sync means only you can access it.

**Q: Can I use it on web?**
A: Absolutely! Works great in any browser, installed or not.

**Q: How much storage does it use?**
A: Usually 1-5MB depending on alert history. You can clear anytime.

**Q: Can I backup my data?**
A: Yes! Go to Settings → Export Data. You get a JSON file to backup.

**Q: Does it work on iPad?**
A: Yes! Install via Safari using "Add to Home Screen" like on iPhone.

---

## Next Steps

1. ✅ Deploy your app (Vercel recommended)
2. ✅ Test on your phone
3. ✅ Install as Chrome app
4. ✅ Allow notifications
5. ✅ Add your first cryptocurrency
6. ✅ Start monitoring!

**Questions?** Check GitHub issues or the main README.md for support.

Happy monitoring! 🚀📈
