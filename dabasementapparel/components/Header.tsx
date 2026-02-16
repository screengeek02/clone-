import Link from 'next/link';

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Basement Journal' },
  { href: '/about', label: 'About' }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl uppercase tracking-widest text-zinc-100">
          Da Basement Apparel
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-300">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
