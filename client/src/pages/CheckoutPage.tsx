import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { Crown, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

// Initialize Stripe with our public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Components for each step in the checkout process
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/checkout/success",
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "An error occurred during the payment process",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>
      <div className="flex flex-col space-y-2">
        <Button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? "Processing..." : "Subscribe Now - £2/month"}
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const CheckoutSuccess = () => {
  const [, navigate] = useLocation();
  const { resetScanCount } = useAuth();
  
  useEffect(() => {
    // Reset scan count as user has subscribed
    resetScanCount();
  }, [resetScanCount]);

  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="mt-4 text-2xl font-semibold">Subscription Successful!</h2>
      <p className="text-muted-foreground">
        Thank you for subscribing to NutriLens Pro. You now have unlimited access to all features.
      </p>
      
      <div className="mt-6">
        <Button onClick={() => navigate("/")}>Continue to App</Button>
      </div>
    </div>
  );
};

const CheckoutError = () => {
  const [, navigate] = useLocation();
  
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-10 w-10 text-red-600" />
      </div>
      
      <h2 className="mt-4 text-2xl font-semibold">Payment Failed</h2>
      <p className="text-muted-foreground">
        We couldn't process your payment. Please try again or contact support.
      </p>
      
      <div className="mt-6 flex flex-col space-y-2">
        <Button onClick={() => navigate("/checkout")}>Try Again</Button>
        <Button variant="outline" onClick={() => navigate("/profile")}>Back to Profile</Button>
      </div>
    </div>
  );
};

// Main checkout page that manages the entire flow
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [location] = useLocation();

  // Different checkout page states
  const isSuccess = location === '/checkout/success';
  const isError = location === '/checkout/error';

  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("POST", "/api/create-subscription");
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create subscription");
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "An error occurred while setting up the payment");
        toast({
          title: "Setup Failed",
          description: err.message || "Could not initialize the payment process",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch client secret on the main checkout page
    if (!isSuccess && !isError) {
      getPaymentIntent();
    } else {
      setIsLoading(false);
    }
  }, [isSuccess, isError, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Success page
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <CheckoutSuccess />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error page
  if (isError) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <CheckoutError />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error fetching client secret
  if (error || !clientSecret) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center mb-2">
              <button 
                onClick={() => navigate("/profile")}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </button>
            </div>
            <CardTitle className="text-xl">Unable to Load Checkout</CardTitle>
            <CardDescription>
              We encountered a problem setting up the payment process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error || "Could not initialize payment"}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("/profile")}>
              Back to Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <button 
              onClick={() => navigate("/profile")}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </button>
          </div>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-500" />
            Subscribe to NutriLens Pro
          </CardTitle>
          <CardDescription>
            Complete your payment to unlock unlimited scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>NutriLens Pro Subscription</span>
              <span className="font-medium">£0.10/month</span>
            </div>
          </div>
          
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}