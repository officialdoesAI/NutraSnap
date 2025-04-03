#!/bin/bash

# Script to set up Capacitor for iOS development

# Check if script is running on MacOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "Error: This script must be run on MacOS"
    exit 1
fi

# Ensure all dependencies are installed
echo "Checking dependencies..."

# Check for Xcode
if ! xcode-select -p &>/dev/null; then
    echo "Error: Xcode is not installed. Please install it from the App Store."
    exit 1
fi

# Check for Node.js and npm
if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
    echo "Error: Node.js and npm are required. Please install them."
    exit 1
fi

# Check for CocoaPods
if ! command -v pod &>/dev/null; then
    echo "Installing CocoaPods..."
    sudo gem install cocoapods
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install CocoaPods"
        exit 1
    fi
fi

echo "Building web application..."
npm run build

echo "Adding iOS platform to Capacitor..."
npx cap add ios

echo "Syncing web build with iOS platform..."
npx cap sync ios

# Generate iOS app icons
if [ -f "./client/src/assets/icons/ios-icon-generator.sh" ]; then
    echo "Generating iOS app icons..."
    bash ./client/src/assets/icons/ios-icon-generator.sh
else
    echo "Warning: iOS icon generator script not found"
fi

# Modify Info.plist to add required permissions
echo "Adding required permissions to Info.plist..."

# Get the path to the Info.plist file
INFO_PLIST="ios/App/App/Info.plist"

if [ -f "$INFO_PLIST" ]; then
    # Check if permissions are already added
    if ! grep -q "NSCameraUsageDescription" "$INFO_PLIST"; then
        # Add camera usage description before the closing </dict> tag
        sed -i '' 's/<\/dict>/\t<key>NSCameraUsageDescription<\/key>\n\t<string>NutriLens needs camera access to analyze your food<\/string>\n<\/dict>/' "$INFO_PLIST"
    fi
    
    if ! grep -q "NSPhotoLibraryUsageDescription" "$INFO_PLIST"; then
        # Add photo library usage description before the closing </dict> tag
        sed -i '' 's/<\/dict>/\t<key>NSPhotoLibraryUsageDescription<\/key>\n\t<string>NutriLens needs photo library access to analyze your food images<\/string>\n<\/dict>/' "$INFO_PLIST"
    fi
    
    echo "Permissions added successfully"
else
    echo "Warning: Info.plist not found at $INFO_PLIST"
fi

echo "Opening Xcode..."
npx cap open ios

echo "Setup complete! Xcode should now be open with your iOS project."
echo ""
echo "Next steps:"
echo "1. In Xcode, set your signing team in the 'Signing & Capabilities' tab"
echo "2. Ensure the Bundle Identifier is unique (io.nutritlens.app is recommended)"
echo "3. Build and run on a connected device or simulator"
echo ""
echo "For distribution via AltStore:"
echo "1. Archive the app (Product > Archive)"
echo "2. Export a development build"
echo "3. Install the .ipa file using AltStore on your device"