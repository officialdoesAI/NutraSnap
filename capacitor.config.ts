import { CapacitorConfig } from '@capacitor/cli';

// Fixed config with typescript-compatible properties
const config = {
  appId: 'io.nutritlens.app',
  appName: 'NutriLens',
  webDir: 'dist/public',
  // Additional properties that work but might not be in the type definition
  bundledWebRuntime: true,
  // Server configuration
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor', 
    // Use localhost for iOS, 'app' sometimes causes routing issues
    hostname: 'localhost',
    // Allow cleartextTraffic for development (remove in production)
    cleartext: true
  },
  ios: {
    // iOS specific configuration
    contentInset: 'automatic',
    allowsLinkPreview: false,
    backgroundColor: "#ffffff",
    preferredContentMode: 'mobile',
    // For AltStore distribution
    scheme: 'nutritlens'
  },
  plugins: {
    Camera: {
      // iOS camera permissions
      permissions: {
        allow: ['camera'],
        usage: 'The app uses your camera to analyze food and calculate nutrition information.'
      }
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#4caf50"
    }
  }
};

export default config;
