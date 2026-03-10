import { requireRole } from '@/lib/auth/rbac';
import { prisma } from '@/lib/prisma';
import { BookingStatus, UserRole } from '@prisma/client';

export default async function InstitutionAdminDashboard() {
  const session = await requireRole([UserRole.INSTITUTION_ADMIN, UserRole.SUPER_ADMIN]);

  const institutions = await prisma.institution.findMany({
    where: { focalPersonUserId: session.user.id },
    select: { id: true, name: true }
  });

  const institutionIds = institutions.map((institution) => institution.id);

  const [equipmentCount, pendingBookings, researcherCount, pendingEquipment] = await Promise.all([
    prisma.equipment.count({ where: { institutionId: { in: institutionIds } } }),
    prisma.bookingRequest.count({ where: { institutionId: { in: institutionIds }, status: BookingStatus.PENDING } }),
    prisma.researcherProfile.count({ where: { institutionId: { in: institutionIds } } }),
    prisma.equipment.count({ where: { institutionId: { in: institutionIds }, approvalStatus: 'PENDING' } })
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-navy">Institution Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Managing {institutions.length || 0} institution(s).</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <article className="card p-5"><p className="text-sm text-slate-500">Equipment</p><p className="text-2xl font-bold text-navy">{equipmentCount}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Pending Bookings</p><p className="text-2xl font-bold text-navy">{pendingBookings}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Researchers</p><p className="text-2xl font-bold text-navy">{researcherCount}</p></article>
        <article className="card p-5"><p className="text-sm text-slate-500">Pending Equipment Moderation</p><p className="text-2xl font-bold text-navy">{pendingEquipment}</p></article>
      </div>
    </main>
  );
}
