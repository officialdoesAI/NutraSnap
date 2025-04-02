import { 
  users, type User, type InsertUser,
  foodItems, type FoodItem, type InsertFoodItem,
  mealRecords, type MealRecord, type InsertMealRecord
} from "@shared/schema";

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
    const foodItem: FoodItem = { ...insertFoodItem, id };
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
    const mealRecord: MealRecord = { 
      ...insertMealRecord,
      id,
      timestamp
    };
    
    this.mealRecords.set(id, mealRecord);
    return mealRecord;
  }
}

export const storage = new MemStorage();
