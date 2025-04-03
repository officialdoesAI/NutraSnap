import { useState, useEffect } from 'react';
import { canInstallPWA, promptInstallPWA, isInstalledPWA } from '@/lib/pwa';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowDownToLine, Smartphone, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PwaInstallPromptProps {
  variant?: 'banner' | 'button' | 'inline';
  className?: string;
}

export function PwaInstallPrompt({ 
  variant = 'inline', 
  className
}: PwaInstallPromptProps) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [installed, setInstalled] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check if the app can be installed
  useEffect(() => {
    const checkInstallable = () => {
      setIsInstallable(canInstallPWA());
      setInstalled(isInstalledPWA());
    };

    // Check on initial load
    checkInstallable();

    // Listen for the ability to install changing
    const handleAvailable = () => {
      setIsInstallable(true);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('pwaInstallAvailable', handleAvailable);
    window.addEventListener('pwaInstalled', handleInstalled);
    
    return () => {
      window.removeEventListener('pwaInstallAvailable', handleAvailable);
      window.removeEventListener('pwaInstalled', handleInstalled);
    };
  }, []);

  // If already installed or not installable, don't show anything
  if (installed || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    try {
      const installed = await promptInstallPWA();
      if (installed) {
        toast({
          title: "App installed successfully",
          description: "You can now access NutriLens from your home screen",
        });
      }
    } catch (error) {
      console.error("Installation failed", error);
      toast({
        title: "Installation failed",
        description: "Please try again or check browser support",
        variant: "destructive",
      });
    }
  };

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`bg-primary/5 p-4 rounded-lg shadow-sm ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-medium">Install NutriLens</h3>
              <p className="text-sm text-muted-foreground">
                Add to your {isMobile ? 'home screen' : 'desktop'} for faster access
              </p>
            </div>
          </div>
          <Button onClick={handleInstall} size="sm">
            Install
            <ArrowDownToLine className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Button variant
  if (variant === 'button') {
    return (
      <Button 
        onClick={handleInstall} 
        className={className}
        variant="outline"
      >
        Install App
        <ArrowDownToLine className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  // Default inline variant
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Button 
        onClick={handleInstall} 
        variant="ghost" 
        size="sm" 
        className="text-primary hover:text-primary"
      >
        Install App
        <ArrowDownToLine className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}