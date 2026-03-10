import { requireRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export default async function CountryCoordinatorDashboard() {
  await requireRole([UserRole.COUNTRY_COORDINATOR, UserRole.SUPER_ADMIN]);

  const [pendingEquipment, pendingProjects, institutionRoster, pendingVerifications, recentSubmissions] = await Promise.all([
    prisma.equipment.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.project.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.institution.count(),
    prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
    prisma.collaborationPost.findMany({ where: { approvalStatus: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true } })
  ]);

  const pendingApprovals = pendingEquipment + pendingProjects;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-navy">Country Coordinator Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <article className="card p-5"><p className="text-sm text-slate-500">Pending Approvals</p><p className="text-2xl font-bold text-navy">{pendingApprovals}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Institution Roster</p><p className="text-2xl font-bold text-navy">{institutionRoster}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Pending Verifications</p><p className="text-2xl font-bold text-navy">{pendingVerifications}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Recent Submissions</p><p className="text-2xl font-bold text-navy">{recentSubmissions.length}</p></article>
      </div>
    </main>
  );
}
