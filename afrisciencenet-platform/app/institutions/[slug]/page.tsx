import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function InstitutionDetailPage({ params }: { params: { slug: string } }) {
  const institution = await prisma.institution.findUnique({ where: { slug: params.slug }, include: { equipment: true, researchers: true } });
  if (!institution) return notFound();
  return <main className="mx-auto max-w-6xl px-4 py-8"><article className="card p-6"><h1 className="text-3xl font-semibold text-navy">{institution.name}</h1><p className="mt-2">{institution.description}</p><p className="mt-4 text-sm">Equipment: {institution.equipment.length} • Researchers: {institution.researchers.length}</p></article></main>;
}
