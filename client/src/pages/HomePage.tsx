import React, { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Camera from "@/components/Camera";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { analyzeFoodImage, saveMealRecord } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import SubscriptionPaywall from "@/components/SubscriptionPaywall";

const HomePage: React.FC = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { incrementScanCount, scanCount, showPaywall, setShowPaywall, hasActiveSubscription } = useAuth();

  const analysisMutation = useMutation({
    mutationFn: (imageData: string) => analyzeFoodImage(imageData),
    onSuccess: async (data) => {
      if (!imageData) return;
      
      // Save the meal record
      try {
        const savedMeal = await saveMealRecord({
          name: data.name,
          imageData: imageData,
          totalCalories: data.totalCalories,
          confidenceScore: data.confidenceScore,
          foodItems: data.items
        });
        
        // Invalidate meals query
        queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
        
        // Navigate to results
        navigate(`/results/${savedMeal.id}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save analysis results",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze the image",
        variant: "destructive"
      });
    }
  });
  
  const handleImageCapture = (capturedImage: string) => {
    setImageData(capturedImage);
  };
  
  const handleSubscribe = () => {
    // This is now handled directly in the SubscriptionPaywall component
    setShowPaywall(false);
  };

  const handleAnalyze = () => {
    if (!imageData) {
      toast({
        title: "No Image",
        description: "Please capture or upload a food image first",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has an active subscription or free scans remaining
    if (!hasActiveSubscription && scanCount >= 2) {
      setShowPaywall(true);
      return;
    }
    
    // Only increment scan count if user doesn't have an active subscription
    if (!hasActiveSubscription) {
      incrementScanCount();
    }
    
    // Proceed with analysis
    analysisMutation.mutate(imageData);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4">
        <h2 className="text-lg font-medium text-gray-800">Scan Food</h2>
        <p className="text-sm text-gray-500">
          Take a photo or upload an image of your meal to analyze calories
        </p>
      </div>
      
      <div className="flex-1 px-4 flex flex-col">
        <Camera onImageCapture={handleImageCapture} />
        
        <Button
          className="w-full bg-[#F97316] text-white py-4 rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center"
          disabled={!imageData || analysisMutation.isPending}
          onClick={handleAnalyze}
        >
          {analysisMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Analyze Calories
            </>
          )}
        </Button>
      </div>
      
      {analysisMutation.isPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs text-center">
            <div className="mb-6 relative">
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-primary text-xl"></i>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Analyzing your meal</h3>
            <p className="text-gray-500 text-sm mb-4">Our AI is identifying foods and calculating calories</p>
            
            <div className="flex justify-center space-x-1 mb-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-200"></div>
            </div>
            
            <p className="text-xs text-gray-400">Identifying food items...</p>
          </div>
          
          <button 
            className="absolute bottom-10 text-white hover:text-gray-200"
            onClick={() => analysisMutation.reset()}
          >
            Cancel
          </button>
        </div>
      )}
      
      {/* Subscription Paywall */}
      <SubscriptionPaywall 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        onSubscribe={handleSubscribe} 
      />
      
      {/* Free scan limit indicator (only shown for non-subscribed users) */}
      {!hasActiveSubscription && scanCount < 2 && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Free scans remaining</span>
            <span className="font-medium">{2 - scanCount} / 2</span>
          </div>
        </div>
      )}
      
      {/* Pro indicator for subscribed users */}
      {hasActiveSubscription && (
        <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border-t border-primary/20">
          <div className="flex justify-between items-center text-sm">
            <span className="text-primary font-medium">NutriLens Pro</span>
            <span className="text-primary/80">Unlimited Scans</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
