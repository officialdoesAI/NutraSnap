import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { Express, Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { User } from '@shared/schema';

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
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret-key-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
}

// Authentication middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: 'Not authenticated' });
}

// User data sanitizer (removes sensitive data like password)
export function sanitizeUser(user: any) {
  if (!user) return null;
  
  const { password, ...safeUser } = user;
  return safeUser;
}