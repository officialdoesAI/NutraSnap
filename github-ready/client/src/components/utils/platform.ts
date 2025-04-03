import { Capacitor } from '@capacitor/core';

export const isPlatform = (platform: string): boolean => {
  return Capacitor.getPlatform() === platform;
};

export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const isWeb = (): boolean => {
  return !isNative();
};

// Check for specific platforms
export const isIOS = (): boolean => {
  return isPlatform('ios');
};

export const isAndroid = (): boolean => {
  return isPlatform('android');
};