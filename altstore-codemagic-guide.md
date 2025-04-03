# NutriLens: Guide for Codemagic Build with AltStore

This guide will help you successfully build your NutriLens app using Codemagic for installing via AltStore.

## Step 1: Get Your Apple Developer Team ID

1. Go to [https://developer.apple.com/account/](https://developer.apple.com/account/)
2. Log in with your Apple ID (you need at least the free developer account)
3. Click "Membership" in the left sidebar
4. Find your Team ID (a 10-character code like "A1B2C3D4E5")

## Step 2: Set Up Environment Variables in Codemagic

1. Log in to [Codemagic](https://codemagic.io)
2. Go to your NutraSnap app
3. Click "Environment variables" in the left menu
4. Add the following variable:

| Variable Name | Value | Type |
|--------------|-------------|------|
| `XCODE_DEVELOPMENT_TEAM` | Your Apple Team ID from Step 1 | Secret |

## Step 3: Configure Repository Settings

1. In Codemagic, go to your app settings
2. Select "Build triggers"
3. Under "Workflow" select "altstore-build"
4. Choose "main" for the branch
5. Save settings

## Step 4: Start the Build

1. Click "Start new build"
2. Select the "altstore-build" workflow
3. Choose the "main" branch
4. Click "Start build"

## Step 5: Install with AltStore

Once the build completes successfully:

1. Download the IPA file from the Artifacts section
2. Send the IPA file to your iOS device (AirDrop, email, or cloud storage)
3. Open AltStore on your device
4. Go to "My Apps" tab
5. Tap the "+" button in the top-left
6. Select the downloaded IPA file
7. Follow the prompts to install the app

## Troubleshooting Common Errors

### Exit Code 65 (Code Signing Issue)

If you see "exited with status code 65" in the build logs:

1. Make sure your Apple Developer Team ID is correctly entered in the environment variables
2. Check that you're using a valid Apple ID with at least a free developer account
3. Try switching the export method from "development" to "ad-hoc" in the codemagic.yaml file

### No Provisioning Profiles Found

If you see "no provisioning profiles found":

1. The build is using automatic signing which should work with a free Apple Developer account
2. Make sure you're using a real Apple ID (not a test account)
3. The Apple ID must be added to a development team (even if it's just your personal team)

### App Won't Install via AltStore

If the app won't install through AltStore:

1. Make sure AltStore is properly set up with your Apple ID
2. Verify that AltServer is running on your computer
3. Ensure your iOS device and computer are on the same Wi-Fi network
4. Try refreshing AltStore before installing the app

## Getting Additional Help

If you continue to have issues:

1. Check the build logs in Codemagic for specific error messages
2. Look for issues related to code signing or provisioning profiles
3. Consider trying the direct PWA installation method as an alternative