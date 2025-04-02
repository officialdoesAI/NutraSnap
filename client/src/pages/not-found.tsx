import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-6 pb-2 flex flex-col items-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            Page Not Found
          </h1>

          <p className="text-sm text-muted-foreground text-center max-w-xs">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        
        <CardFooter className="flex gap-2 justify-center pt-2 pb-6">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
