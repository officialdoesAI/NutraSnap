import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeFoodImage } from "./lib/openai";
import { insertMealRecordSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Analyze food image endpoint
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData || typeof imageData !== 'string') {
        return res.status(400).json({ 
          message: "Image data is required and must be a base64 string" 
        });
      }
      
      // Strip data URL prefix if present
      const base64Image = imageData.includes('base64,') 
        ? imageData.split('base64,')[1] 
        : imageData;
      
      const result = await analyzeFoodImage(base64Image);
      res.json(result);
    } catch (error) {
      console.error("Error in analyze endpoint:", error);
      res.status(500).json({ 
        message: "Error analyzing food image", 
        error: error.message 
      });
    }
  });

  // Get all meal records
  app.get("/api/meals", async (_req, res) => {
    try {
      const meals = await storage.getAllMealRecords();
      res.json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ 
        message: "Error fetching meal records", 
        error: error.message 
      });
    }
  });

  // Create a new meal record
  app.post("/api/meals", async (req: Request, res: Response) => {
    try {
      const result = insertMealRecordSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newMeal = await storage.createMealRecord(result.data);
      res.status(201).json(newMeal);
    } catch (error) {
      console.error("Error creating meal record:", error);
      res.status(500).json({ 
        message: "Error creating meal record", 
        error: error.message 
      });
    }
  });

  // Get meal by ID
  app.get("/api/meals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meal ID" });
      }
      
      const meal = await storage.getMealRecord(id);
      
      if (!meal) {
        return res.status(404).json({ message: "Meal record not found" });
      }
      
      res.json(meal);
    } catch (error) {
      console.error("Error fetching meal:", error);
      res.status(500).json({ 
        message: "Error fetching meal record", 
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
