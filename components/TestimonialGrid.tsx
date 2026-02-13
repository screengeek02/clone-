const reviews = [
  ['I finally understand my data trends instead of guessing each year.', 'Product Manager'],
  ['The clinician notes turned complex labs into practical habits.', 'Teacher'],
  ['Fast labs, clear visuals, and real accountability from my coach.', 'Founder']
];

export function TestimonialGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {reviews.map(([quote, role]) => (
        <article key={quote} className="panel rounded-2xl p-5">
          <p>“{quote}”</p>
          <p className="mt-3 text-sm text-cyan-300">{role}</p>
        </article>
      ))}
    </div>
  );
}

export function VideoCard() {
  return (
    <div className="panel rounded-2xl p-6">
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--border)]">Video story placeholder</div>
    </div>
  );
}
