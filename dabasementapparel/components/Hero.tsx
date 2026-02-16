import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8 md:p-14">
      <p className="mb-3 text-sm uppercase tracking-[0.22em] text-zinc-400">Curated by the Basement</p>
      <h1 className="max-w-2xl font-display text-4xl uppercase leading-tight text-zinc-100 md:text-6xl">
        Streetwear That Speaks Before You Do.
      </h1>
      <p className="mt-5 max-w-2xl text-zinc-300">
        Handpicked fits, trend guides, and accessory stacks built for your next signature look.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="rounded-md bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide">
          Shop Essentials
        </Link>
        <Link href="/shop#trending" className="rounded-md border border-zinc-700 px-5 py-3 text-sm uppercase tracking-wide">
          Trending Right Now
        </Link>
      </div>
    </section>
  );
}
