'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'USER' });
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Signup failed');
    router.push('/login');
  };

  return (
    <form className="mx-auto max-w-md space-y-3 rounded bg-white p-8 shadow" onSubmit={submit}>
      <h1 className="text-2xl font-semibold">Create account</h1>
      <input className="w-full rounded border p-2" placeholder="First name" required onChange={(e)=>setForm({...form, firstName:e.target.value})} />
      <input className="w-full rounded border p-2" placeholder="Last name" required onChange={(e)=>setForm({...form, lastName:e.target.value})} />
      <input className="w-full rounded border p-2" type="email" placeholder="Email" required onChange={(e)=>setForm({...form, email:e.target.value})} />
      <input className="w-full rounded border p-2" type="password" minLength={8} placeholder="Password" required onChange={(e)=>setForm({...form, password:e.target.value})} />
      <select className="w-full rounded border p-2" onChange={(e)=>setForm({...form, role:e.target.value})} value={form.role}>
        <option value="USER">Customer</option>
        <option value="PROVIDER">Provider</option>
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="w-full rounded bg-slate-900 px-4 py-2 text-white">Sign up</button>
    </form>
  );
}
