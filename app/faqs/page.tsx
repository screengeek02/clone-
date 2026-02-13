'use client';
import { useState } from 'react';
import { AccordionFAQ } from '@/components/AccordionFAQ';

const data = {
  Membership: [{ q: 'What is included?', a: 'Testing cadence, trend insights, and clinician guidance.' }],
  Testing: [{ q: 'Where are labs?', a: 'Nationwide partner sites with flexible scheduling.' }],
  Results: [{ q: 'When are results ready?', a: 'Most biomarkers report in approximately one week.' }],
  Billing: [{ q: 'Can I cancel?', a: 'Yes, cancellation is available anytime from billing settings.' }],
  Privacy: [{ q: 'How is data protected?', a: 'Encrypted at rest and in transit with role-based access.' }]
};

export default function FaqsPage() {
  const [search, setSearch] = useState('');
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">FAQs</h1>
      <input className="focus-ring w-full rounded-xl border border-[var(--border)] bg-white/5 p-3" placeholder="Search FAQs" value={search} onChange={(e)=>setSearch(e.target.value)} />
      {Object.entries(data).map(([k, items]) => {
        const filtered = items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(search.toLowerCase()));
        if (!filtered.length) return null;
        return <section key={k}><h2 className="mb-2 text-xl font-semibold">{k}</h2><AccordionFAQ items={filtered} /></section>;
      })}
    </div>
  );
}
