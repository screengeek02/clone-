import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold tracking-tight">Next.js Prisma Auth Starter</h1>
      <p className="max-w-2xl text-slate-600">
        This starter includes secure user signup/login APIs, JWT-based authentication, middleware
        route protection, PostgreSQL with Prisma ORM, and Tailwind CSS styling.
      </p>
      <div className="flex gap-3">
        <Link
          href="/register"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Create Account
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
