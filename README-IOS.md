# NutriLens iOS App Installation Guide

This guide will help you install the NutriLens iOS app using AltStore on your iPhone or iPad.

## Prerequisites

1. AltStore installed on your iOS device
   - [AltStore Installation Guide](https://altstore.io/)
   - You will need a Mac or PC to install AltStore

2. The NutriLens IPA file downloaded from Codemagic build

## Installation Steps

### Option 1: Install via AltStore on your iOS device

1. **Transfer the IPA file to your iOS device**
   - You can use AirDrop, iCloud Drive, or email to transfer the IPA file to your iOS device

2. **Open AltStore on your iOS device**
   - Go to the "My Apps" tab
   - Tap the "+" button in the top left corner
   - Select the NutriLens IPA file from your Files app
   - Wait for the installation to complete

3. **Trust the app**
   - If necessary, go to Settings > General > Device Management
   - Find the profile related to AltStore and trust it

### Option 2: Build the app yourself using Xcode

1. **Prerequisites**
   - A Mac computer
   - Xcode installed
   - Apple Developer account (free or paid)
   - iOS device (iPhone/iPad)

2. **Prepare the project**
   - Extract the `nutritlens-ios.zip` file
   - Open the `ios/App/App.xcworkspace` file in Xcode

3. **Configure the app for your account**
   - In Xcode, click on the "App" project in the Project Navigator
   - Select the "App" target
   - Go to the "Signing & Capabilities" tab
   - Check "Automatically manage signing"
   - Select your team (Apple ID)

4. **Build and run**
   - Connect your iOS device to your Mac
   - Select your device from the device dropdown in Xcode
   - Click the "Play" button to build and run
   - Wait for the build process to complete and the app to install

## Troubleshooting White Screen Issues

If you encounter a white screen when opening the app:

1. **Check that you're using the latest build**
   - Make sure you're using the most recent IPA file built with the latest code

2. **Force close and restart the app**
   - Swipe up from the bottom of the screen (or double-click home button on older devices)
   - Swipe the app up to close it
   - Reopen the app

3. **Check internet connectivity**
   - The app requires an internet connection to function properly
   - Ensure your device is connected to WiFi or has cellular data enabled

4. **Reset app permissions**
   - Go to Settings > NutriLens
   - Reset permissions and enable them again when prompted

5. **Reinstall the app**
   - Delete the app from your device
   - Install it again following the steps above

## Camera Usage

The app requires camera permissions to analyze food. When prompted, please allow camera access for the full functionality of the app.

## Support

If you encounter any issues, please contact support at ofclshorts@gmail.com with:
- Your iOS device model
- iOS version
- A screenshot of the issue (if possible)
- Steps to reproduce the problem