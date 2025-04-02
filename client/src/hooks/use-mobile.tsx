import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * @returns {boolean} True if the current device is a mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check if device is iOS
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      
      // Check if device is Android
      const isAndroid = /android/i.test(userAgent);
      
      // Check if screen width is typical for mobile devices
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isIOS || isAndroid || isSmallScreen);
    };

    // Check initially
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}