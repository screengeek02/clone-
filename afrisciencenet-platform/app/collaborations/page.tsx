export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';

export default async function CollaborationsPage() {
  const items = await prisma.collaborationPost.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { createdAt: 'desc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Collaboration Marketplace</h1><div className="mt-6 grid gap-4 md:grid-cols-2">{items.map((c) => <article className="card p-5" key={c.id}><h3 className="font-semibold"><a href={`/collaborations/${c.slug}`}>{c.title}</a></h3><p className="text-sm">{c.category} • {c.collaborationType}</p></article>)}</div></main>;
}
