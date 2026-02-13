'use client';
import { useState } from 'react';

export default function GiftPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const valid = /.+@.+\..+/.test(email) && name.length > 1;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Give the gift of proactive health</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {['Choose plan', 'Email delivery', 'Redeem and book labs'].map((s) => <div key={s} className="panel rounded-xl p-4">{s}</div>)}
      </div>
      <form className="panel max-w-xl rounded-2xl p-6" onSubmit={(e)=>{e.preventDefault(); if(valid) setSubmitted(true);}}>
        <h2 className="text-2xl font-semibold">Gift purchase</h2>
        <label className="mt-4 block text-sm">Recipient name<input className="focus-ring mt-1 w-full rounded-lg border border-[var(--border)] bg-white/5 p-2" value={name} onChange={(e)=>setName(e.target.value)} /></label>
        <label className="mt-4 block text-sm">Recipient email<input className="focus-ring mt-1 w-full rounded-lg border border-[var(--border)] bg-white/5 p-2" value={email} onChange={(e)=>setEmail(e.target.value)} /></label>
        <button className="focus-ring mt-4 rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-slate-900 disabled:opacity-50" disabled={!valid}>Purchase gift</button>
        {!valid && <p className="mt-2 text-sm text-amber-300">Please enter a valid name and email.</p>}
        {submitted && <p className="mt-2 text-sm text-emerald-300">Gift order staged (front-end demo only).</p>}
      </form>
    </div>
  );
}
