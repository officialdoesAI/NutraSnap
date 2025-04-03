import { apiRequest } from "@/lib/queryClient";

// User related types
export interface User {
  id: number;
  username: string;
  displayName: string | null;
  profilePicture: string | null;
  createdAt: string;
  // Subscription fields
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus?: string;
  subscriptionExpiresAt?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  confirmPassword: string;
  displayName?: string;
  profilePicture?: string;
}

export interface ProfileUpdateData {
  displayName?: string;
  profilePicture?: string;
}

export interface FoodItem {
  name: string;
  description: string;
  servingSize: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface FoodAnalysisResult {
  name: string;
  totalCalories: number;
  confidenceScore: number;
  items: FoodItem[];
}

export interface MealRecord {
  id: number;
  name: string;
  imageData: string;
  totalCalories: number;
  confidenceScore: number;
  timestamp: string;
  foodItems: FoodItem[];
}

// Function to upload and analyze food image
export async function analyzeFoodImage(imageData: string): Promise<FoodAnalysisResult> {
  const response = await apiRequest('POST', '/api/analyze', { imageData });
  return response.json();
}

// Function to save meal record
export async function saveMealRecord(mealData: {
  name: string;
  imageData: string;
  totalCalories: number;
  confidenceScore: number;
  foodItems: FoodItem[];
}): Promise<MealRecord> {
  const response = await apiRequest('POST', '/api/meals', mealData);
  return response.json();
}

// Function to get all meal records
export async function getAllMealRecords(): Promise<MealRecord[]> {
  const response = await apiRequest('GET', '/api/meals');
  return response.json();
}

// Function to get a specific meal record
export async function getMealRecord(id: number): Promise<MealRecord> {
  const response = await apiRequest('GET', `/api/meals/${id}`);
  return response.json();
}

// Authentication functions

// Register a new user
export async function register(data: RegisterData): Promise<User> {
  const response = await apiRequest('POST', '/api/auth/register', data);
  return response.json();
}

// Login user
export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await apiRequest('POST', '/api/auth/login', credentials);
  return response.json();
}

// Logout user
export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/auth/logout');
}

// Get current authenticated user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest('GET', '/api/auth/me');
    const data = await response.json();
    // Ensure we have proper user data
    if (data && data.id) {
      return data as User;
    }
    return null;
  } catch (error: unknown) {
    console.error("Error in getCurrentUser:", error);
    // Type guard for error with status property
    if (typeof error === 'object' && error !== null) {
      if ('status' in error && (error.status === 401 || error.status === 403)) {
        return null;
      }
      if ('message' in error && typeof error.message === 'string' && error.message.includes('Not authenticated')) {
        return null;
      }
    }
    // Return null for authentication errors, but throw for other types of errors
    return null;
  }
}

// Update user profile
export async function updateProfile(data: ProfileUpdateData): Promise<User> {
  const response = await apiRequest('PUT', '/api/auth/profile', data);
  return response.json();
}
