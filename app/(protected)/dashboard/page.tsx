import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, verifyToken } from '@/lib/auth';

export default function DashboardPage() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload) redirect('/login');

  return (
    <section className="space-y-4 rounded bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Welcome {payload.email}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href="/bookings" className="rounded border p-3">Manage bookings</a>
        <a href="/messages" className="rounded border p-3">Messages</a>
        <a href="/profile" className="rounded border p-3">Profile settings</a>
      </div>
    </section>
  );
}
