import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export const AUTH_COOKIE = 'drs_token';

export type TokenPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET missing');
  return secret;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().set(AUTH_COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getCurrentUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isVerified: true }
  });
}
