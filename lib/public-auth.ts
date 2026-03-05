import { db } from "./db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface PublicUser {
  id: number;
  full_name: string;
  email: string;
  created_at: Date;
  is_active: boolean;
}

export interface PublicUserSession {
  user_id: number;
  session_token: string;
  expires_at: Date;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Register public user
export async function registerPublicUser(
  fullName: string,
  email: string,
  password: string
): Promise<PublicUser> {
  try {
    // Check if user already exists
    const [existingUsers] = await db.execute(
      "SELECT id FROM public_users WHERE email = ?",
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [result] = await db.execute(
      "INSERT INTO public_users (full_name, email, password, is_active) VALUES (?, ?, ?, ?)",
      [fullName, email, hashedPassword, true]
    );

    if (!result || typeof result !== "object" || !("insertId" in result)) {
      throw new Error("Failed to create user");
    }

    return {
      id: result.insertId as number,
      full_name: fullName,
      email,
      created_at: new Date(),
      is_active: true,
    };
  } catch (error) {
    throw error;
  }
}

// Login public user
export async function loginPublicUser(
  email: string,
  password: string
): Promise<{ user: PublicUser; sessionToken: string }> {
  try {
    // Find user
    const [users] = await db.execute(
      "SELECT id, full_name, email, created_at, is_active FROM public_users WHERE email = ?",
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = users[0] as any;

    // Verify password
    const [passwordUsers] = await db.execute(
      "SELECT password FROM public_users WHERE id = ?",
      [user.id]
    );

    if (!Array.isArray(passwordUsers) || passwordUsers.length === 0) {
      throw new Error("Invalid email or password");
    }

    const storedPassword = (passwordUsers[0] as any).password;
    const isPasswordValid = await comparePassword(password, storedPassword);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Store session
    await db.execute(
      "INSERT INTO public_user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)",
      [user.id, sessionToken, expiresAt]
    );

    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
        is_active: user.is_active,
      },
      sessionToken,
    };
  } catch (error) {
    throw error;
  }
}

// Get user from session token
export async function getUserFromSession(
  sessionToken: string
): Promise<PublicUser | null> {
  try {
    const [sessions] = await db.execute(
      `SELECT pu.id, pu.full_name, pu.email, pu.created_at, pu.is_active 
       FROM public_user_sessions pus 
       JOIN public_users pu ON pus.user_id = pu.id 
       WHERE pus.session_token = ? AND pus.expires_at > NOW()`,
      [sessionToken]
    );

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return null;
    }

    const user = sessions[0] as any;
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
      is_active: user.is_active,
    };
  } catch (error) {
    return null;
  }
}

// Logout public user
export async function logoutPublicUser(sessionToken: string): Promise<void> {
  try {
    await db.execute(
      "DELETE FROM public_user_sessions WHERE session_token = ?",
      [sessionToken]
    );
  } catch (error) {
    throw error;
  }
}

// Get user by ID
export async function getPublicUserById(id: number): Promise<PublicUser | null> {
  try {
    const [users] = await db.execute(
      "SELECT id, full_name, email, created_at, is_active FROM public_users WHERE id = ? AND is_active = ?",
      [id, true]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return null;
    }

    const user = users[0] as any;
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      created_at: user.created_at,
      is_active: user.is_active,
    };
  } catch (error) {
    return null;
  }
}
