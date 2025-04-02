import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.nutritlens.app',
  appName: 'NutriLens',
  webDir: 'dist',
  // Using bundledWebRuntime in a type-compatible way
  server: {
    androidScheme: 'https',
    iosScheme: 'https', 
    hostname: 'app',
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
