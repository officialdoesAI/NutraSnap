import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { Capacitor } from '@capacitor/core';
import { initPWA, detectServiceWorkerUpdate } from './lib/pwa';

// Wait for the deviceready event if running in a native environment
const startApp = () => {
  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <Toaster />
    </>
  );
  
  // Initialize PWA features (only in web environment)
  if (!Capacitor.isNativePlatform()) {
    // Initialize PWA installation and update features
    initPWA();
    
    // Listen for service worker updates
    detectServiceWorkerUpdate(() => {
      console.log('New version available! Reload to update.');
      // You could show a toast notification here to inform the user
      // that a new version is available and they should refresh
    });
  }
};

// Check if we're running in Capacitor (native) environment
if (Capacitor.isNativePlatform()) {
  // Wait for the device to be ready before rendering the app
  document.addEventListener('deviceready', startApp, false);
} else {
  // Web environment - start immediately
  startApp();
}
