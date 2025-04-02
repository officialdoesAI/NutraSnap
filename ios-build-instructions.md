# NutriLens iOS App Build Instructions

This document provides instructions for building and distributing the NutriLens iOS app using AltStore.

## Requirements

- A Mac computer with macOS 10.15 or later
- Xcode 12 or later
- Node.js 14 or later
- An Apple Developer account (free or paid)
- AltStore installed on your iOS device

## Setup Steps

### 1. Clone and Install Dependencies

First, clone the repository and install all the dependencies:

```bash
git clone <repository-url>
cd nutritlens
npm install
```

### 2. Build the Web App

Build the web app for production:

```bash
npm run build
```

### 3. Add iOS Platform

Add the iOS platform to your Capacitor project:

```bash
npx cap add ios
```

### 4. Sync the Build with Capacitor

Sync the build with Capacitor to update the native iOS project:

```bash
npx cap sync
```

### 5. Open the Project in Xcode

Open the iOS project in Xcode:

```bash
npx cap open ios
```

### 6. Configure Signing in Xcode

Once in Xcode:

1. Select the project in the Project Navigator
2. Select the "NutriLens" target
3. Go to the "Signing & Capabilities" tab
4. Sign in with your Apple ID
5. Choose a development team (your personal team is fine for AltStore)
6. Ensure the Bundle Identifier matches what's in your Capacitor config (io.nutritlens.app)

### 7. Build the .ipa File for AltStore

To build for AltStore:

1. In Xcode, select "Any iOS Device" as the build target
2. Go to Product > Archive
3. Once the archive is complete, click "Distribute App"
4. Select "Development" distribution
5. Sign the app with your development certificate
6. Save the .ipa file to a known location

### 8. Install via AltStore

To install the app using AltStore:

1. Connect your iPhone to your computer via cable or make sure both are on the same Wi-Fi network
2. Open AltServer on your computer
3. In AltStore on your iOS device, go to "My Apps" tab
4. Tap the "+" icon in the top-left corner
5. Browse to and select your .ipa file
6. AltStore will install the app on your device

### Additional Notes for Developers

- The app uses Capacitor to bridge the web app to native functionality
- Camera functionality is implemented to work in both web and native contexts
- AltStore-signed apps need to be refreshed every 7 days (or 1 year with a paid developer account)
- Remember to increment the build number in capacitor.config.ts when making updates

## Troubleshooting

- If you encounter build errors in Xcode, make sure all required permissions are properly configured in Info.plist
- Camera permissions are set up in the Capacitor config and should work automatically
- If you see network errors when testing, check that the app is properly configured to access your API server

## Updating the App

When you need to update the app:

1. Make your changes to the web app
2. Run `npm run build` to rebuild the web app
3. Run `npx cap sync` to update the native project
4. Open Xcode and increment the build number
5. Archive and distribute a new .ipa file
6. Install via AltStore as before