import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { login, LoginCredentials, getCurrentUser } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // If already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log("User already authenticated, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Check for redirect parameters in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectReason = searchParams.get('reason');
    if (redirectReason === 'session_expired') {
      toast({
        title: "Session expired",
        description: "Please log in again to continue",
        variant: "default",
      });
    }
  }, [location, toast]);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      console.log("Attempting login for:", data.username);
      setLoginError(null);
      
      try {
        const user = await login(data);
        console.log("Login successful, received user:", user);
        return user;
      } catch (error: any) {
        setLoginError(error.message || "Authentication failed");
        throw error;
      }
    },
    onSuccess: () => {
      // Force refetch current user
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.refetchQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Login successful!",
        description: "Welcome back to NutriLens",
      });
      
      // Slightly longer timeout to ensure the query client has time to update
      setTimeout(() => {
        console.log("Redirecting to home page after login");
        navigate("/", { replace: true });
      }, 500);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      // Error is already handled in mutation
      console.log("Login submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login to NutriLens</CardTitle>
          <CardDescription>
            Enter your username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          {authLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Checking authentication status...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="yourusername" 
                          autoComplete="username" 
                          disabled={isLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          autoComplete="current-password"
                          disabled={isLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || authLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Logging in...
                    </span>
                  ) : "Login"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            Don't have an account yet?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}