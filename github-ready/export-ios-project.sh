#!/bin/bash

# Script to export NutriLens iOS project for building on a Mac

# Build the web app
echo "Building web application..."
npm run build

# Sync Capacitor with the web build
echo "Syncing Capacitor with web build..."
npx cap sync ios

# Add camera permissions to Info.plist if they don't exist
echo "Adding camera permissions to Info.plist..."
mkdir -p ios/App/App
if [ -f ios/App/App/Info.plist ]; then
  # Check if NSCameraUsageDescription is already present
  if ! grep -q "NSCameraUsageDescription" ios/App/App/Info.plist; then
    # Use a temporary file for the replacement
    TEMP_FILE=$(mktemp)
    # Find the closing dict tag and add our permission before it
    sed '/<\/dict>/i\
\       <key>NSCameraUsageDescription<\/key>\
\       <string>This app needs camera access to analyze your food for nutrition information<\/string>' ios/App/App/Info.plist > $TEMP_FILE
    # Replace the original file
    mv $TEMP_FILE ios/App/App/Info.plist
    echo "Camera permissions added to Info.plist"
  else
    echo "Camera permissions already exist in Info.plist"
  fi
else
  echo "Warning: Info.plist not found"
fi

# Create zip archive of iOS project
echo "Creating iOS project zip archive..."
zip -r nutritlens-ios.zip ios/ README-IOS.md ios-build-instructions.md

echo "iOS project export completed!"
echo "The file 'nutritlens-ios.zip' can now be downloaded and opened on a Mac with Xcode."
echo "Follow the instructions in README-IOS.md to build and install the app."