'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      confirmPassword: String(form.get('confirmPassword') ?? ''),
      institution: String(form.get('institution') ?? ''),
      country: String(form.get('country') ?? ''),
      discipline: String(form.get('discipline') ?? '')
    };

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      setError(typeof data.error === 'string' ? data.error : 'Unable to register with the submitted information.');
      setLoading(false);
      return;
    }

    const login = await signIn('credentials', {
      email: payload.email,
      password: payload.password,
      redirect: false
    });

    if (login?.error) {
      setSuccess('Account created. Please sign in.');
      router.push('/login');
      return;
    }

    router.push('/dashboard/researcher');
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <article className="card p-6">
        <h1 className="text-2xl font-semibold text-navy">Create account</h1>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input name="name" className="w-full rounded border p-2" placeholder="Full name" required />
          <input name="email" type="email" className="w-full rounded border p-2" placeholder="Email" required />
          <input name="password" type="password" minLength={8} className="w-full rounded border p-2" placeholder="Password (min 8 chars)" required />
          <input name="confirmPassword" type="password" minLength={8} className="w-full rounded border p-2" placeholder="Confirm password" required />
          <input name="institution" className="w-full rounded border p-2" placeholder="Institution (optional)" />
          <input name="country" className="w-full rounded border p-2" placeholder="Country (optional)" />
          <input name="discipline" className="w-full rounded border p-2" placeholder="Discipline (optional)" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
          <button disabled={loading} className="w-full rounded bg-teal p-2 text-white disabled:opacity-60">{loading ? 'Creating account…' : 'Register'}</button>
        </form>
      </article>
    </main>
  );
}
