import { ResearcherProfile } from '@prisma/client';

export function ResearcherCard({ researcher }: { researcher: ResearcherProfile }) {
  return (
    <article className="card p-5 transition hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-navy"><a href={`/researchers/${researcher.slug}`}>{researcher.fullName}</a></h3>
      <p className="mt-1 text-sm text-slate-600">{researcher.title ?? 'Researcher'}</p>
      <p className="mt-2 line-clamp-2 text-sm">{researcher.bio}</p>
    </article>
  );
}
