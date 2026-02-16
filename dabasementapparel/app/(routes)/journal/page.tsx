import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo';
import { posts } from '@/content/posts';

export const metadata = buildMetadata('Basement Journal', 'Streetwear guides, trend takes, and style editorials.', '/journal');

export default function JournalPage() {
  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl uppercase">Basement Journal</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
            <Image src={post.coverImage} alt={post.title} width={900} height={600} className="h-60 w-full object-cover" />
            <div className="space-y-3 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{new Date(post.date).toDateString()}</p>
              <h2 className="font-display text-2xl uppercase">{post.title}</h2>
              <p className="text-zinc-300">{post.excerpt}</p>
              <Link href={`/journal/${post.slug}`} className="text-sm uppercase tracking-wide text-accent">
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
