import { 
  users, type User, type InsertUser,
  foodItems, type FoodItem, type InsertFoodItem,
  mealRecords, type MealRecord, type InsertMealRecord
} from "@shared/schema";
import { db } from "./lib/db";
import { eq, desc } from "drizzle-orm";

// Storage interface for CRUD operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Food item methods
  getFoodItem(id: number): Promise<FoodItem | undefined>;
  createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem>;
  
  // Meal record methods
  getMealRecord(id: number): Promise<MealRecord | undefined>;
  getAllMealRecords(): Promise<MealRecord[]>;
  createMealRecord(mealRecord: InsertMealRecord): Promise<MealRecord>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Food item methods
  async getFoodItem(id: number): Promise<FoodItem | undefined> {
    const result = await db.select().from(foodItems).where(eq(foodItems.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async createFoodItem(insertFoodItem: InsertFoodItem): Promise<FoodItem> {
    const result = await db.insert(foodItems).values(insertFoodItem).returning();
    return result[0];
  }
  
  // Meal record methods
  async getMealRecord(id: number): Promise<MealRecord | undefined> {
    const result = await db.select().from(mealRecords).where(eq(mealRecords.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getAllMealRecords(): Promise<MealRecord[]> {
    return await db.select().from(mealRecords).orderBy(desc(mealRecords.timestamp));
  }
  
  async createMealRecord(insertMealRecord: InsertMealRecord): Promise<MealRecord> {
    const result = await db.insert(mealRecords).values(insertMealRecord).returning();
    return result[0];
  }
}

// Memory storage implementation (keeping for reference)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private foodItems: Map<number, FoodItem>;
  private mealRecords: Map<number, MealRecord>;
  
  private userId: number;
  private foodItemId: number;
  private mealRecordId: number;

  constructor() {
    this.users = new Map();
    this.foodItems = new Map();
    this.mealRecords = new Map();
    
    this.userId = 1;
    this.foodItemId = 1;
    this.mealRecordId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Food item methods
  async getFoodItem(id: number): Promise<FoodItem | undefined> {
    return this.foodItems.get(id);
  }
  
  async createFoodItem(insertFoodItem: InsertFoodItem): Promise<FoodItem> {
    const id = this.foodItemId++;
    // Make sure all fields have proper values to satisfy the FoodItem type
    const foodItem: FoodItem = { 
      id,
      name: insertFoodItem.name,
      description: insertFoodItem.description || null,
      servingSize: insertFoodItem.servingSize || null,
      calories: insertFoodItem.calories,
      protein: insertFoodItem.protein || null,
      carbs: insertFoodItem.carbs || null,
      fat: insertFoodItem.fat || null
    };
    this.foodItems.set(id, foodItem);
    return foodItem;
  }
  
  // Meal record methods
  async getMealRecord(id: number): Promise<MealRecord | undefined> {
    return this.mealRecords.get(id);
  }
  
  async getAllMealRecords(): Promise<MealRecord[]> {
    return Array.from(this.mealRecords.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createMealRecord(insertMealRecord: InsertMealRecord): Promise<MealRecord> {
    const id = this.mealRecordId++;
    const timestamp = new Date();
    // Make sure all fields have proper values to satisfy the MealRecord type
    const mealRecord: MealRecord = { 
      id,
      name: insertMealRecord.name,
      imageData: insertMealRecord.imageData || null,
      totalCalories: insertMealRecord.totalCalories,
      confidenceScore: insertMealRecord.confidenceScore || null,
      timestamp,
      foodItems: insertMealRecord.foodItems
    };
    
    this.mealRecords.set(id, mealRecord);
    return mealRecord;
  }
}

// Export the database storage implementation
export const storage = new DatabaseStorage();
