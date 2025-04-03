import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, WifiOff, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isOffline, setIsOffline] = useState(false);
  
  // Check if we're offline
  useEffect(() => {
    setIsOffline(!navigator.onLine);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const retry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            {isOffline ? (
              <WifiOff className="h-8 w-8 text-amber-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-500" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {isOffline ? "You're Offline" : "404 Page Not Found"}
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-600 mb-6">
            {isOffline 
              ? "NutriLens needs an internet connection to analyze food images. Please check your connection and try again."
              : "The page you're looking for doesn't exist or has been moved."}
          </p>
          
          <div className="flex gap-3 mt-6">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            {isOffline && (
              <Button onClick={retry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
