'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  total: number;
  status: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number | null;
  lastViewedAt: string | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
}

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`);
        if (!response.ok) {
          throw new Error('Invoice not found');
        }
        const data = await response.json();
        setInvoice(data);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'DRAFT':
      case 'draft':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Invoice Not Found
        </h2>
        <Link href="/invoices" className="text-blue-600 hover:underline">
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  // ✅ FIXED: Safe access to viewCount with null check
  const viewCount = invoice.viewCount ?? 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/invoices" className="text-blue-600 hover:underline text-sm">
            ← Back to Invoices
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {invoice.invoiceNumber}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Created: {formatDate(invoice.createdAt)}
          </p>
          {/* ✅ FIXED: Use viewCount with null check */}
          {viewCount > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              👁️ Viewed {viewCount} time{viewCount > 1 ? 's' : ''}
              {invoice.lastViewedAt && ` (last: ${formatDate(invoice.lastViewedAt)})`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            📄 Download PDF
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
            📧 Send Email
          </button>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
            💬 Share via WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {invoice.customerName}
              </p>
              {invoice.customerEmail && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customerEmail}</p>
              )}
              {invoice.customerPhone && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.customerPhone}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Description</th>
                    <th className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Quantity</th>
                    <th className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Price</th>
                    <th className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{item.description}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{item.quantity}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {invoice.currency} {item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                        {invoice.currency} {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-2xl text-gray-900 dark:text-white">
                      {invoice.currency} {invoice.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {(invoice.bankName || invoice.bankAccount || invoice.bankAccountName) && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                🏦 Bank Details
              </h3>
              {invoice.bankName && (
                <p className="text-sm text-blue-700 dark:text-blue-300">Bank: {invoice.bankName}</p>
              )}
              {invoice.bankAccount && (
                <p className="text-sm text-blue-700 dark:text-blue-300">Account: {invoice.bankAccount}</p>
              )}
              {invoice.bankAccountName && (
                <p className="text-sm text-blue-700 dark:text-blue-300">Beneficiary: {invoice.bankAccountName}</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
              ✅ Mark as Paid
            </button>
            <Link
              href={`/invoice/${invoice.id}/edit`}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={() => {
                if (confirm('Delete this invoice?')) {
                  // Handle delete
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}