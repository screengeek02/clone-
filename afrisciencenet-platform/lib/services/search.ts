import { prisma } from '@/lib/prisma';

export async function runGlobalSearch(query: string) {
  const q = query.trim();
  if (!q) return { equipment: [], researchers: [], funding: [], institutions: [], collaborations: [], projects: [], datasets: [] };

  const [equipment, researchers, funding, institutions, collaborations, projects, datasets] = await Promise.all([
    prisma.equipment.findMany({ where: { title: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 }),
    prisma.researcherProfile.findMany({ where: { fullName: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 }),
    prisma.fundingOpportunity.findMany({ where: { title: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 }),
    prisma.institution.findMany({ where: { name: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 }),
    prisma.collaborationPost.findMany({ where: { title: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 }),
    prisma.project.findMany({ where: { title: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 }),
    prisma.dataset.findMany({ where: { title: { contains: q }, approvalStatus: 'APPROVED' }, take: 10 })
  ]);

  return { equipment, researchers, funding, institutions, collaborations, projects, datasets };
}
