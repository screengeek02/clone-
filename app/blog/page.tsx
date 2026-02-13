import Link from 'next/link';

const posts = [
  { slug: 'understanding-apob', title: 'Understanding ApoB beyond LDL', category: 'Heart Health' },
  { slug: 'sleep-and-glucose-trends', title: 'Sleep quality and glucose trends', category: 'Metabolic' }
];

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Blog</h1>
      <div className="flex gap-2 text-sm text-muted"><span className="rounded-full border border-[var(--border)] px-3 py-1">All</span><span className="rounded-full border border-[var(--border)] px-3 py-1">Heart Health</span><span className="rounded-full border border-[var(--border)] px-3 py-1">Metabolic</span></div>
      <div className="grid gap-4 md:grid-cols-2">{posts.map((p) => <Link key={p.slug} href={`/blog/${p.slug}`} className="panel rounded-xl p-4"><p className="text-sm text-cyan-300">{p.category}</p><h2 className="mt-1 text-xl font-semibold">{p.title}</h2></Link>)}</div>
    </div>
  );
}
