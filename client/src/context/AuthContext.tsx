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
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
        setShowPaywall
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
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}