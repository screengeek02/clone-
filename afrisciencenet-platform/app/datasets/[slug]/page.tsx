import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function DatasetDetailPage({ params }: { params: { slug: string } }) {
  const dataset = await prisma.dataset.findUnique({ where: { slug: params.slug }, include: { ownerInstitution: true } });
  if (!dataset) return notFound();
  return <main className="mx-auto max-w-5xl px-4 py-8"><article className="card p-6"><h1 className="text-3xl font-semibold text-navy">{dataset.title}</h1><p className="mt-2">{dataset.description}</p><p className="mt-3 text-sm">Owner: {dataset.ownerInstitution.name}</p><a className="mt-4 inline-block rounded bg-teal px-4 py-2 text-white" href={dataset.repositoryUrl}>Open Repository</a></article></main>;
}
