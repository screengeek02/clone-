import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';

export default async function FundingDetailPage({ params }: { params: { slug: string } }) {
  const funding = await prisma.fundingOpportunity.findUnique({ where: { slug: params.slug } });
  if (!funding) return notFound();
  return <main className="mx-auto max-w-5xl px-4 py-8"><article className="card p-6"><h1 className="text-3xl font-semibold text-navy">{funding.title}</h1><p className="mt-2">{funding.description}</p><a href={funding.sourceUrl} className="mt-4 inline-block rounded-full bg-teal px-4 py-2 text-white">Apply / Express Interest</a></article></main>;
}
