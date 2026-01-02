/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars'
);

const JWT_EXPIRY = '24h'; // Token expires in 24 hours

export interface AdminPayload extends JWTPayload {
  email: string;
  role: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token for an admin
 */
export async function createToken(payload: AdminPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AdminPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Mock admin database (replace with real database in production)
 */
const ADMIN_USERS = [
  {
    email: 'admin@teamraw.com',
    // Password: admin123 (hashed)
    passwordHash: '$2b$10$h7ufyonZZsUwUU9Gs88umu10zrklTv3b/3J2GIsy/FUmnyCha4vJO',
    role: 'ADMIN',
    name: 'Admin User',
  },
];

/**
 * Find admin by email
 */
export async function findAdminByEmail(email: string) {
  return ADMIN_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * Validate admin credentials
 */
export async function validateAdminCredentials(email: string, password: string) {
  const admin = await findAdminByEmail(email);
  
  if (!admin) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.passwordHash);
  
  if (!isValid) {
    return null;
  }

  return {
    email: admin.email,
    role: admin.role,
    name: admin.name,
  };
}

/**
 * Extract token from request headers or cookies
 */
export function extractToken(request: Request): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return cookies['admin_token'] || null;
  }

  return null;
}
