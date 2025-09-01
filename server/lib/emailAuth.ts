import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { validateSession } from "./session";
import { signInSchema, signUpSchema, type SignInData, type SignUpData } from "@shared/schema";

// Middleware to check if user is authenticated via email/password
export const isEmailAuthenticated: RequestHandler = async (req: any, res, next) => {
  try {
    // Check for session cookie
    const sessionToken = req.cookies?.emailSession;
    
    if (!sessionToken) {
      return res.status(401).json({ message: "Unauthorized", type: "email_auth_required" });
    }

    // Validate session
    const session = await validateSession(sessionToken);
    
    if (!session || !session.userId) {
      return res.status(401).json({ message: "Unauthorized", type: "email_auth_required" });
    }

    // Get user from database
    const user = await storage.getUser(session.userId);
    
    if (!user || user.authProvider !== "email") {
      return res.status(401).json({ message: "Unauthorized", type: "email_auth_required" });
    }

    // Attach user to request
    req.emailUser = user;
    req.emailSession = session;
    
    next();
  } catch (error) {
    console.error("Email auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized", type: "email_auth_required" });
  }
};

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password utility
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Sign up validation and processing
export async function processSignUp(data: SignUpData) {
  // Validate input
  const validationResult = signUpSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error("Validation failed: " + validationResult.error.issues.map(i => i.message).join(", "));
  }

  const { email, password, firstName, lastName } = validationResult.data;

  // Check if user already exists
  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await storage.createUserWithEmail({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return user;
}

// Sign in validation and processing
export async function processSignIn(data: SignInData) {
  // Validate input
  const validationResult = signInSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error("Validation failed: " + validationResult.error.issues.map(i => i.message).join(", "));
  }

  const { email, password } = validationResult.data;

  // Get user by email
  const user = await storage.getUserByEmail(email);
  if (!user || user.authProvider !== "email") {
    throw new Error("Invalid email or password");
  }

  if (!user.password) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  return user;
}