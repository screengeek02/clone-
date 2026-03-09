import { prisma } from '@/lib/prisma';

export async function getSuperAdminSnapshot() {
  const [users, equipmentPending, fundingPending, collaborationPending, bookingsPending] = await Promise.all([
    prisma.user.count(),
    prisma.equipment.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.fundingOpportunity.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.collaborationPost.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.bookingRequest.count({ where: { status: 'PENDING' } })
  ]);

  return { users, equipmentPending, fundingPending, collaborationPending, bookingsPending };
}
