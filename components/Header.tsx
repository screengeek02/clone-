import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

export default function Header() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  const payload = token ? verifyToken(token) : null;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">DR Services Marketplace</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {payload ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {payload.role === 'ADMIN' ? <Link href="/admin">Admin</Link> : null}
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
