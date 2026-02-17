import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-4 rounded bg-white p-8 shadow">
      <h1 className="text-3xl font-bold">DR Services Marketplace</h1>
      <p>Find trusted providers for cleaning, transportation, tours, and more.</p>
      <div className="flex gap-3">
        <Link href="/register" className="rounded bg-slate-900 px-4 py-2 text-white">Get Started</Link>
        <Link href="/about" className="rounded border px-4 py-2">Learn More</Link>
      </div>
    </section>
  );
}
