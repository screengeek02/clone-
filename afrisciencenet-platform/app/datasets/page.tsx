import { prisma } from '@/lib/db/prisma';

export default async function DatasetsPage() {
  const items = await prisma.dataset.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { createdAt: 'desc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Datasets</h1><div className="mt-6 grid gap-4 md:grid-cols-2">{items.map((d) => <article className="card p-5" key={d.id}><h3 className="font-semibold"><a href={`/datasets/${d.slug}`}>{d.title}</a></h3><p className="text-sm">{d.license} • {d.fileFormat ?? 'Unknown format'}</p></article>)}</div></main>;
}
