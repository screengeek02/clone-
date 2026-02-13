import Link from 'next/link';

export function TimelineStepper({ items }: { items: { day: string; title: string }[] }) {
  return (
    <div className="panel rounded-2xl p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.day} className="rounded-xl border border-[var(--border)] p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-300">{item.day}</p>
            <p className="mt-2 font-medium">{item.title}</p>
            {i < items.length - 1 && <div className="mt-3 h-px bg-[var(--border)]" />}
          </div>
        ))}
      </div>
      <Link href="/how-it-works" className="focus-ring mt-4 inline-block text-sm text-cyan-300 underline">
        See full timeline
      </Link>
    </div>
  );
}
