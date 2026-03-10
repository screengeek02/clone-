export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { ResearcherCard } from '@/components/cards/researcher-card';

export default async function ResearchersPage() {
  const researchers = await prisma.researcherProfile.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { createdAt: 'desc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Researcher Directory</h1><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{researchers.map((r) => <ResearcherCard key={r.id} researcher={r} />)}</div></main>;
}
