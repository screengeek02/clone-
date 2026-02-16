export function NewsletterCard() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">
      <p className="text-sm uppercase tracking-widest text-zinc-500">Never miss a drop</p>
      <h2 className="mt-2 font-display text-3xl uppercase">Join The Basement List</h2>
      <p className="mt-2 max-w-xl text-zinc-300">
        Get weekly trend edits, new style guides, and under-the-radar product finds.
      </p>
      <form action="mailto:hello@dabasementapparel.com" method="post" className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          required
          type="email"
          name="email"
          placeholder="you@example.com"
          className="w-full rounded-md border border-zinc-700 bg-black/40 px-4 py-3 text-sm"
        />
        <button className="rounded-md bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide">
          Subscribe
        </button>
      </form>
      <p className="mt-2 text-xs text-zinc-500">TODO: Replace with your preferred ESP embed (ConvertKit, Beehiiv, etc.).</p>
    </section>
  );
}
