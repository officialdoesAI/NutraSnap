import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { Express, Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { User } from '@shared/schema';
import createMemoryStore from 'memorystore';

// Define properly typed session options
import { SessionOptions } from 'express-session';
type SameSiteOption = boolean | 'lax' | 'strict' | 'none' | undefined;

// Set up local strategy for passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.authenticateUser(username, password);
      
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize user to session
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Initialize session and passport in Express app
export function setupAuth(app: Express) {
  // Add better debugging for session issues
  const debug = (message: string, ...args: any[]) => {
    console.log(`[Session]: ${message}`, ...args);
  };

  const MemoryStore = createMemoryStore(session);
  
  const isProduction = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET || 'nutritlens-session-key-dev';
  
  debug(`Setting up auth with sessionSecret length: ${sessionSecret.length}, isProduction: ${isProduction}`);
  
  // Configure session middleware with improved settings for cross-domain support
  const sessionOptions: SessionOptions = {
    store: new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
      // Remove properties that aren't part of the MemoryStoreOptions type
    }),
    secret: sessionSecret,
    name: 'nutritlens.sid', // Custom name to avoid default session cookie name
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on activity
    cookie: { 
      // Allow non-secure cookies in production to work with all deployment scenarios
      secure: false,
      httpOnly: true, // Prevent JavaScript access to the cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax' as const, // Type assertion to resolve TS error
      path: '/',
    },
  };
  
  debug('Session middleware configured', sessionOptions);
  
  app.use(session(sessionOptions));
  
  // Initialize passport first
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Add middleware to log session data for debugging AFTER passport is initialized
  app.use((req: Request, _res: Response, next: NextFunction) => {
    debug(`Session ID: ${req.sessionID}, Authenticated: ${req.isAuthenticated ? req.isAuthenticated() : false}`);
    if (req.isAuthenticated && req.isAuthenticated()) {
      debug(`User ID: ${(req.user as any)?.id}`);
    }
    next();
  });
  
  debug('Passport authentication initialized');
}

// Authentication middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  console.log(`[Auth Check] Path: ${req.path}, SessionID: ${req.sessionID}`);
  
  // Check if session exists
  if (!req.session) {
    console.error('[Auth Error] No session object found on request');
    return res.status(401).json({ message: 'Session error - please try again' });
  }
  
  // Check if isAuthenticated is a function (it should be after passport initialization)
  if (typeof req.isAuthenticated !== 'function') {
    console.error('[Auth Error] req.isAuthenticated is not a function, passport may not be initialized properly');
    return res.status(500).json({ message: 'Server authentication error' });
  }
  
  if (req.isAuthenticated()) {
    // Log user ID for debugging purposes
    const userId = (req.user as any)?.id;
    console.log(`[Auth Success] User ID: ${userId}, Path: ${req.path}`);
    return next();
  }
  
  // Log failure for debugging
  console.log(`[Auth Failure] Path: ${req.path}, Headers:`, {
    cookie: req.headers.cookie ? 'present' : 'missing',
    contentType: req.headers['content-type'],
    userAgent: req.headers['user-agent'],
  });
  
  res.status(401).json({ message: 'Not authenticated' });
}

// User data sanitizer (removes sensitive data like password)
export function sanitizeUser(user: any) {
  if (!user) return null;
  
  const { password, ...safeUser } = user;
  return safeUser;
}