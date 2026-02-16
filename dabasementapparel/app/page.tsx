import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductGrid } from '@/components/ProductGrid';
import { NewsletterCard } from '@/components/NewsletterCard';
import { products } from '@/content/products';

export default function HomePage() {
  const trending = products.filter((product) => product.trending);

  return (
    <div className="space-y-16">
      <Hero />
      <CategoryGrid />
      <section id="trending" className="space-y-5">
        <h2 className="font-display text-3xl uppercase">Trending Products</h2>
        <ProductGrid products={trending} />
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Basement Journal</p>
        <h2 className="mt-3 font-display text-3xl uppercase">Editorial Style Guides</h2>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Learn how to style core silhouettes, layer textures, and upgrade your closet one smart pick at a time.
        </p>
        <Link href="/journal" className="mt-5 inline-block rounded-md border border-zinc-700 px-5 py-3 text-sm uppercase tracking-wide">
          Read the Journal
        </Link>
      </section>
      <NewsletterCard />
    </div>
  );
}
