import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText;
    try {
      // Try to parse as JSON first
      const errorData = await res.json();
      errorText = errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // If not JSON, read as text
      try {
        errorText = await res.text() || res.statusText;
      } catch (textError) {
        errorText = res.statusText || 'Unknown error';
      }
    }
    console.error(`API Error ${res.status}:`, errorText);
    throw new Error(`${res.status}: ${errorText}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`API Request: ${method} ${url}`);
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      // Ensure cookies are sent with requests
      mode: 'cors',
      cache: 'no-cache',
    });

    console.log(`API Response: ${method} ${url} - Status: ${res.status}`);
    
    // Clone response before checking status to avoid consuming the body
    const resClone = res.clone();
    await throwIfResNotOk(resClone);
    
    return res;
  } catch (error) {
    console.error(`API Error in ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`Query Request: GET ${url}`);
    
    try {
      const res = await fetch(url, {
        credentials: "include",
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`Query Response: GET ${url} - Status: ${res.status}`);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`Query ${url} returned 401, handling with "returnNull"`);
        return null;
      }

      // Clone response before checking status
      const resClone = res.clone();
      await throwIfResNotOk(resClone);
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(`Query Error in GET ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Changed to returnNull to prevent redirect loops
      refetchInterval: false,
      refetchOnWindowFocus: true, // Enable to refresh data when returning to the app
      staleTime: 60000, // 1 minute instead of Infinity for more reliable state
      retry: 1, // Allow one retry on failure
      retryDelay: 1000, // Wait 1 second before retry
    },
    mutations: {
      retry: 1, // Allow one retry on failure
      retryDelay: 1000,
    },
  },
});
