"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/invoices")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }
        setInvoices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Invoices fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading invoices...</div>;
  if (error) return (
    <div className="p-4 text-red-500">
      <p><strong>Error loading invoices:</strong></p>
      <p className="text-sm">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Invoices</h1>
        <Link
          href="/invoice/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices yet. Create your first invoice.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Invoice #</th>
                <th className="border p-2 text-left">Customer</th>
                <th className="border p-2 text-right">Total</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="border p-2">{inv.invoiceNumber}</td>
                  <td className="border p-2">{inv.customerName}</td>
                  <td className="border p-2 text-right">
                    {typeof inv.total === 'number' ? inv.total.toFixed(2) : '0.00'}
                  </td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      inv.status === "PAID" ? "bg-green-100 text-green-800" :
                      inv.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="border p-2 text-center">
                    <Link
                      href={`/invoice/${inv.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}