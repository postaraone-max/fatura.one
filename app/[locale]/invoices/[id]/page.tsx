'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

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

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const locale = params?.locale as string || 'en';
  const invoiceId = params?.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('🔍 Params:', params);
    console.log('🔍 Invoice ID:', invoiceId);

    try {
      const stored = localStorage.getItem('invoices');
      if (stored) {
        const invoices = JSON.parse(stored);
        console.log('📋 Invoices:', invoices);

        if (invoices.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        // Find by ID or use first invoice
        const found = invoices.find((inv: Invoice) => inv.id === invoiceId) || invoices[0];

        if (found) {
          console.log('✅ Found:', found);
          setInvoice(found);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(true);
    }
    setLoading(false);
  }, [invoiceId, params]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const handleWhatsAppShare = () => {
    const message = `📄 Invoice: ${invoice?.id}\nClient: ${invoice?.client}\nAmount: $${invoice?.amount.toFixed(2)}\nStatus: ${invoice?.status}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPDF = () => {
    alert('📄 PDF download coming soon!');
  };

  const handleSendEmail = () => {
    alert('📧 Email to: ' + invoice?.clientEmail);
  };

  const handleMarkAsPaid = () => {
    if (!invoice) return;
    const updated = { ...invoice, status: 'paid' };
    const stored = localStorage.getItem('invoices');
    if (stored) {
      const invoices = JSON.parse(stored);
      const index = invoices.findIndex((inv: Invoice) => inv.id === invoice.id);
      if (index !== -1) {
        invoices[index] = updated;
        localStorage.setItem('invoices', JSON.stringify(invoices));
        setInvoice(updated);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  if (!invoice || error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Invoice Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          ID: <strong>{invoiceId}</strong>
        </p>
        <Link href={`/${locale}/invoices`} className="text-blue-600 hover:underline">
          ← Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href={`/${locale}/invoices`} className="text-blue-600 hover:underline text-sm">
            ← {t('back_to_invoices')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {invoice.id}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('created')}: {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            📄 {t('download_pdf')}
          </button>
          <button onClick={handleSendEmail} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
            📧 {t('send_email')}
          </button>
          <button onClick={handleWhatsAppShare} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
            💬 {t('share_whatsapp')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('client')}</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{invoice.client}</p>
              {invoice.clientEmail && (
                <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('status')}</h3>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                {t(invoice.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('issue_date')}</h3>
              <p className="text-gray-900 dark:text-white">{invoice.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{t('due_date')}</h3>
              <p className="text-gray-900 dark:text-white">{invoice.dueDate}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">{t('items')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-2 text-sm text-gray-500">{t('description')}</th>
                    <th className="px-4 py-2 text-sm text-gray-500">{t('quantity')}</th>
                    <th className="px-4 py-2 text-sm text-gray-500">{t('price')}</th>
                    <th className="px-4 py-2 text-sm text-gray-500 text-right">{t('total')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{item.description}</td>
                      <td className="px-4 py-2 text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-2 text-gray-600">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                      {t('total')}:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-2xl text-gray-900 dark:text-white">
                      ${invoice.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
              🏦 {t('bank_details')}
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('bank_details_coming_soon')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={handleMarkAsPaid} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
              ✅ {t('mark_as_paid')}
            </button>
            <Link href={`/${locale}/invoice/${invoice.id}/edit`} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition">
              ✏️ {t('edit')}
            </Link>
            <button
              onClick={() => {
                if (confirm('Delete this invoice?')) {
                  const stored = localStorage.getItem('invoices');
                  if (stored) {
                    const invoices = JSON.parse(stored);
                    const filtered = invoices.filter((inv: Invoice) => inv.id !== invoice.id);
                    localStorage.setItem('invoices', JSON.stringify(filtered));
                    router.push(`/${locale}/invoices`);
                  }
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              🗑️ {t('delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}