import { requireRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function updateRole(formData: FormData) {
  'use server';

  await requireRole([UserRole.SUPER_ADMIN]);

  const userId = String(formData.get('userId') ?? '');
  const role = String(formData.get('role') ?? '');

  if (!Object.values(UserRole).includes(role as UserRole)) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as UserRole }
  });

  revalidatePath('/dashboard/super-admin/users');
}

export default async function SuperAdminUsersPage() {
  await requireRole([UserRole.SUPER_ADMIN]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">User Management</h1>
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <article key={user.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-navy">{user.name}</p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
            <form action={updateRole} className="flex items-center gap-2">
              <input type="hidden" name="userId" value={user.id} />
              <select name="role" defaultValue={user.role} className="rounded border p-2 text-sm">
                {Object.values(UserRole).map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <button className="rounded bg-navy px-3 py-2 text-sm text-white" type="submit">Update</button>
            </form>
          </article>
        ))}
      </div>
    </main>
  );
}
