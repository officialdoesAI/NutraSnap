import { 
  users, type User, type InsertUser,
  foodItems, type FoodItem, type InsertFoodItem,
  mealRecords, type MealRecord, type InsertMealRecord
} from "@shared/schema";
import { db } from "./lib/db";
import { eq, desc, isNull, and } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

// Storage interface for CRUD operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined>;
  authenticateUser(username: string, password: string): Promise<User | undefined>;
  
  // Food item methods
  getFoodItem(id: number): Promise<FoodItem | undefined>;
  createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem>;
  
  // Meal record methods
  getMealRecord(id: number): Promise<MealRecord | undefined>;
  getAllMealRecords(): Promise<MealRecord[]>;
  getMealRecordsByUserId(userId: number): Promise<MealRecord[]>;
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
    // Remove confirmPassword as it's not stored in the database
    const { confirmPassword, ...userToInsert } = insertUser as InsertUser & { confirmPassword: string };
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userToInsert.password, 10);
    
    // Create the user with hashed password
    const result = await db.insert(users).values({
      ...userToInsert,
      password: hashedPassword,
    }).returning();
    
    return result[0];
  }
  
  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const result = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
      
    return result.length > 0 ? result[0] : undefined;
  }
  
  async authenticateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    
    if (!user) {
      return undefined;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    return isPasswordValid ? user : undefined;
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
  
  async getMealRecordsByUserId(userId: number): Promise<MealRecord[]> {
    return await db.select()
      .from(mealRecords)
      .where(eq(mealRecords.userId, userId))
      .orderBy(desc(mealRecords.timestamp));
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
    const { confirmPassword, ...userToInsert } = insertUser as InsertUser & { confirmPassword: string };
    
    // Create a new user with default values for the new fields
    const user: User = { 
      ...userToInsert, 
      id, 
      profilePicture: null,
      displayName: null,
      createdAt: new Date(),
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async authenticateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return undefined;
    }
    
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

  async getMealRecordsByUserId(userId: number): Promise<MealRecord[]> {
    return Array.from(this.mealRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createMealRecord(insertMealRecord: InsertMealRecord): Promise<MealRecord> {
    const id = this.mealRecordId++;
    const timestamp = new Date();
    
    // Create a userId variable with the correct type
    const userId: number | null = 
      typeof insertMealRecord.userId === 'number' ? insertMealRecord.userId : null;
    
    // Make sure all fields have proper values to satisfy the MealRecord type
    const mealRecord: MealRecord = { 
      id,
      userId,
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
