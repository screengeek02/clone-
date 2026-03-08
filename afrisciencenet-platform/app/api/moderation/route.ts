import { NextRequest, NextResponse } from 'next/server';
import { moderationDecisionSchema } from '@/lib/validation/schemas';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !['COUNTRY_COORDINATOR', 'SUPER_ADMIN', 'INSTITUTION_ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = moderationDecisionSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { entityType, entityId, status, reviewerNotes } = parsed.data;
  const updater: Record<string, () => Promise<unknown>> = {
    equipment: () => prisma.equipment.update({ where: { id: entityId }, data: { approvalStatus: status } }),
    researcher: () => prisma.researcherProfile.update({ where: { id: entityId }, data: { approvalStatus: status } }),
    funding: () => prisma.fundingOpportunity.update({ where: { id: entityId }, data: { approvalStatus: status } }),
    collaboration: () => prisma.collaborationPost.update({ where: { id: entityId }, data: { approvalStatus: status } }),
    institution: () => prisma.institution.update({ where: { id: entityId }, data: { approvalStatus: status } })
  };

  await updater[entityType]();
  await prisma.auditLog.create({ data: { userId: session.user.id, action: `MODERATE_${entityType.toUpperCase()}`, entityType, entityId, details: reviewerNotes } });
  return NextResponse.json({ ok: true });
}
