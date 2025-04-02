import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowDownToLine, XCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Check if running on iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // For devices that support installability (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install prompt after a short delay to let the app load
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If already installed, this will fire
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('App was installed to home screen');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOSDevice) return;

    if (deferredPrompt) {
      // Show native install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User ${outcome} the installation`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
    
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Install NutriLens</DialogTitle>
          <DialogDescription>
            {isIOSDevice ? (
              <div className="mt-4 space-y-4">
                <p>Install NutriLens on your iOS device:</p>
                <ol className="ml-6 list-decimal space-y-2">
                  <li>Tap the share button <span className="px-2 py-1 bg-gray-100 rounded-md">⬆️</span> at the bottom of your screen</li>
                  <li>Scroll down and select <span className="px-2 py-1 bg-gray-100 rounded-md">Add to Home Screen</span></li>
                  <li>Tap <span className="px-2 py-1 bg-gray-100 rounded-md">Add</span> in the top right corner</li>
                </ol>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <p>Install NutriLens on your device to:</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Open the app with a single tap</li>
                  <li>Use offline when your connection is poor</li>
                  <li>Get a fullscreen experience</li>
                </ul>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            <XCircle className="mr-2 h-4 w-4" /> Not now
          </Button>
          {!isIOSDevice && (
            <Button onClick={handleInstallClick} className="gap-2">
              <ArrowDownToLine className="h-4 w-4" /> Install App
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}