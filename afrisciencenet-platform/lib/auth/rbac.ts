import { auth } from '@/lib/auth/auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function requireRole(allowed: UserRole[]) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (!allowed.includes(session.user.role)) {
    redirect('/unauthorized');
  }

  return session;
}
