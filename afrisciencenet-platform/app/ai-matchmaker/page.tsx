import { runGlobalSearch } from '@/lib/services/search';

export default async function AiMatchmakerPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? 'genomics';
  const results = await runGlobalSearch(q);
  return <main className="mx-auto max-w-6xl px-4 py-8"><h1 className="text-3xl font-semibold text-navy">AI Matchmaker (Explainable MVP)</h1><p className="mt-2 text-sm">Keyword relevance across experts, institutions, equipment, projects, funding, and collaborations.</p><article className="card mt-6 p-5"><p className="text-sm">Query: <strong>{q}</strong></p><ul className="mt-3 space-y-2 text-sm"><li>Researchers matched: {results.researchers.length}</li><li>Equipment matched: {results.equipment.length}</li><li>Funding matched: {results.funding.length}</li><li>Projects matched: {results.projects.length}</li></ul></article></main>;
}
