import { apiRequest } from "@/lib/queryClient";

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
