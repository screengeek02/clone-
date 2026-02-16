import Image from 'next/image';
import { notFound } from 'next/navigation';
import { posts } from '@/content/posts';
import { buildMetadata } from '@/lib/seo';
import { RichText } from '@/components/RichText';

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts.find((entry) => entry.slug === params.slug);
  if (!post) return {};
  return buildMetadata(post.title, post.excerpt, `/journal/${post.slug}`);
}

export default function JournalArticlePage({ params }: { params: { slug: string } }) {
  const post = posts.find((entry) => entry.slug === params.slug);
  if (!post) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    image: post.coverImage,
    description: post.excerpt
  };

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{new Date(post.date).toDateString()}</p>
      <h1 className="font-display text-4xl uppercase">{post.title}</h1>
      <Image src={post.coverImage} alt={post.title} width={1200} height={700} className="h-80 w-full rounded-xl object-cover" />
      <RichText content={post.content} />
    </article>
  );
}
