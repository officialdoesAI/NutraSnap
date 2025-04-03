# Building NutriLens iOS App with Microsoft App Center

This guide explains how to use Microsoft App Center to build an iOS app (.ipa file) from your Capacitor iOS project without needing a Mac.

## Why Microsoft App Center?

- Free tier available for personal projects
- Builds iOS apps without requiring a Mac
- Supports Capacitor projects
- Generates valid IPA files that can be installed with AltStore

## Prerequisites

- Microsoft account (can use Outlook, Hotmail, etc.)
- Apple ID (for app signing)
- The `nutritlens-ios.zip` file from this project

## Step 1: Set Up App Center Account

1. Go to [appcenter.ms](https://appcenter.ms/)
2. Sign in with your Microsoft account
3. Create a new organization if prompted

## Step 2: Prepare Your Project

1. Download and extract `nutritlens-ios.zip` from this Replit project
2. The extracted folder will contain the iOS project files

## Step 3: Create a New App in App Center

1. In App Center, click "Add new app"
2. Enter app name: "NutriLens"
3. Select OS: "iOS"
4. Select Platform: "Native/Xamarin" (App Center will detect it's an iOS project)
5. Click "Add new app"

## Step 4: Connect to a Repository

App Center needs your code in a Git repository. You have two options:

### Option A: Use an existing repository
1. Create a repository on GitHub/Bitbucket/Azure DevOps
2. Upload the extracted iOS folder to this repository
3. Connect App Center to this repository

### Option B: Use App Center's "Upload" feature
1. In your app page, go to Build
2. Click on "Upload a custom build"
3. Follow the instructions to package and upload your iOS project

## Step 5: Configure Build

If using Option A (repository):

1. Select the branch you want to build
2. Click "Configure build"
3. Set the project configuration:
   - Project: `App/App.xcodeproj` or `App/App.xcworkspace`
   - Scheme: `App`
   - Xcode version: Latest stable
   - Build configuration: Release

4. Under Signing, choose one:
   - "Sign builds using App Center's iOS signing certificate" (for testing)
   - "Sign builds with custom certificate" (if you have a provisioning profile)

5. Under Distribution, select "Store" to generate an IPA file

## Step 6: Start the Build

1. Click "Save & Build"
2. Wait for the build to complete (this may take several minutes)

## Step 7: Download the IPA

1. Once the build is successful, click "Download"
2. Select the IPA file to download

## Step 8: Install with AltStore

Now that you have the IPA file:

1. Follow the "altstore-install-guide.md" to install AltStore on your iOS device
2. Use AltStore to install the IPA file on your device

## Troubleshooting Common Issues

### Build Fails with Code Signing Errors

If you see code signing errors:
- Try using App Center's signing certificate for testing
- If using your own certificate, make sure the provisioning profile is correct

### Missing Dependent Frameworks

If the build fails due to missing frameworks:
- Check that the Capacitor dependencies are properly included
- Try running `npx cap sync` before uploading the project

### Build Succeeds but App Crashes

If the build works but the app crashes on launch:
- Check the device logs
- Make sure all required permissions are in Info.plist
- Verify that your iOS device is supported (iOS 11+)

## Notes on App Center Free Tier

- The free tier allows 240 build minutes per month
- One iOS build typically takes 10-20 minutes
- You can have up to 2 parallel builds
- Build artifacts (like your IPA) are stored for 30 days

## Next Steps

Once you have successfully built your app:
- Set up automatic builds when you push changes to your repository
- Configure build scripts for more complex build processes
- Add App Center Analytics and Crash Reporting to your app