import { requireRole } from '@/lib/auth/rbac';
import { UserRole } from '@prisma/client';
import { getSuperAdminSnapshot } from '@/lib/services/dashboard';

export default async function SuperAdminDashboard() {
  await requireRole([UserRole.SUPER_ADMIN]);
  const snapshot = await getSuperAdminSnapshot();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-navy">Super Admin Dashboard</h1>
        <a className="rounded bg-navy px-3 py-2 text-sm text-white" href="/dashboard/super-admin/users">Manage Users</a>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {Object.entries(snapshot).map(([k, v]) => <article key={k} className="card p-5"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-bold text-navy">{v}</p></article>)}
      </div>
    </main>
  );
}
