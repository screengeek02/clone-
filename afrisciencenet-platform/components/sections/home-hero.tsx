export function HomeHero() {
  return (
    <section className="card p-8">
      <p className="text-sm font-semibold text-teal">Africa’s Research Infrastructure & Collaboration Network</p>
      <h1 className="mt-2 text-4xl font-bold text-navy">From Laboratory Access to Global Funding — One Platform.</h1>
      <p className="mt-3 max-w-3xl">Discover equipment, experts, institutions, scholarships, and collaborations across Africa with one search-first platform.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {['Find Equipment', 'Find Expert', 'Find Scholarship', 'Post Collaboration', 'Submit Lab Equipment'].map((cta) => (
          <a key={cta} href="/search" className="rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm font-semibold text-teal hover:bg-teal hover:text-white">{cta}</a>
        ))}
      </div>
      <form action="/search" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input name="q" placeholder="Search equipment, experts, funding..." className="w-full rounded-full border px-4 py-3" />
        <button className="rounded-full bg-navy px-6 py-3 text-white">Search</button>
      </form>
    </section>
  );
}
