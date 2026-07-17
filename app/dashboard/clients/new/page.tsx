'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewClientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', taxId: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push('/dashboard/clients');
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Client</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Name" className="border p-2 w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="text" placeholder="Phone" className="border p-2 w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input type="email" placeholder="Email" className="border p-2 w-full" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="text" placeholder="Address" className="border p-2 w-full" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        <input type="text" placeholder="Tax ID" className="border p-2 w-full" value={form.taxId} onChange={e => setForm({...form, taxId: e.target.value})} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
