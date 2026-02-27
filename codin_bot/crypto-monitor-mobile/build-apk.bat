@echo off
echo ========================================
echo Crypto Monitor Mobile - Build APK
echo ========================================
echo.
echo This will build an Android APK using Expo EAS.
echo Make sure you have:
echo   - Installed dependencies (run setup.bat)
echo   - Created Expo account (expo.dev)
echo   - Logged in (eas login)
echo.
pause

echo.
echo Starting build process...
echo This will take 15-20 minutes.
echo.
call npm run build:apk

echo.
echo ========================================
echo Build Started!
echo ========================================
echo.
echo Check the terminal for a download link when complete.
echo.
pause
