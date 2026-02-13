'use client';
import { useMemo, useState } from 'react';
import { PrimaryCTA } from '@/components/PrimaryCTA';

const markers = [
  { name: 'ApoB', category: 'Heart', meaning: 'Particle count tied to plaque risk.' },
  { name: 'HbA1c', category: 'Metabolic', meaning: 'Average blood glucose over 3 months.' },
  { name: 'hs-CRP', category: 'Inflammation', meaning: 'Systemic inflammation indicator.' },
  { name: 'Vitamin D', category: 'Nutrients', meaning: 'Nutrient status tied to immune and bone health.' }
];
const cats = ['All', 'Heart', 'Metabolic', 'Inflammation', 'Nutrients'];

export default function WhatWeTestPage() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<(typeof markers)[number] | null>(null);

  const list = useMemo(() => markers.filter((m) => (cat === 'All' || m.category === cat) && m.name.toLowerCase().includes(search.toLowerCase())), [cat, search]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">What we test</h1>
      <input className="focus-ring w-full rounded-xl border border-[var(--border)] bg-white/5 p-3" placeholder="Search biomarker" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Biomarker categories">{cats.map((c) => <button key={c} role="tab" aria-selected={cat===c} onClick={()=>setCat(c)} className="focus-ring rounded-full border border-[var(--border)] px-3 py-1">{c}</button>)}</div>
      <div className="grid gap-3 md:grid-cols-2">{list.map((m) => <button key={m.name} onClick={() => setActive(m)} className="focus-ring panel rounded-xl p-4 text-left"><p className="font-medium">{m.name}</p><p className="text-sm text-muted">{m.category}</p></button>)}</div>
      <PrimaryCTA href="#" secondary>Download sample report</PrimaryCTA>
      {active && (
        <div className="panel fixed inset-x-4 bottom-4 rounded-2xl p-5 md:inset-x-auto md:right-4 md:top-24 md:w-[30rem]">
          <button className="focus-ring mb-3" onClick={() => setActive(null)}>Close</button>
          <h2 className="text-2xl font-semibold">{active.name}</h2>
          <p className="mt-2 text-muted">Meaning: {active.meaning}</p>
          <p className="mt-2 text-sm text-muted">Optimal range: Placeholder; varies by age and context.</p>
          <p className="mt-2 text-sm text-muted">How to improve: sleep consistency, progressive training, nutrition coaching, targeted supplementation.</p>
        </div>
      )}
    </div>
  );
}
