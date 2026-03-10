import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ResearcherDetailPage({ params }: { params: { slug: string } }) {
  const researcher = await prisma.researcherProfile.findUnique({ where: { slug: params.slug }, include: { institution: true, discipline: true } });
  if (!researcher) return notFound();
  return <main className="mx-auto max-w-5xl px-4 py-8"><article className="card p-6"><h1 className="text-3xl font-semibold text-navy">{researcher.fullName}</h1><p className="mt-2">{researcher.bio}</p><p className="mt-3 text-sm">{researcher.discipline.name} • {researcher.institution?.name}</p></article></main>;
}
