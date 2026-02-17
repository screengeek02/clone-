'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <section className="rounded bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-semibold">Contact</h1>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <input className="w-full rounded border p-2" placeholder="Your email" required />
        <textarea className="w-full rounded border p-2" placeholder="Message" required />
        <button className="rounded bg-slate-900 px-4 py-2 text-white">Send</button>
      </form>
      {sent ? <p className="mt-3 text-green-700">Message sent (demo).</p> : null}
    </section>
  );
}
