import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('Affiliate Disclosure', 'How affiliate links are used on Da Basement Apparel.', '/disclosure');

export default function DisclosurePage() {
  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl uppercase">Affiliate Disclosure</h1>
      <p className="text-zinc-300">
        Da Basement Apparel participates in affiliate programs, including Amazon Associates. If you purchase through
        links on this site, we may receive a commission at no extra cost to you.
      </p>
      <p className="text-zinc-300">
        Our recommendations are editorially curated and not influenced by advertisers.
      </p>
    </section>
  );
}
