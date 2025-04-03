// PWA utilities for handling installation and updates

// Add Safari iOS standalone mode property to Navigator interface
interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Store the installation event for later use
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Initialize PWA event listeners
 * This should be called once when the app starts
 */
export function initPWA() {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Store the event for later use
    deferredInstallPrompt = e as BeforeInstallPromptEvent;
    
    // Optionally notify the user that installation is available
    // You can show a UI element like a button or banner
    const pwaInstallEvent = new CustomEvent('pwaInstallAvailable');
    window.dispatchEvent(pwaInstallEvent);
  });

  // Installation completed
  window.addEventListener('appinstalled', () => {
    // Clear the install prompt reference
    deferredInstallPrompt = null;
    
    // Log the installation to analytics or show a success message
    console.log('PWA was installed');
    
    // Notify the app that installation is complete
    const pwaInstalledEvent = new CustomEvent('pwaInstalled');
    window.dispatchEvent(pwaInstalledEvent);
  });

  // Service worker update handling
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // The service worker has been updated
      console.log('Service worker updated');
    });
  }
}

/**
 * Check if the app can be installed
 * @returns {boolean} Whether the install prompt is available
 */
export function canInstallPWA(): boolean {
  return !!deferredInstallPrompt;
}

/**
 * Show the install prompt
 * @returns {Promise<boolean>} Whether the user accepted the installation
 */
export async function promptInstallPWA(): Promise<boolean> {
  if (!deferredInstallPrompt) {
    console.log('Install prompt not available');
    return false;
  }

  // Show the install prompt
  deferredInstallPrompt.prompt();

  // Wait for the user's choice
  const choiceResult = await deferredInstallPrompt.userChoice;
  
  // Reset the deferred prompt
  deferredInstallPrompt = null;

  // Return true if the user accepted the installation
  return choiceResult.outcome === 'accepted';
}

/**
 * Check if the app is installed as a PWA
 * This is not 100% reliable but works in most cases
 */
export function isInstalledPWA(): boolean {
  // Check for display-mode: standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  // iOS detection for standalone mode
  // Safari on iOS adds this property to navigator when in standalone mode
  const nav = window.navigator as NavigatorStandalone;
  if (nav && nav.standalone === true) {
    return true;
  }
  
  return false;
}

/**
 * Detect if an update is available for the service worker
 * @param callback Function to call when an update is available
 */
export function detectServiceWorkerUpdate(callback: () => void): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        // A new service worker is available
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, call the callback
              callback();
            }
          });
        }
      });
    });
  }
}

/**
 * Update the service worker and reload the app
 */
export function updateServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.update().then(() => {
        // Send a message to the service worker to skip waiting
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
  }
}