import { notFound } from 'next/navigation';
import { categories } from '@/content/categories';
import { products } from '@/content/products';
import { ProductGrid } from '@/components/ProductGrid';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = categories.find((entry) => entry.slug === params.slug);
  if (!category) return {};
  return buildMetadata(category.name, category.description, `/category/${category.slug}`);
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((entry) => entry.slug === params.slug);
  if (!category) notFound();

  const filtered = products.filter((product) => product.category === params.slug);

  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl uppercase">{category.name}</h1>
      <p className="max-w-2xl text-zinc-300">{category.description}</p>
      <ProductGrid products={filtered} />
    </section>
  );
}
