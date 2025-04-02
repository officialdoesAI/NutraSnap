import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  profilePicture: text("profile_picture"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  profilePicture: true,
  displayName: true,
}).extend({
  confirmPassword: z.string()
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Food Item Schema
export const foodItems = pgTable("food_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  servingSize: text("serving_size"),
  calories: integer("calories").notNull(),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
});

export const insertFoodItemSchema = createInsertSchema(foodItems).omit({
  id: true,
});

export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type FoodItem = typeof foodItems.$inferSelect;

// Meal Records Schema
export const mealRecords = pgTable("meal_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  imageData: text("image_data"), // Store base64 image data
  totalCalories: integer("total_calories").notNull(),
  confidenceScore: integer("confidence_score"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  foodItems: jsonb("food_items").notNull(), // Store food items as JSON
});

// Define the relationships
export const mealRecordsRelations = relations(mealRecords, ({ one }) => ({
  user: one(users, {
    fields: [mealRecords.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  mealRecords: many(mealRecords),
}));

export const insertMealRecordSchema = createInsertSchema(mealRecords).omit({
  id: true,
  timestamp: true,
});

export type InsertMealRecord = z.infer<typeof insertMealRecordSchema>;
export type MealRecord = typeof mealRecords.$inferSelect;
