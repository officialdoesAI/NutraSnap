import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utility for conditional rendering
 * and platform-specific behavior
 */

/**
 * Check if the app is running on a native platform (iOS, Android)
 * via Capacitor 
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if the app is running on iOS specifically
 */
export const isIOS = (): boolean => {
  return isNativePlatform() && Capacitor.getPlatform() === 'ios';
};

/**
 * Check if the app is running in a web browser
 */
export const isWeb = (): boolean => {
  return !isNativePlatform();
};

/**
 * Get the current platform name 
 */
export const getPlatformName = (): string => {
  return Capacitor.getPlatform();
};

/**
 * Detect if the device is in standalone mode
 * (installed as PWA on iOS Safari)
 */
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

/**
 * Check if the app has safe area insets
 * (iPhone X and newer with notch/dynamic island)
 */
export const hasSafeAreaInsets = (): boolean => {
  if (isIOS()) {
    return true; // For native iOS, we'll assume safe area is needed
  }
  
  // For web, try to detect based on CSS environment variables support
  const hasCSSEnv = typeof CSS !== 'undefined' && CSS.supports && 
                    CSS.supports('padding-top: env(safe-area-inset-top)');
                    
  return hasCSSEnv;
};

/**
 * Get app-container class for platform-specific styling
 */
export const getAppContainerClass = (): string => {
  const classes = ['app-container'];
  
  if (isIOS()) {
    classes.push('ios-app');
  } else if (isPWA()) {
    classes.push('pwa-app');
  } else {
    classes.push('web-app');
  }
  
  if (hasSafeAreaInsets()) {
    classes.push('has-safe-area');
  }
  
  return classes.join(' ');
};