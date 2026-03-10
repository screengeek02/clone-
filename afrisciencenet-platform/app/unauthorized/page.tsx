export default function UnauthorizedPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-navy">Unauthorized</h1>
      <p className="mt-4 text-slate-600">You do not have permission to access this page.</p>
      <a href="/" className="mt-6 inline-block rounded bg-navy px-4 py-2 text-white">Go home</a>
    </main>
  );
}
