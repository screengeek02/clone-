import { requireRole } from '@/lib/auth/rbac';
import { UserRole } from '@prisma/client';

export default async function ResearcherDashboard() {
  await requireRole([UserRole.RESEARCHER, UserRole.INSTITUTION_ADMIN, UserRole.COUNTRY_COORDINATOR, UserRole.SUPER_ADMIN]);
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Researcher Dashboard</h1><div className="mt-6 grid gap-4 md:grid-cols-3">{['Profile Completion', 'Saved Funding', 'Collaboration Requests', 'Submitted Posts', 'Booking Requests', 'Messages'].map((card) => <article key={card} className="card p-5">{card}</article>)}</div></main>;
}
