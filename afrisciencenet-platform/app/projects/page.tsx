import { prisma } from '@/lib/db/prisma';

export default async function ProjectsPage() {
  const items = await prisma.project.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { createdAt: 'desc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Research Projects</h1><div className="mt-6 grid gap-4 md:grid-cols-2">{items.map((p) => <article className="card p-5" key={p.id}><h3 className="font-semibold"><a href={`/projects/${p.slug}`}>{p.title}</a></h3><p className="text-sm">{p.status} • {p.fundingSource ?? 'Unspecified funding'}</p></article>)}</div></main>;
}
