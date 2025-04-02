#!/bin/bash

# Script to export NutriLens iOS project for building on a Mac

# Build the web app
echo "Building web application..."
npm run build

# Sync Capacitor with the web build
echo "Syncing Capacitor with web build..."
npx cap sync ios

# Create zip archive of iOS project
echo "Creating iOS project zip archive..."
zip -r nutritlens-ios.zip ios/ README-IOS.md

echo "iOS project export completed!"
echo "The file 'nutritlens-ios.zip' can now be downloaded and opened on a Mac with Xcode."
echo "Follow the instructions in README-IOS.md to build and install the app."