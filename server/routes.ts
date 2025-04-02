import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeFoodImage } from "./lib/openai";
import { insertMealRecordSchema, insertUserSchema, type User } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import { isAuthenticated, sanitizeUser } from "./auth";
import Stripe from "stripe";

// Initialize Stripe with API key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable. Stripe integration won't work.");
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

// User type with id for authenticated requests
type UserWithId = Partial<User> & {
  id: number;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  // ===== Authentication Routes =====
  
  // Register a new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      // Check if passwords match
      if (result.data.password !== result.data.confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Create the user
      const newUser = await storage.createUser(result.data);
      
      // Log in the user automatically after registration
      req.login(newUser, (err: any) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        
        // Return user data (without password)
        return res.status(201).json(sanitizeUser(newUser));
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Error registering user", 
        error: error.message 
      });
    }
  });
  
  // Login route
  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      
      req.login(user, (err: any) => {
        if (err) {
          return next(err);
        }
        
        return res.json(sanitizeUser(user));
      });
    })(req, res, next);
  });
  
  // Logout route
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      res.json({ success: true });
    });
  });
  
  // Get current user
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json(sanitizeUser(req.user as UserWithId));
  });
  
  // Update user profile
  app.put("/api/auth/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as UserWithId).id;
      const { displayName, profilePicture } = req.body;
      
      // Only allow updating display name and profile picture
      const updatedUser = await storage.updateUser(userId, {
        displayName,
        profilePicture
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(sanitizeUser(updatedUser));
    } catch (error: any) {
      console.error("Profile update error:", error);
      res.status(500).json({ 
        message: "Error updating profile", 
        error: error.message 
      });
    }
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
    } catch (error: any) {
      console.error("Error in analyze endpoint:", error);
      res.status(500).json({ 
        message: "Error analyzing food image", 
        error: error.message 
      });
    }
  });

  // Get meals for the authenticated user
  app.get("/api/meals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as UserWithId).id;
      const meals = await storage.getMealRecordsByUserId(userId);
      res.json(meals);
    } catch (error: any) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ 
        message: "Error fetching meal records", 
        error: error.message 
      });
    }
  });

  // Create a new meal record
  app.post("/api/meals", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Add the userId to the meal record data from the authenticated user
      const userId = (req.user as UserWithId).id;
      const mealData = { ...req.body, userId };
      
      const result = insertMealRecordSchema.safeParse(mealData);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const newMeal = await storage.createMealRecord(result.data);
      res.status(201).json(newMeal);
    } catch (error: any) {
      console.error("Error creating meal record:", error);
      res.status(500).json({ 
        message: "Error creating meal record", 
        error: error.message 
      });
    }
  });

  // Get meal by ID
  app.get("/api/meals/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = (req.user as UserWithId).id;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid meal ID" });
      }
      
      const meal = await storage.getMealRecord(id);
      
      if (!meal) {
        return res.status(404).json({ message: "Meal record not found" });
      }
      
      // Make sure the user can only access their own meal records
      if (meal.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(meal);
    } catch (error: any) {
      console.error("Error fetching meal:", error);
      res.status(500).json({ 
        message: "Error fetching meal record", 
        error: error.message 
      });
    }
  });

  // ===== Subscription Payment Routes =====

  // Create subscription
  app.post("/api/create-subscription", isAuthenticated, async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    try {
      const user = req.user as UserWithId;
      const userId = user.id;
      
      // If user already has an active subscription, return success
      const existingUser = await storage.getUser(userId);
      if (existingUser?.subscriptionStatus === 'active') {
        return res.status(200).json({ 
          message: "User already has an active subscription",
          subscriptionStatus: 'active'
        });
      }

      // Create or retrieve Stripe customer
      let customerId = existingUser?.stripeCustomerId;
      
      if (!customerId) {
        // Create a new customer
        const customer = await stripe.customers.create({
          name: existingUser?.displayName || existingUser?.username,
          metadata: {
            userId: userId.toString()
          }
        });
        
        // Save customer ID to user
        await storage.updateStripeCustomerId(userId, customer.id);
        customerId = customer.id;
      }
      
      // Create payment intent for £0.10 subscription 
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 10, // £0.10 in pence
        currency: 'gbp',
        customer: customerId,
        payment_method_types: ['card'],
        description: 'NutriLens Pro Monthly Subscription',
        metadata: {
          userId: userId.toString(),
          subscriptionType: 'monthly'
        }
      });

      // Return client secret needed for Stripe.js
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ 
        message: "Error creating subscription", 
        error: error.message 
      });
    }
  });

  // Webhook to handle successful payments
  app.post("/api/webhooks/stripe", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }

    const payload = req.body;
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      // Verify webhook signature if you have a webhook secret
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(
          payload,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else {
        // For development, just parse the payload
        event = payload;
      }

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const userId = parseInt(paymentIntent.metadata.userId);
          
          if (!isNaN(userId)) {
            // Set subscription as active
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            
            await storage.updateSubscriptionStatus(
              userId, 
              'active', 
              expiryDate
            );
            
            console.log(`Subscription activated for user ${userId}`);
          }
          break;
          
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          console.error(`Payment failed for user ${failedPayment.metadata.userId}`);
          break;
          
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
