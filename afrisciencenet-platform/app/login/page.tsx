'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

const redirectByRole: Record<string, string> = {
  RESEARCHER: '/dashboard/researcher',
  INSTITUTION_ADMIN: '/dashboard/institution-admin',
  COUNTRY_COORDINATOR: '/dashboard/country-coordinator',
  SUPER_ADMIN: '/dashboard/super-admin'
};

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();
    const role = session?.user?.role;
    const roleRedirect = redirectByRole[role] ?? '/dashboard/researcher';
    router.push(params.get('callbackUrl') ?? roleRedirect);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <article className="card p-6">
        <h1 className="text-2xl font-semibold text-navy">Login</h1>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input name="email" type="email" required className="w-full rounded border p-2" placeholder="Email" />
          <input name="password" type="password" required className="w-full rounded border p-2" placeholder="Password" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded bg-navy p-2 text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </article>
    </main>
  );
}
