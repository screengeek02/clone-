import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default function DashboardPage() {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = verifyToken(token);

  if (!payload) {
    redirect('/login');
  }

  return (
    <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-slate-600">
        You are authenticated as <span className="font-semibold text-slate-900">{payload.email}</span>.
      </p>
      <form
        action={async () => {
          'use server';
          cookies().set('token', '', { maxAge: 0, path: '/' });
          redirect('/login');
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Logout
        </button>
      </form>
    </section>
  );
}
