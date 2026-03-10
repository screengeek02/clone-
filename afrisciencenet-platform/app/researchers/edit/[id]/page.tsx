export default function EditResearcherPage({ params }: { params: { id: string } }) {
  return <main className="mx-auto max-w-2xl px-4 py-8"><article className="card p-6"><h1 className="text-2xl font-semibold text-navy">Edit Researcher Profile</h1><p className="mt-2 text-sm">Editing researcher ID: {params.id}</p></article></main>;
}
