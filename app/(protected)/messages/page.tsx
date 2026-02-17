'use client';
import { useEffect, useState } from 'react';

export default function MessagesPage() {
  const [content, setContent] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const load = () => fetch('/api/messages').then((r) => r.json()).then(setMessages).catch(() => setMessages([]));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, receiverId }) });
    setContent('');
    load();
  };

  return (
    <section className="space-y-4 rounded bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold">Messaging Center</h1>
      <form className="space-y-2" onSubmit={submit}>
        <input className="w-full rounded border p-2" placeholder="Receiver user ID" value={receiverId} onChange={(e)=>setReceiverId(e.target.value)} required />
        <textarea className="w-full rounded border p-2" placeholder="Type your message" value={content} onChange={(e)=>setContent(e.target.value)} required />
        <button className="rounded bg-slate-900 px-4 py-2 text-white">Send message</button>
      </form>
      {messages.map((m) => <div key={m.id} className="rounded border p-3">{m.content}</div>)}
    </section>
  );
}
