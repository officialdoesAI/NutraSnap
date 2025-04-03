import React, { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import { getAppContainerClass, isIOS, isNativePlatform, isWeb } from '../lib/platform';
import { useAuth } from '@/context/AuthContext';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { isInstalledPWA } from '@/lib/pwa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { showPaywall, setShowPaywall, hasActiveSubscription } = useAuth();
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  
  // Apply platform-specific classes to the document
  useEffect(() => {
    // Add iOS specific class if needed
    if (isIOS()) {
      document.documentElement.classList.add('ios-platform');
    }
    
    // Add native app class if running in Capacitor
    if (isNativePlatform()) {
      document.documentElement.classList.add('native-app');
    }
    
    return () => {
      // Cleanup classes if component unmounts
      document.documentElement.classList.remove('ios-platform', 'native-app');
    };
  }, []);

  // Only show PWA install banner in web environment for mobile users
  // and only after a delay (to not overwhelm new users)
  useEffect(() => {
    if (isWeb() && !isNativePlatform() && !isInstalledPWA()) {
      // Show PWA install prompt after 60 seconds (for returning users)
      const timer = setTimeout(() => {
        setShowPwaPrompt(true);
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className={getAppContainerClass()}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Navigation />
        
        {/* PWA Install Prompt (shown in web environment) */}
        {showPwaPrompt && (
          <div className="fixed bottom-20 left-0 right-0 mx-4 z-50 animate-fade-in">
            <PwaInstallPrompt variant="banner" />
          </div>
        )}
      </div>
      
      {/* Global subscription paywall dialog */}
      <SubscriptionPaywall 
        isOpen={showPaywall && !hasActiveSubscription} 
        onClose={() => setShowPaywall(false)}
        onSubscribe={() => {
          window.location.href = '/checkout';
        }}
      />
      
      {/* Global toast notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;