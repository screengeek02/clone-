'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const groups = {
  Product: [
    ['How it works', '/how-it-works'],
    ['What we test', '/what-we-test'],
    ['Gift', '/gift']
  ],
  Learn: [
    ['FAQs', '/faqs'],
    ['Reviews', '/reviews'],
    ['Blog', '/blog']
  ],
  Other: [
    ['For teams', '/for-teams'],
    ['Our why', '/our-why']
  ]
} as const;

export function HeaderNav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobile || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>('a,button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobile(false);
      if (e.key === 'Tab' && focusable.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobile]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-slate-950/75 backdrop-blur">
      <div className="container-xl flex items-center justify-between py-4">
        <Link href="/" className="font-bold tracking-wide">VitalSpring</Link>
        <nav className="hidden gap-5 md:flex">
          {Object.entries(groups).map(([title, links]) => (
            <div key={title} className="relative" onMouseLeave={() => setOpen(null)}>
              <button className="focus-ring" onMouseEnter={() => setOpen(title)} aria-expanded={open === title}>{title}</button>
              {open === title && (
                <div className="panel absolute left-0 mt-2 w-64 rounded-xl p-3">
                  {links.map(([name, href]) => <Link key={href} href={href} className="focus-ring block rounded p-2 hover:bg-white/10">{name}</Link>)}
                </div>
              )}
            </div>
          ))}
        </nav>
        <button className="focus-ring md:hidden" onClick={() => setMobile(true)} aria-label="Open menu">Menu</button>
      </div>
      {mobile && (
        <div ref={menuRef} className="panel fixed inset-0 m-4 rounded-2xl p-6 md:hidden" role="dialog" aria-modal="true">
          <div className="flex justify-between">
            <p className="font-semibold">Navigate</p>
            <button className="focus-ring" onClick={() => setMobile(false)}>Close</button>
          </div>
          <div className="mt-4 grid gap-4">
            {Object.entries(groups).map(([title, links]) => (
              <div key={title}>
                <p className="text-sm text-cyan-300">{title}</p>
                <div className="mt-2 flex flex-col gap-2">
                  {links.map(([name, href]) => <Link key={href} href={href} className="focus-ring rounded border border-[var(--border)] p-2" onClick={() => setMobile(false)}>{name}</Link>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
