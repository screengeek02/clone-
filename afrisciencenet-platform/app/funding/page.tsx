export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';

export default async function FundingPage() {
  const opportunities = await prisma.fundingOpportunity.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { deadline: 'asc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Funding & Scholarships</h1><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{opportunities.map((f) => <article className="card p-5" key={f.id}><h3 className="font-semibold"><a href={`/funding/${f.slug}`}>{f.title}</a></h3><p className="text-sm">{f.provider} • {f.fundingType}</p></article>)}</div></main>;
}
