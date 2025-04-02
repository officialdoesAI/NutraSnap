import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, Zap, Crown, X } from "lucide-react";

interface SubscriptionPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function SubscriptionPaywall({ isOpen, onClose, onSubscribe }: SubscriptionPaywallProps) {
  const [, navigate] = useLocation();
  
  const handleSubscribe = () => {
    onClose();
    navigate("/checkout");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Crown className="h-5 w-5 mr-2 text-yellow-500" />
            Subscribe to NutriLens Pro
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited scans and premium features
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
                  NutriLens Pro
                </span>
              </CardTitle>
              <CardDescription className="text-center">
                <span className="text-2xl font-bold">£2</span> / month
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 mr-2 text-primary shrink-0" />
                <p>Unlimited food scans with AI analysis</p>
              </div>
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 mr-2 text-primary shrink-0" />
                <p>Complete meal history and tracking</p>
              </div>
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 mr-2 text-primary shrink-0" />
                <p>Detailed nutritional information for all foods</p>
              </div>
              <div className="flex items-start">
                <BadgeCheck className="h-5 w-5 mr-2 text-primary shrink-0" />
                <p>Premium support</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubscribe} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Free trial allows 2 scans. No commitment, cancel anytime.</p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            <X className="mr-2 h-4 w-4" />
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}