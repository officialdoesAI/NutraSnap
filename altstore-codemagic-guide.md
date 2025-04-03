# NutriLens: Guide for Building Unsigned IPA with Codemagic

This guide will help you build an unsigned IPA file for your NutriLens app using Codemagic, which you can then sign and install with AltStore.

## Step 1: Set Up Your Build in Codemagic

1. Log in to [Codemagic](https://codemagic.io)
2. Go to your NutraSnap repository
3. Click on "Start your first build" (or "Start new build" if you've already set up a workflow)

## Step 2: Configure the Build

1. Select the "altstore-build" workflow
2. Choose the "main" branch
3. You can leave Environment Variables empty since we're skipping code signing
4. Click "Start build"

## Step 3: Monitor the Build

1. Wait for the build to complete (it will take a few minutes)
2. The build goes through several steps:
   - Installing dependencies
   - Building the web app
   - Setting up Capacitor
   - Creating an unsigned IPA file

## Step 4: Get the Unsigned IPA

1. Once the build completes, go to the "Artifacts" tab
2. Look for a file named "App.ipa" or similar
3. Download this IPA file to your computer

## Step 5: Sign and Install with AltStore

1. Make sure AltStore is installed on your iOS device
2. Connect your iOS device to your computer
3. Make sure AltServer is running on your computer
4. Open AltStore on your device
5. Go to "My Apps" tab
6. Tap the "+" button in the top-left
7. Select the downloaded IPA file
8. AltStore will sign and install the app with your Apple ID

## Troubleshooting

### IPA Not Generated

If the IPA file isn't generated:

1. Check the build logs for errors
2. The workflow tries multiple fallback approaches if the primary method fails
3. Look for specific Xcode errors in the logs

### AltStore Can't Install the App

If AltStore has trouble installing the app:

1. Make sure AltStore and AltServer are updated to the latest version
2. Ensure AltServer is running and your devices are on the same network
3. Try restarting AltServer
4. Check that you have available app slots (free Apple ID allows up to 3 sideloaded apps)

### App Crashes on Launch

If the app installs but crashes when opened:

1. The app might require specific entitlements that are missing
2. Try installing as a PWA instead:
   - Open the web app in Safari on your iOS device
   - Tap the Share button
   - Select "Add to Home Screen"

## Alternative: PWA Installation

If you continue to have issues with AltStore installation, you can always use the PWA method:

1. Open Safari on your iOS device
2. Visit your deployed web app URL
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will be installed as a PWA with most functionality intact

While the PWA method doesn't provide 100% native features, it's a reliable fallback that works with any Apple ID.