# 🔨 Build Instructions - Crypto Monitor Mobile

Complete step-by-step guide to build a shareable Android APK.

## 📋 Prerequisites

Before you start, ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm or yarn package manager
- ✅ Internet connection
- ✅ Expo account (free - create at expo.dev)

## 🚀 Step-by-Step Build Process

### Step 1: Install Dependencies

Open terminal/command prompt in the `crypto-monitor-mobile` folder:

```bash
cd crypto-monitor-mobile
npm install
```

This will install all required packages (~5 minutes).

### Step 2: Test the App Locally (Optional but Recommended)

Before building, test the app works:

```bash
npm start
```

- Install "Expo Go" app on your phone
- Scan the QR code
- Test the app functionality
- Press Ctrl+C to stop when done

### Step 3: Install Expo EAS CLI

Install the Expo build tool globally:

```bash
npm install -g eas-cli
```

### Step 4: Login to Expo

Create a free account at [expo.dev](https://expo.dev) if you don't have one, then login:

```bash
eas login
```

Enter your username and password.

### Step 5: Configure Build

Initialize the build configuration:

```bash
eas build:configure
```

This creates/updates the `eas.json` file (already included in the project).

### Step 6: Build the APK

Now build the Android APK:

```bash
eas build -p android --profile preview
```

Or use the npm script:

```bash
npm run build:apk
```

**What happens:**
1. Code is uploaded to Expo servers
2. Build runs on Expo infrastructure (free tier available)
3. Takes 10-20 minutes typically
4. You'll see progress in terminal

**Build Output:**
```
✔ Build finished
APK: https://expo.dev/artifacts/eas/[unique-id].apk
```

### Step 7: Download the APK

When build completes:
1. Click the link provided in terminal
2. Download the APK file to your computer
3. File will be named something like: `build-[id].apk`

### Step 8: Install on Android Device

**Method A: Direct Install**
1. Transfer APK to your Android device (USB, email, cloud storage)
2. Open the APK file on your device
3. Allow "Install from Unknown Sources" if prompted
4. Tap "Install"
5. Open the app!

**Method B: Share via Link**
1. Upload APK to Google Drive, Dropbox, or any file host
2. Share the link with users
3. Users download and install

## 🎯 Quick Build Command Reference

```bash
# Full build process in one go
cd crypto-monitor-mobile
npm install
eas login
eas build -p android --profile preview

# Alternative: Use npm script
npm run build:apk
```

## 🔧 Build Profiles Explained

The project includes three build profiles in `eas.json`:

### 1. Preview (Recommended for Sharing)
```bash
eas build -p android --profile preview
```
- Builds APK file (easy to share)
- No Google Play signing
- Perfect for testing and distribution outside Play Store
- **Use this for shareable APK**

### 2. Production (For Play Store)
```bash
eas build -p android --profile production
```
- Builds AAB (Android App Bundle)
- Required for Google Play Store
- Optimized file size
- Use when publishing to Play Store

### 3. Development
```bash
eas build -p android --profile development
```
- Development build with debugging tools
- Larger file size
- For developers only

## 📱 Testing the APK

After installing on your device:

1. **Grant Permissions:**
   - Allow notifications when prompted
   - Allow internet access (automatic)

2. **Configure the App:**
   - Open Settings tab
   - Add symbols (or use Auto-Discover)
   - Adjust thresholds if needed
   - Save settings

3. **Start Monitoring:**
   - Go to Dashboard
   - Tap "Start" button
   - App will check prices at configured interval

4. **Test Notifications:**
   - Keep app running in background
   - Wait for alert conditions
   - You should receive push notifications

## 🐛 Troubleshooting

### Build Fails: "Not logged in"
```bash
eas login
```
Make sure you're logged into your Expo account.

### Build Fails: "Project not configured"
```bash
eas build:configure
```
Run this to set up build configuration.

### Build Fails: "Invalid credentials"
```bash
eas logout
eas login
```
Logout and login again.

### Build Takes Forever
- Expo free tier can be slow during peak times
- Typical build: 10-20 minutes
- Check build status: `eas build:list`

### Can't Install APK on Device
1. Enable "Install from Unknown Sources" in Android settings
2. Go to Settings > Security > Unknown Sources
3. Enable for your file manager or browser

### App Crashes on Startup
- Make sure you built with `--profile preview` (not development)
- Check Android version (requires Android 5.0+)
- Try uninstalling and reinstalling

### Notifications Don't Work
- Grant notification permissions in device settings
- Disable battery optimization for the app
- Notifications only work on physical devices (not emulators)

## 💰 Build Costs

**Expo EAS Build Pricing:**
- **Free Tier**: 30 builds/month (plenty for personal use)
- **Paid Plans**: Unlimited builds, faster queue, priority support

For most users, the free tier is sufficient.

## 🔄 Updating the App

When you make changes and want to rebuild:

1. **Update version in app.json:**
```json
{
  "expo": {
    "version": "1.0.1"  // Increment this
  }
}
```

2. **Build new APK:**
```bash
eas build -p android --profile preview
```

3. **Distribute new APK to users**

## 📦 Alternative: Build Locally (Advanced)

If you prefer to build on your own machine:

### Requirements:
- Android Studio installed
- Android SDK configured
- Java JDK installed

### Build Command:
```bash
eas build --platform android --local
```

**Note:** Local builds are more complex and require significant setup. Cloud builds (default) are recommended.

## 🌐 Building for iOS (Bonus)

To build for iPhone/iPad:

```bash
eas build -p ios --profile preview
```

**Requirements:**
- Apple Developer account ($99/year)
- Mac computer (for some steps)

## 📤 Distribution Options

### Option 1: Direct APK Sharing (Easiest)
- Upload APK to Google Drive, Dropbox, etc.
- Share download link
- Users install directly

### Option 2: Google Play Store (Official)
1. Create Google Play Developer account ($25 one-time)
2. Build production version:
   ```bash
   eas build -p android --profile production
   ```
3. Upload AAB to Play Console
4. Complete store listing
5. Submit for review
6. App available in Play Store

### Option 3: Internal Distribution
- Use Expo's internal distribution
- Share via TestFlight (iOS) or internal testing (Android)
- Good for beta testing

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Forums](https://forums.expo.dev/)

## ✅ Checklist for First Build

- [ ] Node.js installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Expo account created
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into Expo (`eas login`)
- [ ] Build started (`eas build -p android --profile preview`)
- [ ] APK downloaded
- [ ] APK tested on device
- [ ] APK shared with users

## 🎉 Success!

Once you complete these steps, you'll have:
- ✅ A shareable Android APK
- ✅ Ability to distribute to unlimited users
- ✅ Full control over updates
- ✅ No app store approval needed

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Expo documentation
3. Check Expo forums for similar issues
4. Ensure all prerequisites are met

---

**Happy Building! 🚀**

*Remember: The first build takes longest. Subsequent builds are faster as you get familiar with the process.*
