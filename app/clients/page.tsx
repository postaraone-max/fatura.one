'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  createdAt: string;
}

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  });

  // Fetch clients
  useEffect(() => {
    if (session?.user) {
      fetchClients();
    }
  }, [session]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingClient 
        ? `/api/clients/${editingClient.id}` 
        : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save client');

      setShowModal(false);
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', address: '', taxId: '' });
      fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving client');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete client');
      fetchClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting client');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      taxId: client.taxId || '',
    });
    setShowModal(true);
  };

  // Check authentication after all hooks
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  if (loading && clients.length === 0) {
    return <div className="p-8">Loading clients...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({ name: '', email: '', phone: '', address: '', taxId: '' });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Client
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-sm underline">Dismiss</button>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No clients yet. Add your first client!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{client.name}</td>
                  <td className="p-3">{client.email || '—'}</td>
                  <td className="p-3">{client.phone || '—'}</td>
                  <td className="p-3">{client.address || '—'}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingClient ? 'Edit Client' : 'Add Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tax ID / VAT</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}