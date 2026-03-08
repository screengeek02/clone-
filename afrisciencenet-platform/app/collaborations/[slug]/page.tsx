import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';

export default async function CollaborationDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.collaborationPost.findUnique({ where: { slug: params.slug } });
  if (!post) return notFound();
  return <main className="mx-auto max-w-5xl px-4 py-8"><article className="card p-6"><h1 className="text-3xl font-semibold text-navy">{post.title}</h1><p className="mt-2">{post.description}</p><a href="/dashboard/researcher" className="mt-4 inline-block rounded-full bg-navy px-4 py-2 text-white">Express Interest</a></article></main>;
}
