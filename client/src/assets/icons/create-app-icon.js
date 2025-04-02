// This script creates a simple app icon for the NutriLens application
// Run with: node create-app-icon.js

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Configuration
const iconSize = 1024;
const outputPath = path.join(__dirname, 'app-icon.png');

// Create a canvas with the specified dimensions
const canvas = createCanvas(iconSize, iconSize);
const ctx = canvas.getContext('2d');

// Define a gradient background
const gradient = ctx.createLinearGradient(0, 0, iconSize, iconSize);
gradient.addColorStop(0, '#4F46E5');  // Indigo
gradient.addColorStop(1, '#10B981');  // Emerald
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, iconSize, iconSize);

// Add app name text
ctx.fillStyle = 'white';
ctx.font = 'bold 120px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Nutri', iconSize / 2, (iconSize / 2) - 40);
ctx.fillText('Lens', iconSize / 2, (iconSize / 2) + 80);

// Add a simple camera icon
ctx.beginPath();
ctx.arc(iconSize / 2, iconSize / 2, 200, 0, Math.PI * 2);
ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
ctx.lineWidth = 10;
ctx.stroke();

// Convert to a buffer and save to file
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log(`App icon created at: ${outputPath}`);