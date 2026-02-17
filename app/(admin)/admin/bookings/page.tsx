'use client';
import { useEffect, useState } from 'react';

export default function AdminBookingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch('/api/admin/bookings').then((r) => r.json()).then(setRows).catch(() => setRows([])); }, []);
  return <section className="rounded bg-white p-8 shadow"><h1 className="mb-4 text-2xl font-semibold">Bookings</h1>{rows.map((b) => <div key={b.id} className="border-b py-2">{b.status}</div>)}</section>;
}
