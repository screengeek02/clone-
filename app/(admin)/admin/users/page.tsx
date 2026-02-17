'use client';
import { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { fetch('/api/admin/users').then((r) => r.json()).then(setRows).catch(() => setRows([])); }, []);
  return <section className="rounded bg-white p-8 shadow"><h1 className="mb-4 text-2xl font-semibold">Users</h1>{rows.map((u) => <div key={u.id} className="border-b py-2">{u.email} ({u.role})</div>)}</section>;
}
