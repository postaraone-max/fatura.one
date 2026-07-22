'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function LocalePage() {
  const { locale, t } = useLanguage();
  const [stats, setStats] = useState([
    { label: 'total_invoices', value: 12, icon: '📊' },
    { label: 'paid', value: 7, icon: '✅' },
    { label: 'pending', value: 3, icon: '⏳' },
    { label: 'draft', value: 2, icon: '📝' },
  ]);

  const recentInvoices = [
    { id: 'INV-001', client: 'Ahmed Company', amount: '$1,200', status: 'paid' },
    { id: 'INV-002', client: 'Kurdistan Tech', amount: '$850', status: 'pending' },
    { id: 'INV-003', client: 'Erbil Trading', amount: '$2,300', status: 'draft' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('welcome')}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Current language: {locale}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t(stat.label)}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('create_invoice')}
          </h2>
          <Link
            href={`/${locale}/invoice/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            + {t('create_invoice')}
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('invoices')}
          </h2>
          <Link
            href={`/${locale}/invoices`}
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            {t('view_all')}
          </Link>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('recent_invoices')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('invoice_number')}</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('client')}</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('amount')}</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('status')}</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{inv.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{inv.client}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {t(inv.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                      {t('view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}