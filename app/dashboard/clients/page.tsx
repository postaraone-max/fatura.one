'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  taxId: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/clients')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clients');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          setClients([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Client fetch error:', err);
        setError('Could not load clients');
        setClients([]);
        setLoading(false);
      });
  }, []);

  async function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return;
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link href="/dashboard/clients/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Client
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-start">Name</th>
            <th className="border p-2 text-start">Phone</th>
            <th className="border p-2 text-start">Email</th>
            <th className="border p-2 text-start">Tax ID</th>
            <th className="border p-2 text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={5} className="border p-4 text-center text-gray-500">No clients found</td>
            </tr>
          ) : (
            clients.map(client => (
              <tr key={client.id}>
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.phone}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.taxId}</td>
                <td className="border p-2 space-x-2">
                  <Link href={`/dashboard/clients/${client.id}/edit`} className="text-blue-600">Edit</Link>
                  <button onClick={() => deleteClient(client.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}