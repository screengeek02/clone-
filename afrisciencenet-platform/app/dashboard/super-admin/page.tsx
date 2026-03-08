import { requireRole } from '@/lib/auth/rbac';
import { UserRole } from '@prisma/client';
import { getSuperAdminSnapshot } from '@/lib/services/dashboard';

export default async function SuperAdminDashboard() {
  await requireRole([UserRole.SUPER_ADMIN]);
  const snapshot = await getSuperAdminSnapshot();
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-navy">Super Admin Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {Object.entries(snapshot).map(([k, v]) => <article key={k} className="card p-5"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-bold text-navy">{v}</p></article>)}
      </div>
    </main>
  );
}
