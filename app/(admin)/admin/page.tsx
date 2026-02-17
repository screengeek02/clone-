import Link from 'next/link';

export default function AdminPage() {
  return (
    <section className="space-y-3 rounded bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/admin/users" className="rounded border p-3">Manage Users</Link>
        <Link href="/admin/listings" className="rounded border p-3">Manage Listings</Link>
        <Link href="/admin/bookings" className="rounded border p-3">Manage Bookings</Link>
      </div>
    </section>
  );
}
