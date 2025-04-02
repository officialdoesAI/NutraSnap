import React, { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { updateProfile, logout, ProfileUpdateData } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";


const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").optional().or(z.literal("")),
  profilePicture: z.string().optional().or(z.literal("")),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { user, scanCount, resetScanCount, hasActiveSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      profilePicture: user?.profilePicture || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    setIsLoading(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };



  return (
    <div className="flex-1 p-4 overflow-auto">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.displayName || user.username} />
                  ) : (
                    <AvatarFallback>{getInitials(user?.displayName || user?.username || "")}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{user?.displayName || user?.username}</CardTitle>
                  <CardDescription>
                    @{user?.username} · Member since {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Manage your NutriLens subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasActiveSubscription ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="mr-2 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div className="text-green-800 font-medium">Active Subscription</div>
                  </div>
                  <p className="text-sm text-green-700">
                    Your NutriLens Pro subscription is active. You have unlimited scans.
                  </p>
                  {user?.subscriptionExpiresAt && (
                    <p className="text-xs text-green-600 mt-2">
                      Next billing date: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Available Scans</div>
                      <div className="text-right">
                        <span className="text-xl font-bold">{Math.max(0, 2 - scanCount)}</span>
                        <span className="text-muted-foreground"> / 2</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{width: `${Math.max(0, 100 - (scanCount * 50))}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-center text-lg">
                        <span className="bg-gradient-to-r from-primary to-primary-500 bg-clip-text text-transparent">
                          NutriLens Pro
                        </span>
                      </CardTitle>
                      <CardDescription className="text-center">
                        <span className="text-xl font-bold">£0.30</span> / month
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 py-2">
                      <p className="text-center">Unlock unlimited scans and premium features</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => navigate("/checkout")}
                      >
                        Subscribe Now
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}