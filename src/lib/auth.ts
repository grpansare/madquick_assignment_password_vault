import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  email: string;
}

export const verifyToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as any;
    
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
};

export const getAuthUser = (request: NextRequest): AuthUser | null => {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
};
