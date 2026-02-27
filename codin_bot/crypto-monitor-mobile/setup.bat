@echo off
echo ========================================
echo Crypto Monitor Mobile - Setup
echo ========================================
echo.
echo This script will install all dependencies needed for the mobile app.
echo.
pause

echo Installing dependencies...
call npm install

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install Expo CLI globally: npm install -g eas-cli
echo 2. Create account at expo.dev
echo 3. Login: eas login
echo 4. Build APK: npm run build:apk
echo.
echo See BUILD_INSTRUCTIONS.md for detailed guide.
echo.
pause
