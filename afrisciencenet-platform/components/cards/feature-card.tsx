export function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="card p-5 transition hover:-translate-y-1 hover:shadow-xl">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </article>
  );
}
