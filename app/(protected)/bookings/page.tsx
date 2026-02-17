'use client';
import { useEffect, useState } from 'react';

export default function BookingsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/bookings').then((r) => r.json()).then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section className="space-y-3 rounded bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">My Bookings</h1>
      {items.map((b) => (
        <div key={b.id} className="rounded border p-3">{b.listing?.title ?? b.id} — {b.status}</div>
      ))}
    </section>
  );
}
