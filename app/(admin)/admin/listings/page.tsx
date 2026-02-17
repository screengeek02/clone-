'use client';
import { useEffect, useState } from 'react';

export default function AdminListingsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch('/api/admin/listings').then((r) => r.json()).then(setRows).catch(() => setRows([])); }, []);
  return <section className="rounded bg-white p-8 shadow"><h1 className="mb-4 text-2xl font-semibold">Listings</h1>{rows.map((l) => <div key={l.id} className="border-b py-2">{l.title}</div>)}</section>;
}
