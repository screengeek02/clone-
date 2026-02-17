import { jwtVerify } from 'jose';
import { UserRole } from '@prisma/client';

export type EdgeTokenPayload = { userId: string; role: UserRole; email: string };

export async function verifyEdgeToken(token: string): Promise<EdgeTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    if (!secret) return null;
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: String(payload.userId),
      role: payload.role as UserRole,
      email: String(payload.email)
    };
  } catch {
    return null;
  }
}
