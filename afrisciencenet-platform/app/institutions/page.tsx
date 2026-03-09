export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';

export default async function InstitutionsPage() {
  const institutions = await prisma.institution.findMany({ where: { approvalStatus: 'APPROVED' }, orderBy: { name: 'asc' } });
  return <main className="mx-auto max-w-7xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">Institutions Directory</h1><div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{institutions.map((i) => <article className="card p-5" key={i.id}><h3 className="font-semibold"><a href={`/institutions/${i.slug}`}>{i.name}</a></h3><p className="text-sm">{i.city}, {i.region}</p></article>)}</div></main>;
}
