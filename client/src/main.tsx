import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { Capacitor } from '@capacitor/core';

// Wait for the deviceready event if running in a native environment
const startApp = () => {
  createRoot(document.getElementById("root")!).render(
    <>
      <App />
      <Toaster />
    </>
  );
};

// Check if we're running in Capacitor (native) environment
if (Capacitor.isNativePlatform()) {
  // Wait for the device to be ready before rendering the app
  document.addEventListener('deviceready', startApp, false);
} else {
  // Web environment - start immediately
  startApp();
}
