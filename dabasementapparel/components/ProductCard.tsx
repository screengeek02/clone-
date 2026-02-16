import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/content/products';
import { formatPriceRange } from '@/lib/format';
import { Badge } from './Badge';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/65">
      <Link href={`/product/${product.slug}`}>
        <Image src={product.image} alt={product.title} width={700} height={600} className="h-64 w-full object-cover" />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {product.badges?.map((badge) => <Badge key={badge}>{badge}</Badge>)}
        </div>
        <h3 className="font-display text-2xl uppercase leading-tight">
          <Link href={`/product/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className="text-sm text-zinc-400">{formatPriceRange(product.priceMin, product.priceMax)}</p>
        <a
          href={product.affiliateUrl}
          rel="sponsored noopener noreferrer"
          target="_blank"
          className="inline-block rounded-md bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide"
        >
          View on Amazon
        </a>
      </div>
    </article>
  );
}
