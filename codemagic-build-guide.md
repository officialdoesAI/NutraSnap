# Codemagic CI/CD Build Instructions for NutriLens

This guide will help you set up and build the NutriLens iOS app using Codemagic CI/CD.

## Prerequisites

1. A Codemagic account (sign up at [codemagic.io](https://codemagic.io/signup))
2. Your GitHub repository connected to Codemagic
3. Apple Developer account credentials

## Setup Instructions

### Step 1: Connect Your Repository

1. Log in to your Codemagic account
2. Click "Add application"
3. Select GitHub as the provider
4. Find and select your NutraSnap repository
5. Click "Set up build"

### Step 2: Configure Environment Variables

Navigate to your app settings in Codemagic and add the following environment variables:

For App Store distribution:
- `APPLE_ID`: Your Apple ID email
- `APP_STORE_CONNECT_ISSUER_ID`: Your App Store Connect API Key Issuer ID
- `APP_STORE_CONNECT_KEY_IDENTIFIER`: Your App Store Connect API Key Identifier
- `APP_STORE_CONNECT_PRIVATE_KEY`: Your App Store Connect API Private Key
- `CERTIFICATE_PRIVATE_KEY`: Your Distribution Certificate Private Key
- `XCODE_DEVELOPMENT_TEAM`: Your Apple Team ID (can be found in the Apple Developer Portal)
- `XCODE_DEVELOPMENT_TEAM_NAME`: Your Apple Team Name

For AltStore/Ad-hoc distribution:
- `XCODE_DEVELOPMENT_TEAM`: Your Apple Team ID

Mark sensitive information as "Secure" by clicking the lock icon.

### Step 3: Configure the Build

1. Select "Use codemagic.yaml"
2. Choose one of the workflows:
   - `ionic-ios-workflow` for App Store distribution
   - `ionic-ios-altstore` for AltStore/Ad-hoc distribution

### Step 4: Start the Build

Click "Start new build" and select the workflow you want to use.

## Troubleshooting

### Common Issues

1. **Build Errors**: Check the build logs for detailed information about any errors.
2. **Code Signing Issues**: Ensure your Apple Developer account has the correct certificates and provisioning profiles.
3. **iOS Version Requirements**: Make sure your Xcode version in Codemagic settings matches your project requirements.

### Additional Resources

- [Codemagic Documentation for Ionic Apps](https://docs.codemagic.io/yaml-quick-start/building-an-ionic-app/)
- [iOS Code Signing Guide](https://docs.codemagic.io/yaml-code-signing/signing-ios/)
- [Working with Environment Variables](https://docs.codemagic.io/yaml-basic-configuration/environment-variables/)

## After a Successful Build

After your build completes successfully:

1. Download the IPA file from the Artifacts section
2. For App Store: Upload to App Store Connect
3. For AltStore: Follow the AltStore installation guide using the IPA file