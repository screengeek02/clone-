import { requireRole } from '@/lib/auth/rbac';
import { UserRole } from '@prisma/client';

export default async function InstitutionAdminDashboard() {
  await requireRole([UserRole.INSTITUTION_ADMIN, UserRole.SUPER_ADMIN]);
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Institution Admin Dashboard</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{['Institution Overview', 'Equipment Management', 'Researcher Verification', 'Booking Approvals', 'Collaboration Moderation', 'Analytics Snapshot'].map((card) => <article key={card} className="card p-5">{card}</article>)}</div></main>;
}
