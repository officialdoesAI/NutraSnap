#!/bin/bash

# Script to generate iOS app icons from a base SVG
# This script should be run on macOS during the iOS build process

# Path to the app logo SVG
SVG_SOURCE="./client/src/assets/icons/app-logo.svg"

# Set up directories
PUBLIC_ICONS_DIR="./client/public/icons"
IOS_ASSETS_DIR="./ios/App/App/Assets.xcassets"
IOS_ICONS_DIR="${IOS_ASSETS_DIR}/AppIcon.appiconset"

# Create directories if they don't exist
mkdir -p "${PUBLIC_ICONS_DIR}"
mkdir -p "${IOS_ICONS_DIR}"

echo "Creating app icons from ${SVG_SOURCE}..."

# Function to generate PNG from SVG with specified size
generate_icon() {
    local size=$1
    local output_path=$2
    
    if command -v convert &> /dev/null; then
        # ImageMagick is available
        convert -background none -size "${size}x${size}" "${SVG_SOURCE}" "${output_path}"
    elif command -v sips &> /dev/null; then
        # macOS sips command as fallback
        # First create a large PNG
        if [ ! -f temp_large.png ]; then
            sips -s format png "${SVG_SOURCE}" --out temp_large.png
        fi
        # Then resize to target size
        sips -z "${size}" "${size}" temp_large.png --out "${output_path}"
    else
        echo "Error: Neither ImageMagick nor sips available for image conversion"
        exit 1
    fi
    
    echo "Generated: ${output_path}"
}

# Web/PWA icon sizes
WEB_ICON_SIZES=(72 96 128 144 152 192 384 512)

# Generate web icons
for size in "${WEB_ICON_SIZES[@]}"; do
    generate_icon "${size}" "${PUBLIC_ICONS_DIR}/icon-${size}x${size}.png"
done

# iOS icon sizes required by Xcode
IOS_ICON_SIZES=(20 29 40 58 60 76 80 87 120 152 167 180 1024)

# Generate iOS icons
for size in "${IOS_ICON_SIZES[@]}"; do
    generate_icon "${size}" "${IOS_ICONS_DIR}/AppIcon-${size}.png"
done

# Generate iOS splash screens for common device sizes
# This is a simplified version - for production you'd want more complete splash screens
if [ -f "${PUBLIC_ICONS_DIR}/icon-192x192.png" ]; then
    echo "Generating splash screens..."
    
    # iPhone splash screen sizes
    SPLASH_SIZES=(
        "2048 2732"  # 12.9" iPad Pro
        "1668 2388"  # 11" iPad Pro
        "1536 2048"  # iPad 7/8
        "1125 2436"  # iPhone X/XS/11 Pro
        "1242 2688"  # iPhone XS Max/11 Pro Max
        "828 1792"   # iPhone XR/11
        "750 1334"   # iPhone 8/SE2
        "640 1136"   # iPhone SE1
    )
    
    for dimensions in "${SPLASH_SIZES[@]}"; do
        read -r width height <<< "$dimensions"
        output_file="${PUBLIC_ICONS_DIR}/apple-splash-${width}-${height}.png"
        
        if command -v convert &> /dev/null; then
            # Create splash with white background and centered logo
            convert -size "${width}x${height}" xc:white \
                "${PUBLIC_ICONS_DIR}/icon-192x192.png" -gravity center -composite \
                "${output_file}"
        else
            # More basic splash with sips (macOS)
            # Create blank white image
            sips -s format png -g pixelWidth "${width}" -g pixelHeight "${height}" \
                -g backgroundColor FFFFFF "${PUBLIC_ICONS_DIR}/icon-192x192.png" \
                --out "${output_file}"
        fi
        
        echo "Generated splash: ${output_file}"
    done
fi

# Create Contents.json file for iOS icon set
cat > "${IOS_ICONS_DIR}/Contents.json" << EOL
{
  "images": [
    { "size": "20x20", "idiom": "iphone", "filename": "AppIcon-40.png", "scale": "2x" },
    { "size": "20x20", "idiom": "iphone", "filename": "AppIcon-60.png", "scale": "3x" },
    { "size": "29x29", "idiom": "iphone", "filename": "AppIcon-58.png", "scale": "2x" },
    { "size": "29x29", "idiom": "iphone", "filename": "AppIcon-87.png", "scale": "3x" },
    { "size": "40x40", "idiom": "iphone", "filename": "AppIcon-80.png", "scale": "2x" },
    { "size": "40x40", "idiom": "iphone", "filename": "AppIcon-120.png", "scale": "3x" },
    { "size": "60x60", "idiom": "iphone", "filename": "AppIcon-120.png", "scale": "2x" },
    { "size": "60x60", "idiom": "iphone", "filename": "AppIcon-180.png", "scale": "3x" },
    { "size": "20x20", "idiom": "ipad", "filename": "AppIcon-20.png", "scale": "1x" },
    { "size": "20x20", "idiom": "ipad", "filename": "AppIcon-40.png", "scale": "2x" },
    { "size": "29x29", "idiom": "ipad", "filename": "AppIcon-29.png", "scale": "1x" },
    { "size": "29x29", "idiom": "ipad", "filename": "AppIcon-58.png", "scale": "2x" },
    { "size": "40x40", "idiom": "ipad", "filename": "AppIcon-40.png", "scale": "1x" },
    { "size": "40x40", "idiom": "ipad", "filename": "AppIcon-80.png", "scale": "2x" },
    { "size": "76x76", "idiom": "ipad", "filename": "AppIcon-76.png", "scale": "1x" },
    { "size": "76x76", "idiom": "ipad", "filename": "AppIcon-152.png", "scale": "2x" },
    { "size": "83.5x83.5", "idiom": "ipad", "filename": "AppIcon-167.png", "scale": "2x" },
    { "size": "1024x1024", "idiom": "ios-marketing", "filename": "AppIcon-1024.png", "scale": "1x" }
  ],
  "info": {
    "version": 1,
    "author": "NutriLens"
  }
}
EOL

# Clean up
if [ -f temp_large.png ]; then
    rm temp_large.png
fi

echo "iOS app icon generation complete!"