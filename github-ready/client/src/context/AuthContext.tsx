import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  scanCount: number;
  incrementScanCount: () => void;
  resetScanCount: () => void;
  showPaywall: boolean;
  setShowPaywall: (show: boolean) => void;
  hasActiveSubscription: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SCAN_COUNT_KEY = "nutrilens-scan-count";
const MAX_FREE_SCANS = 2;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [scanCount, setScanCount] = useState<number>(() => {
    const saved = localStorage.getItem(SCAN_COUNT_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showPaywall, setShowPaywall] = useState(false);

  // Fetch current user
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          console.log("Auth status: Authenticated as", user.username);
        } else {
          console.log("Auth status: Not authenticated");
        }
        return user;
      } catch (error) {
        console.log("Auth status: Not authenticated", error);
        return null;
      }
    },
    retry: 1, // Retry once in case of network issues
    staleTime: 30 * 1000, // 30 seconds (reduced to make auth state update more quickly)
  });
  
  // Ensure user is properly typed as User | null
  const user: User | null = data ?? null;

  // Update scan count in localStorage
  useEffect(() => {
    localStorage.setItem(SCAN_COUNT_KEY, scanCount.toString());
    
    // Show paywall when scan count reaches maximum
    if (scanCount >= MAX_FREE_SCANS) {
      setShowPaywall(true);
    }
  }, [scanCount]);

  const incrementScanCount = () => {
    setScanCount(prevCount => prevCount + 1);
  };

  const resetScanCount = () => {
    setScanCount(0);
    localStorage.removeItem(SCAN_COUNT_KEY);
  };

  // Derived auth state
  const isAuthenticated = !!user;
  
  // Check if user has an active subscription
  const hasActiveSubscription = 
    user?.subscriptionStatus === 'active' || 
    (user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date());

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        scanCount,
        incrementScanCount,
        resetScanCount,
        showPaywall,
        setShowPaywall,
        hasActiveSubscription: !!hasActiveSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Authentication protecting component
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, navigate] = useLocation();

  // Debug authentication state 
  useEffect(() => {
    console.log("RequireAuth - Auth state:", { isAuthenticated, isLoading, userId: user?.id });
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    // Only redirect if we're definitely not authenticated after loading completes
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Verifying authentication...</p>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}