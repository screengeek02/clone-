import { runGlobalSearch } from '@/lib/services/search';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? '';
  const results = await runGlobalSearch(q);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-navy">Advanced Search</h1>
      <form className="mt-4 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-4" action="/search">
        <input name="q" defaultValue={q} placeholder="Keyword" className="rounded border p-2" />
        <input name="country" placeholder="Country" className="rounded border p-2" />
        <input name="discipline" placeholder="Discipline" className="rounded border p-2" />
        <button className="rounded bg-navy p-2 text-white">Apply</button>
      </form>

      {Object.entries(results).map(([group, items]) => (
        <section key={group} className="mt-6">
          <h2 className="text-xl font-semibold capitalize text-navy">{group}</h2>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {items.length === 0 ? <p className="text-sm text-slate-500">No results</p> : items.map((item: any) => <article key={item.id} className="card p-4"><h3 className="font-semibold">{item.title ?? item.fullName ?? item.name}</h3></article>)}
          </div>
        </section>
      ))}
    </main>
  );
}
