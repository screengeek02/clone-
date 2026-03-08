import { UserRole } from '@prisma/client';
import { auth } from '@/lib/auth/auth';

export async function requireRole(allowed: UserRole[]) {
  const session = await auth();
  if (!session?.user?.role || !allowed.includes(session.user.role as UserRole)) {
    throw new Error('Forbidden');
  }
  return session;
}
