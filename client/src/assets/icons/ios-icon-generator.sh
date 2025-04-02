#!/bin/bash

# Script to generate iOS app icons for NutriLens
# This script requires ImageMagick (convert command)

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "This script is designed to run on macOS for iOS icon generation"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it using:"
    echo "brew install imagemagick"
    exit 1
fi

# Base directory
BASE_DIR="$(pwd)"
ASSETS_DIR="$BASE_DIR/client/src/assets/icons"
ICON_SOURCE="$ASSETS_DIR/app-icon.png"

# Create a temporary icon if one doesn't exist
if [ ! -f "$ICON_SOURCE" ]; then
    echo "Source icon not found at $ICON_SOURCE. Creating a temporary icon..."
    
    # Create a simple gradient icon with text
    convert -size 1024x1024 \
        gradient:#4F46E5-#10B981 \
        -gravity center \
        -pointsize 120 \
        -font "Arial-Bold" \
        -fill white \
        -annotate 0 "NutriLens" \
        "$ICON_SOURCE"
    
    echo "Temporary icon created. Replace with your own design at $ICON_SOURCE"
fi

# iOS icon destination directories
IOS_ICON_DIR="$BASE_DIR/ios/App/App/Assets.xcassets/AppIcon.appiconset"

# Create the destination directory if it doesn't exist
mkdir -p "$IOS_ICON_DIR"

# Function to generate iOS icons
generate_ios_icons() {
    # iOS icon sizes
    declare -a sizes=(
        "20x20"    # iPhone Notification 20pt@1x
        "40x40"    # iPhone Notification 20pt@2x
        "60x60"    # iPhone Notification 20pt@3x
        "29x29"    # iPhone Settings 29pt@1x
        "58x58"    # iPhone Settings 29pt@2x
        "87x87"    # iPhone Settings 29pt@3x
        "40x40"    # iPhone Spotlight 40pt@1x
        "80x80"    # iPhone Spotlight 40pt@2x
        "120x120"  # iPhone Spotlight 40pt@3x
        "120x120"  # iPhone App 60pt@2x
        "180x180"  # iPhone App 60pt@3x
        "76x76"    # iPad App 76pt@1x
        "152x152"  # iPad App 76pt@2x
        "167x167"  # iPad Pro App 83.5pt@2x
        "1024x1024" # App Store
    )
    
    # Remove existing icons
    rm -f "$IOS_ICON_DIR/"*.png
    
    # Generate Contents.json
    cat > "$IOS_ICON_DIR/Contents.json" << EOF
{
  "images" : [
    {
      "size" : "20x20",
      "idiom" : "iphone",
      "filename" : "icon-20@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "20x20",
      "idiom" : "iphone",
      "filename" : "icon-20@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "filename" : "icon-29.png",
      "scale" : "1x"
    },
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "filename" : "icon-29@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "filename" : "icon-29@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "40x40",
      "idiom" : "iphone",
      "filename" : "icon-40@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "40x40",
      "idiom" : "iphone",
      "filename" : "icon-40@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "60x60",
      "idiom" : "iphone",
      "filename" : "icon-60@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "60x60",
      "idiom" : "iphone",
      "filename" : "icon-60@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "20x20",
      "idiom" : "ipad",
      "filename" : "icon-20.png",
      "scale" : "1x"
    },
    {
      "size" : "20x20",
      "idiom" : "ipad",
      "filename" : "icon-20@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "29x29",
      "idiom" : "ipad",
      "filename" : "icon-29.png",
      "scale" : "1x"
    },
    {
      "size" : "29x29",
      "idiom" : "ipad",
      "filename" : "icon-29@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "40x40",
      "idiom" : "ipad",
      "filename" : "icon-40.png",
      "scale" : "1x"
    },
    {
      "size" : "40x40",
      "idiom" : "ipad",
      "filename" : "icon-40@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "76x76",
      "idiom" : "ipad",
      "filename" : "icon-76.png",
      "scale" : "1x"
    },
    {
      "size" : "76x76",
      "idiom" : "ipad",
      "filename" : "icon-76@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "83.5x83.5",
      "idiom" : "ipad",
      "filename" : "icon-83.5@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "1024x1024",
      "idiom" : "ios-marketing",
      "filename" : "icon-1024.png",
      "scale" : "1x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}
EOF
    
    # Generate the icons
    convert "$ICON_SOURCE" -resize 20x20 "$IOS_ICON_DIR/icon-20.png"
    convert "$ICON_SOURCE" -resize 40x40 "$IOS_ICON_DIR/icon-20@2x.png"
    convert "$ICON_SOURCE" -resize 60x60 "$IOS_ICON_DIR/icon-20@3x.png"
    convert "$ICON_SOURCE" -resize 29x29 "$IOS_ICON_DIR/icon-29.png"
    convert "$ICON_SOURCE" -resize 58x58 "$IOS_ICON_DIR/icon-29@2x.png"
    convert "$ICON_SOURCE" -resize 87x87 "$IOS_ICON_DIR/icon-29@3x.png"
    convert "$ICON_SOURCE" -resize 40x40 "$IOS_ICON_DIR/icon-40.png"
    convert "$ICON_SOURCE" -resize 80x80 "$IOS_ICON_DIR/icon-40@2x.png"
    convert "$ICON_SOURCE" -resize 120x120 "$IOS_ICON_DIR/icon-40@3x.png"
    convert "$ICON_SOURCE" -resize 120x120 "$IOS_ICON_DIR/icon-60@2x.png"
    convert "$ICON_SOURCE" -resize 180x180 "$IOS_ICON_DIR/icon-60@3x.png"
    convert "$ICON_SOURCE" -resize 76x76 "$IOS_ICON_DIR/icon-76.png"
    convert "$ICON_SOURCE" -resize 152x152 "$IOS_ICON_DIR/icon-76@2x.png"
    convert "$ICON_SOURCE" -resize 167x167 "$IOS_ICON_DIR/icon-83.5@2x.png"
    convert "$ICON_SOURCE" -resize 1024x1024 "$IOS_ICON_DIR/icon-1024.png"
    
    echo "iOS icons generated successfully at $IOS_ICON_DIR"
}

# Check if iOS directory exists
if [ -d "$BASE_DIR/ios" ]; then
    generate_ios_icons
else
    echo "iOS directory not found. Run 'npx cap add ios' first."
    exit 1
fi

echo "App icon generation complete!"