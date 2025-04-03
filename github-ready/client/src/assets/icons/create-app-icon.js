// Script to generate iOS app icons from a base SVG
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the directories exist
const publicIconsDir = path.join(__dirname, '../../../public/icons');
const iosIconsDir = path.join(__dirname, '../../../../ios/App/App/Assets.xcassets/AppIcon.appiconset');

// Create directories if they don't exist
if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

if (!fs.existsSync(iosIconsDir)) {
  fs.mkdirSync(iosIconsDir, { recursive: true });
}

// SVG source file 
const svgSource = path.join(__dirname, 'app-logo.svg');

// Icon sizes for PWA/web
const webIconSizes = [
  72, 96, 128, 144, 152, 192, 384, 512
];

// Icon sizes for iOS (matches Xcode requirements)
const iosIconSizes = [
  20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024
];

// Generate icons using ImageMagick's convert
function generatePngFromSvg(sourceSvg, outputPath, size) {
  try {
    execSync(`convert -background none -size ${size}x${size} ${sourceSvg} ${outputPath}`);
    console.log(`Generated: ${outputPath}`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error.message);
  }
}

// Generate web/PWA icons
webIconSizes.forEach(size => {
  const outputFile = path.join(publicIconsDir, `icon-${size}x${size}.png`);
  generatePngFromSvg(svgSource, outputFile, size);
});

// Generate iOS icons
iosIconSizes.forEach(size => {
  const outputFile = path.join(iosIconsDir, `AppIcon-${size}.png`);
  generatePngFromSvg(svgSource, outputFile, size);
});

// Generate iOS splash screens (can be extended)
const iosSplashSizes = [
  { width: 2048, height: 2732 }, // 12.9" iPad Pro
  { width: 1668, height: 2388 }, // 11" iPad Pro
  { width: 1536, height: 2048 }, // iPad (gen 7/8)
  { width: 1125, height: 2436 }, // iPhone X/XS/11 Pro
  { width: 1242, height: 2688 }, // iPhone XS Max/11 Pro Max
  { width: 828, height: 1792 },  // iPhone XR/11
  { width: 1242, height: 2208 }, // iPhone 8 Plus
  { width: 750, height: 1334 },  // iPhone 8/SE (2nd gen)
  { width: 640, height: 1136 },  // iPhone SE (1st gen)
];

// Generate splash screens
iosSplashSizes.forEach(({ width, height }) => {
  const outputFile = path.join(publicIconsDir, `apple-splash-${width}-${height}.png`);
  try {
    // Create a splash screen with the app icon centered
    execSync(`convert -size ${width}x${height} xc:white \\
      ${path.join(publicIconsDir, 'icon-192x192.png')} -gravity center -composite ${outputFile}`);
    console.log(`Generated splash: ${outputFile}`);
  } catch (error) {
    console.error(`Error generating splash ${outputFile}:`, error.message);
  }
});

// Create Contents.json for iOS icons
const iosContentsJson = {
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
};

// Write the Contents.json file for iOS
fs.writeFileSync(
  path.join(iosIconsDir, 'Contents.json'),
  JSON.stringify(iosContentsJson, null, 2)
);

console.log('Icon generation complete!');