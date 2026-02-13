'use client';
import { useState } from 'react';

export function AccordionFAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.q} className="panel rounded-xl p-4">
          <button
            className="focus-ring flex w-full items-center justify-between text-left"
            aria-expanded={open === i}
            aria-controls={`faq-${i}`}
            id={`faq-btn-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium">{item.q}</span>
            <span>{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <p id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="mt-3 text-sm text-muted">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
