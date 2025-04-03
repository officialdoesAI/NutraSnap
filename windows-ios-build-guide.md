# Building the NutriLens iOS App on Windows

This guide explains how to build and install the NutriLens iOS app on your device using Windows.

## Option 1: Using AltStore (Recommended)

AltStore is a third-party app store that allows installing unsigned apps on non-jailbroken iOS devices.

### Prerequisites
- Windows PC
- iOS device with iOS 12.2 or later
- Apple ID (you don't need a paid developer account)
- iTunes or iCloud for Windows installed
- [AltServer for Windows](https://altstore.io/)

### Steps:

1. **Extract the iOS Project**
   - Download the `nutritlens-ios.zip` from this Replit project
   - Extract it to a folder on your Windows computer

2. **Install AltServer on Windows**
   - Download and install AltServer from [altstore.io](https://altstore.io/)
   - Launch AltServer (it appears in the system tray)

3. **Install AltStore on your iOS Device**
   - Connect your iOS device to your computer with a USB cable
   - Make sure iTunes or iCloud is running and can recognize your device
   - Click on the AltServer icon in the system tray
   - Select "Install AltStore" and choose your device
   - Enter your Apple ID and password when prompted

4. **Trust AltStore on your iOS Device**
   - On your iOS device, go to Settings > General > Device Management
   - Tap on your Apple ID and "Trust" the developer

5. **Option A: Build IPA with SignTools**
   - Visit [ios-signer-service](https://github.com/SignTools/ios-signer-service) and follow the instructions to convert the Xcode project to an IPA file
   - This is a self-hosted service you can run on your Windows PC

6. **Option B: Use a Mac in the Cloud Service**
   - Sign up for a service like [MacinCloud](https://www.macincloud.com/) or [MacStadium](https://www.macstadium.com/)
   - Upload the Xcode project
   - Build an IPA file
   - Download the IPA to your Windows computer

7. **Install the IPA using AltStore**
   - Open AltStore on your iOS device
   - Tap the "+" button in My Apps
   - Select the IPA file you built
   - AltStore will install the app on your device

8. **Important Note About Certificate Expiration**
   - Apps installed with AltStore need to be refreshed every 7 days
   - Keep AltServer running on your PC and connect to the same WiFi as your iOS device to refresh automatically

## Option 2: Using a Build Service

Several online services can build iOS apps without requiring a Mac:

1. **AppCenter by Microsoft**
   - Sign up at [appcenter.ms](https://appcenter.ms/)
   - Create a new app project
   - Upload the iOS folder from the extracted zip
   - Configure the build settings
   - Download the resulting IPA file
   - Install using AltStore as described above

2. **Appetize.io for Testing**
   - If you just want to test the app without installing, [Appetize.io](https://appetize.io/) provides iOS simulator access through the browser
   - Upload your app folder
   - Test your app in a virtual iOS environment

## Troubleshooting

### Missing Provisioning Profile
If you encounter errors about missing provisioning profiles:
- In AltStore, go to Settings and make sure your Apple ID is correctly entered
- Make sure you're using a personal Apple ID, not a managed one

### App Won't Launch
If the app installs but crashes when opening:
- Check device logs through AltStore
- Make sure your Apple ID doesn't have two-factor authentication enabled, or use an app-specific password

### Code Signing Errors
- These usually happen because your Apple ID doesn't have the proper entitlements
- Try using a different Apple ID that hasn't been used for development before

## Maintenance Requirements

Remember that apps installed through AltStore need to be refreshed every 7 days or they will stop working. To refresh:
- Keep AltServer running on your PC
- Connect your iOS device to the same WiFi network as your PC regularly
- AltStore will try to refresh apps in the background

For a more permanent solution, you would need either:
1. An Apple Developer account ($99/year) to distribute through TestFlight
2. Distribute through the App Store (requires Apple Developer account and app review)