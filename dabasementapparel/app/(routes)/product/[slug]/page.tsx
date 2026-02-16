import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/content/products';
import { ProductGrid } from '@/components/ProductGrid';
import { Badge } from '@/components/Badge';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { formatPriceRange } from '@/lib/format';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = products.find((entry) => entry.slug === params.slug);
  if (!product) return {};
  return buildMetadata(product.title, product.description, `/product/${product.slug}`);
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((entry) => entry.slug === params.slug);
  if (!product) notFound();

  const related = products.filter((entry) => entry.category === product.category && entry.slug !== product.slug).slice(0, 3);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: [product.image, ...product.gallery],
    offers: {
      '@type': 'Offer',
      url: product.affiliateUrl,
      priceCurrency: 'USD',
      price: product.priceMin,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <section className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-8 lg:grid-cols-2">
        <Image src={product.image} alt={product.title} width={1000} height={1000} className="h-full min-h-96 w-full rounded-2xl object-cover" />
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {product.badges?.map((badge) => <Badge key={badge}>{badge}</Badge>)}
          </div>
          <h1 className="font-display text-4xl uppercase">{product.title}</h1>
          <p className="text-lg text-zinc-300">{product.description}</p>
          <p className="text-zinc-400">{formatPriceRange(product.priceMin, product.priceMax)}</p>
          <a href={product.affiliateUrl} target="_blank" rel="sponsored noopener noreferrer" className="inline-block rounded-md bg-accent px-6 py-3 text-sm font-bold uppercase tracking-widest">
            View on Amazon
          </a>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="font-display text-xl uppercase">Why We Picked This</h2>
            <p className="mt-2 text-zinc-300">{product.whyWePickedThis}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h2 className="font-display text-xl uppercase">How to style it</h2>
            <p className="mt-2 text-zinc-300">{product.howToStyle}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {product.gallery.map((src) => (
          <Image key={src} src={src} alt={product.title} width={800} height={600} className="h-64 w-full rounded-xl object-cover" />
        ))}
      </div>

      {related.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display text-3xl uppercase">Related picks</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <p className="text-xs text-zinc-500">
        Affiliate note: we may earn a commission from purchases made through links on this page.
      </p>
      <link rel="canonical" href={absoluteUrl(`/product/${product.slug}`)} />
    </section>
  );
}
