"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type DlqItem = { key: string; value: any };

export default function RetryAdminPage() {
  const [items, setItems] = useState<DlqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/postara/retry/dlq/list?token=CRON");
      const data = await res.json();
      if (data.ok) setItems(data.items || []);
      else setError(data.error || "Failed to load DLQ items");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm(`Delete ${id}?`)) return;
    try {
      const res = await fetch(`/api/postara/retry/dlq/delete?token=CRON`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.ok) setItems(items.filter((i) => i.key !== id));
      else alert(`Failed: ${data.error}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Retry / Dead-Letter Queue</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <button onClick={fetchItems} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        Refresh
      </button>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-start border-b">Key</th>
            <th className="px-3 py-2 text-start border-b">Value</th>
            <th className="px-3 py-2 text-start border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key} className="border-b">
              <td className="px-3 py-2">{item.key}</td>
              <td className="px-3 py-2 text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(item.value, null, 2)}
              </td>
              <td className="px-3 py-2">
                <button onClick={() => deleteItem(item.key)} className="px-2 py-1 bg-red-600 text-white rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && !loading && (
            <tr>
              <td colSpan={3} className="px-3 py-2 text-gray-500">
                No items in DLQ.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

