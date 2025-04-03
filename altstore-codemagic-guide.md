# NutriLens: Guide for Building & Installing with AltStore

This guide will help you build, download, and install the NutriLens app using Codemagic and AltStore.

## Step 1: Start the Build in Codemagic

1. Log in to [Codemagic](https://codemagic.io)
2. Go to your NutraSnap repository
3. Click on "Start new build"
4. Select the "altstore-build" workflow
5. Choose the "main" branch
6. Click "Start build"

## Step 2: Get the IPA File (3 Easy Options)

After the build completes, you have multiple ways to download the IPA file:

### Option 1: Download Link File (Easiest)
1. In the build artifacts, find and download the `download-link.txt` file
2. Open this text file to find a direct download URL to the IPA
3. The URL is valid for 14 days and can be opened on any device

### Option 2: HTML Download Page
1. In the build artifacts, download the `AltStore-Package/index.html` file
2. Open this HTML file in any browser
3. Click the download button to get the IPA file

### Option 3: Direct Download from Artifacts
1. Go to the "Artifacts" tab after the build completes
2. Look for `NutriLens.ipa` in the list
3. Download this file directly to your computer

## Step 3: Install Using AltStore

### Preparation
1. Make sure you have [AltStore](https://altstore.io/) installed on your iOS device
2. Ensure AltServer is running on your computer
3. Connect your iPhone to the same WiFi network as your computer

### Installation Steps
1. Transfer the IPA to your computer (if you downloaded on another device)
2. Open AltStore on your iOS device
3. Go to the "My Apps" tab
4. Tap the "+" button in the top-left corner
5. Navigate to and select the NutriLens.ipa file
6. Wait while AltStore signs and installs the app
7. Once installed, you can open NutriLens from your home screen

## Troubleshooting

### "Cannot Download IPA" Issues
If you're having trouble downloading the IPA file directly on your iOS device:
1. Use the `download-link.txt` method and open the link on your computer
2. Download the IPA file to your computer first, then use AltStore to install

### AltStore Installation Problems
If AltStore has trouble installing the app:
1. Make sure AltServer is running and visible in your computer's taskbar/menu bar
2. Ensure your device and computer are on the same WiFi network
3. Restart AltServer and try again
4. Check that you have available app slots (free Apple ID allows up to 3 sideloaded apps)

### App Crashes on Launch
If the app installs but crashes when opened:
1. Make sure you're using AltStore to install (direct installation without signing won't work)
2. Try installing as a PWA instead:
   - Open the web version of NutriLens in Safari
   - Tap the Share button
   - Select "Add to Home Screen"

## Alternative: PWA Installation
If you continue to have issues with AltStore installation, you can always use the PWA method:
1. Open Safari on your iOS device
2. Visit the NutriLens web app URL
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will be installed as a PWA with most functionality intact

While the PWA method doesn't provide 100% of the native features (like background camera access), it's a reliable option that works with any Apple ID and doesn't require computer connection.