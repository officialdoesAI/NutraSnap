#!/bin/bash

# Exit on error
set -e

echo "===== NutriLens iOS Export Script ====="
echo "This script prepares the NutriLens app for iOS export"
echo

# Clean build directories
echo "📦 Cleaning build directories..."
rm -rf dist/
rm -rf ios/App/App/public
mkdir -p ios/App/App/public

# Build the web app
echo "🔨 Building web application..."
npm run build

# Verify the build output
if [ ! -d "dist/public" ]; then
  echo "❌ Build failed - dist/public directory not found"
  exit 1
fi

echo "✅ Build completed successfully"
ls -la dist/public | head -n 10
echo "... and more files"

# Ensure the ios directory exists and set up capacitor
echo "📱 Setting up Capacitor for iOS..."
npx cap add ios || echo "iOS platform already exists"

# Update capacitor.config.json in the iOS project
echo "🔄 Syncing Capacitor configuration..."
npx cap sync ios

# Additional steps for iOS deployment
echo "⚙️ Adding iOS-specific configurations..."

# Add permissions and settings to Info.plist
echo "📄 Updating Info.plist..."
if [ -f ios/App/App/Info.plist ]; then
  # Make a backup of the original Info.plist
  cp ios/App/App/Info.plist ios/App/App/Info.plist.backup
  
  # Add camera permissions
  echo "📷 Adding camera permissions..."
  TEMP_FILE=$(mktemp)
  if ! grep -q "NSCameraUsageDescription" ios/App/App/Info.plist; then
    sed '/<\/dict>/i\
\        <key>NSCameraUsageDescription<\/key>\
\        <string>This app needs camera access to analyze your food for nutrition information<\/string>' ios/App/App/Info.plist > $TEMP_FILE
    mv $TEMP_FILE ios/App/App/Info.plist
  fi
  
  # Add photo library permissions
  echo "🖼️ Adding photo library permissions..."
  TEMP_FILE=$(mktemp)
  if ! grep -q "NSPhotoLibraryUsageDescription" ios/App/App/Info.plist; then
    sed '/<\/dict>/i\
\        <key>NSPhotoLibraryUsageDescription<\/key>\
\        <string>This app needs access to photo library to analyze food from saved images<\/string>' ios/App/App/Info.plist > $TEMP_FILE
    mv $TEMP_FILE ios/App/App/Info.plist
  fi
  
  # Add photo library add permissions
  TEMP_FILE=$(mktemp)
  if ! grep -q "NSPhotoLibraryAddUsageDescription" ios/App/App/Info.plist; then
    sed '/<\/dict>/i\
\        <key>NSPhotoLibraryAddUsageDescription<\/key>\
\        <string>This app needs access to photo library to save food images<\/string>' ios/App/App/Info.plist > $TEMP_FILE
    mv $TEMP_FILE ios/App/App/Info.plist
  fi
  
  # Add app transport security settings
  echo "🔐 Adding app transport security settings..."
  TEMP_FILE=$(mktemp)
  if ! grep -q "NSAppTransportSecurity" ios/App/App/Info.plist; then
    sed '/<\/dict>/i\
\        <key>NSAppTransportSecurity<\/key>\
\        <dict>\
\            <key>NSAllowsArbitraryLoads<\/key>\
\            <true\/>\
\        <\/dict>' ios/App/App/Info.plist > $TEMP_FILE
    mv $TEMP_FILE ios/App/App/Info.plist
  fi
else
  echo "❌ Warning: Info.plist not found"
fi

# Bundle the web assets into the iOS project
echo "📂 Copying web assets to iOS project..."
cp -R dist/public/* ios/App/App/public/

# Verify the files were copied
echo "🔍 Verifying web assets in iOS project..."
find ios/App/App/public -type f | wc -l
ls -la ios/App/App/public | head -n 10
echo "... and more files"

# Create a dummy entitlements file for AltStore
echo "🔑 Creating entitlements file for AltStore..."
cat > ios/App/App/App.entitlements << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.team-identifier</key>
    <string>ALTSTORE</string>
    <key>application-identifier</key>
    <string>ALTSTORE.io.nutritlens.app</string>
</dict>
</plist>
EOF

# Create zip archive of iOS project (only the necessary files)
echo "🗜️ Creating iOS project zip archive..."
zip -r nutritlens-ios.zip ios/ README-IOS.md

echo "✅ iOS project export completed!"
echo "🚀 Use one of these options to build the app:"
echo "   1. Download 'nutritlens-ios.zip' and open on a Mac with Xcode"
echo "   2. Use Codemagic CI/CD with the configuration in codemagic.yaml"