import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('About', 'Learn the vision behind Da Basement Apparel.', '/about');

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <h1 className="font-display text-4xl uppercase">About Da Basement Apparel</h1>
      <p className="text-zinc-300">
        Da Basement Apparel is a curated streetwear destination focused on wearable essentials, trend-backed picks,
        and real-world styling guidance.
      </p>
      <p className="text-zinc-300">
        Every product is selected for fit, quality, and versatility so your style speaks before you do.
      </p>
    </section>
  );
}
