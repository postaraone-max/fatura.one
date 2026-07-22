'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';

interface Invoice {
  id: string;
  client: string;
  clientEmail: string;
  amount: number;
  date: string;
  dueDate: string;
  status: string;
  type: string;
  items: Array<{ description: string; quantity: number; price: string }>;
  createdAt: string;
}

export default function InvoicesPage() {
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { t } = useLanguage();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('invoices');
      if (stored) {
        setInvoices(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading invoices:', err);
    }
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const deleteInvoice = (id: string) => {
    if (confirm('Delete this invoice?')) {
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      localStorage.setItem('invoices', JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('invoices')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('manage_invoices')} ({invoices.length} total)
          </p>
        </div>
        <Link
          href={`/${locale}/invoice/new`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> {t('create_invoice')}
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('total')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('paid')}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('pending')}</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {invoices.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('draft')}</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {invoices.filter(i => i.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('invoice_number')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('client')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('amount')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('issue_date')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('due_date')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('status')}</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {invoice.client}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {t(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/${locale}/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                      >
                        {t('view')}
                      </Link>
                      <button 
                        onClick={() => deleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('no_invoices')}</p>
            <Link
              href={`/${locale}/invoice/new`}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {t('create_invoice')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}