import { buildMetadata } from '@/lib/seo';
import { products } from '@/content/products';
import { ProductGrid } from '@/components/ProductGrid';

export const metadata = buildMetadata('Shop', 'Browse all curated streetwear picks and accessory finds.', '/shop');

export default function ShopPage() {
  return (
    <section className="space-y-6">
      <h1 className="font-display text-4xl uppercase">Shop All Picks</h1>
      <p className="max-w-2xl text-zinc-300">Every item is curated for style, value, and fit versatility.</p>
      <ProductGrid products={products} />
    </section>
  );
}
