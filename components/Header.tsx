import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/register', label: 'Sign Up' },
  { href: '/login', label: 'Login' },
  { href: '/dashboard', label: 'Dashboard' }
];

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Auth Starter
        </Link>
        <nav className="flex gap-4 text-sm text-slate-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
