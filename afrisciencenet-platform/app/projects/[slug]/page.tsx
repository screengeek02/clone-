import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({ where: { slug: params.slug }, include: { leadInstitution: true, discipline: true } });
  if (!project) return notFound();
  return <main className="mx-auto max-w-5xl px-4 py-8"><article className="card p-6"><h1 className="text-3xl font-semibold text-navy">{project.title}</h1><p className="mt-2">{project.description}</p><p className="mt-3 text-sm">Lead: {project.leadInstitution.name} • Discipline: {project.discipline.name}</p></article></main>;
}
