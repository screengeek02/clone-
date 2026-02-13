'use client';
import { useState } from 'react';

const clinicians = [
  { name: 'Dr. Mira Shah', cred: 'MD, Internal Medicine' },
  { name: 'Alex Corbett', cred: 'RD, Metabolic Nutrition' },
  { name: 'Dr. Lucas Reed', cred: 'PharmD, Preventive Care' }
];

export function ClinicianCarousel() {
  const [index, setIndex] = useState(0);
  const c = clinicians[index];
  return (
    <section className="panel rounded-2xl p-6">
      <h3 className="text-xl font-semibold">Guided by licensed clinicians</h3>
      <div className="mt-4 rounded-xl border border-[var(--border)] p-5">
        <p className="font-medium">{c.name}</p>
        <p className="text-sm text-muted">{c.cred}</p>
      </div>
      <div className="mt-3 flex gap-2">
        {clinicians.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Show clinician ${i + 1}`} className="focus-ring h-2 w-8 rounded-full bg-white/30" />
        ))}
      </div>
    </section>
  );
}
