# Installing NutriLens via AltStore

This guide provides step-by-step instructions for installing the NutriLens app on your iOS device using AltStore from a Windows computer.

## Prerequisites

- Windows PC
- iOS device (iPhone or iPad)
- Lightning cable to connect your device
- Apple ID (free account is sufficient)
- iTunes or iCloud for Windows installed

## Step 1: Install AltServer on your Windows PC

1. Download AltServer from [altstore.io](https://altstore.io/)
2. Install AltServer on your Windows PC
3. Make sure iTunes or iCloud for Windows is also installed and can detect your iOS device

## Step 2: Install AltStore on your iOS device

1. Connect your iOS device to your Windows PC with a cable
2. Launch AltServer (look for it in the system tray)
3. Click on the AltServer icon → Install AltStore → Select your device
4. Enter your Apple ID email and password when prompted
   - This information is sent directly to Apple, not to AltStore developers
   - For extra security, you can use an app-specific password

## Step 3: Trust AltStore on your iOS device

1. On your iOS device, go to Settings → General → Device Management
2. Find your Apple ID and tap it
3. Select "Trust"
4. AltStore should now be available on your home screen

## Step 4: Get the NutriLens IPA file

1. Download the `nutritlens-ios.zip` file from this Replit project
2. Extract the ZIP file on your PC

## Step 5: Generate an IPA file

Since we only have the Xcode project files, you'll need to create an IPA file using one of these options:

### Option A: Use a build service
- Upload the iOS project files to a service like:
  - [AppFlow](https://ionic.io/appflow)
  - [Microsoft App Center](https://appcenter.ms/)
  - [Codemagic](https://codemagic.io/)
- Download the generated IPA file

### Option B: Use SignTools
- Download [ios-app-signer](https://github.com/SignTools/ios-app-signer)
- Follow the instructions to convert the Xcode project to an IPA

## Step 6: Install the app via AltStore

1. Make sure your device and PC are on the same WiFi network
2. Open AltStore on your iOS device
3. Go to the "My Apps" tab
4. Tap the "+" button in the top left corner
5. Browse to and select the NutriLens IPA file
6. Enter your Apple ID credentials if prompted
7. Wait for the installation to complete

## Step 7: Trust the app

1. If you try to open the app and get an "Untrusted Developer" message:
2. Go to Settings → General → Device Management
3. Tap on your Apple ID profile
4. Select "Trust"

## Important Notes

- **7-Day Refresh**: Apps installed via AltStore must be refreshed every 7 days
- **Automatic Refresh**: Keep AltServer running on your PC and connect to the same WiFi network as your iOS device periodically to allow AltStore to refresh apps automatically
- **Updates**: To update the app, you'll need to reinstall it using the same process with the new IPA file

## Troubleshooting

- **Installation Fails**: Make sure your Apple ID doesn't have two-factor authentication or use an app-specific password
- **App Crashes**: Check that all required permissions are properly configured in the app
- **Cannot Connect**: Ensure your PC and iOS device are on the same WiFi network, or try connecting via USB

For additional help, visit [altstore.io/faq](https://altstore.io/faq/)