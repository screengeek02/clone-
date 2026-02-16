import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/content/categories';

export function CategoryGrid() {
  return (
    <section>
      <h2 className="mb-5 font-display text-3xl uppercase">Shop by Category</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group relative block overflow-hidden rounded-xl border border-zinc-800"
          >
            <Image
              src={category.image}
              alt={category.name}
              width={800}
              height={500}
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent p-5">
              <h3 className="font-display text-2xl uppercase">{category.name}</h3>
              <p className="mt-2 text-sm text-zinc-300">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
