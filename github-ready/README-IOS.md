# NutriLens iOS App Build Guide

This document provides instructions for building the NutriLens iOS app from the provided project files.

## Prerequisites

- A Mac computer with macOS Catalina (10.15) or later
- Xcode 12 or later installed from the Mac App Store
- An Apple Developer account (free or paid)
- CocoaPods installed (`sudo gem install cocoapods`)
- Node.js and npm installed

## Getting Started

1. Download and extract the `nutritlens-ios.zip` file to a folder on your Mac.

2. Open Terminal and navigate to the extracted folder:
   ```
   cd path/to/extracted/folder
   ```

3. Install CocoaPods dependencies:
   ```
   cd ios/App
   pod install
   ```
   If you encounter any issues with CocoaPods, try running:
   ```
   pod repo update
   pod install --repo-update
   ```

4. Open the Xcode workspace (not the project file):
   ```
   open App.xcworkspace
   ```

## Configure the Project in Xcode

1. In Xcode, select the "App" project in the Project Navigator
2. Select the "App" target in the left panel
3. Go to the "Signing & Capabilities" tab
4. Sign in with your Apple ID if you haven't already
5. Select your personal team from the dropdown menu
6. Ensure the Bundle Identifier is set to "io.nutritlens.app" (or change it to something unique)

## Building for Your Device

### For Development Testing

1. Connect your iOS device to your Mac with a USB cable
2. In Xcode, select your iOS device from the target device dropdown at the top of the window
3. Click the Play button to build and run the app on your device
4. You may need to trust the developer certificate on your iOS device:
   - On your iOS device, go to Settings > General > Device Management
   - Select your Apple ID and tap "Trust"

### For AltStore Distribution

1. In Xcode, select "Any iOS Device" from the device dropdown
2. From the menu, select Product > Archive
3. When the archive is complete, click "Distribute App"
4. Select "Development" distribution method
5. Select "Export" and choose a location to save the .ipa file
6. Install the .ipa file using AltStore on your iOS device:
   - Make sure AltServer is running on your Mac
   - Connect your iOS device to the same Wi-Fi network
   - In AltStore on your device, go to "My Apps" tab
   - Tap the "+" button and select your .ipa file

## Troubleshooting

- **Build Errors**: If you encounter build errors, make sure all required certificates and provisioning profiles are set up correctly.
- **Camera Access**: Make sure camera permissions are properly configured in Info.plist.
- **Network Errors**: If the app can't connect to the server, check the server URL configuration.

## Note About App Refresh

When installed through AltStore:
- With a free Apple Developer account: App needs to be refreshed every 7 days
- With a paid Apple Developer account: App needs to be refreshed once a year

## Questions and Support

If you have any questions or need help building the app, please contact the development team for assistance.