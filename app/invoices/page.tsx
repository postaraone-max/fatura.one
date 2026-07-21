"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: string;
  viewCount: number;
  createdAt: string;
}

export default function InvoicesPage() {
  const { t } = useI18n();
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

  if (loading) return <div className="p-4">{t('loading')}</div>;
  
  if (error) return (
    <div className="p-4 text-red-500">
      <p><strong>{t('error')}:</strong></p>
      <p className="text-sm">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {t('retry') || 'Retry'}
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('invoices')}</h1>
        <Link
          href="/invoice/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + {t('createInvoice')}
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t('noData')}</p>
          <Link
            href="/invoice/new"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {t('createInvoice')}
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">{t('invoiceNumber')}</th>
                <th className="border p-2 text-left">{t('customerName')}</th>
                <th className="border p-2 text-right">{t('total')}</th>
                <th className="border p-2 text-left">{t('status')}</th>
                <th className="border p-2 text-center">{t('views') || 'Views'}</th>
                <th className="border p-2 text-left">{t('date')}</th>
                <th className="border p-2 text-center">{t('actions') || 'Actions'}</th>
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
                      inv.status === "VIEWED" ? "bg-yellow-100 text-yellow-800" :
                      inv.status === "SENT" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {inv.status || t('draft')}
                    </span>
                  </td>
                  <td className="border p-2 text-center">{inv.viewCount || 0}</td>
                  <td className="border p-2">
                    {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="border p-2 text-center">
                    <Link
                      href={`/invoice/${inv.id}/view`}
                      className="text-blue-600 hover:underline"
                    >
                      {t('view') || 'View'}
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