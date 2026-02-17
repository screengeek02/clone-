'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Login failed');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form className="mx-auto max-w-md space-y-3 rounded bg-white p-8 shadow" onSubmit={submit}>
      <h1 className="text-2xl font-semibold">Login</h1>
      <input className="w-full rounded border p-2" type="email" placeholder="Email" required onChange={(e)=>setEmail(e.target.value)} />
      <input className="w-full rounded border p-2" type="password" placeholder="Password" required onChange={(e)=>setPassword(e.target.value)} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded bg-slate-900 px-4 py-2 text-white">Login</button>
    </form>
  );
}
