'use client';

import { useI18n } from '@/lib/i18n/provider';
import {
  FileText,
  FileCheck,
  Eye,
  Users,
  DollarSign,
  Clock,
  FileWarning,
  TrendingUp,
} from 'lucide-react';

interface StatsProps {
  stats: {
    totalInvoices: number;
    draftInvoices: number;
    sentInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    uniqueClients: number;
    viewCount: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const { t } = useI18n();

  const statCards = [
    {
      label: t('dashboard.stats.totalInvoices'),
      value: stats.totalInvoices,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: t('dashboard.stats.totalRevenue'),
      value: `${stats.totalRevenue.toLocaleString()} IQD`,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: t('dashboard.stats.uniqueClients'),
      value: stats.uniqueClients,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: t('dashboard.stats.invoiceViews'),
      value: stats.viewCount,
      icon: Eye,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ];

  const statusCards = [
    {
      label: t('dashboard.stats.draft'),
      value: stats.draftInvoices,
      icon: FileWarning,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      label: t('dashboard.stats.sent'),
      value: stats.sentInvoices,
      icon: Clock,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: t('dashboard.stats.paid'),
      value: stats.paidInvoices,
      icon: FileCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: t('dashboard.stats.totalInvoices'),
      value: stats.totalInvoices,
      icon: TrendingUp,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          const percentage = stats.totalInvoices > 0 
            ? Math.round((card.value / stats.totalInvoices) * 100)
            : 0;

          return (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.label}
                </p>
                <div className={`${card.bgColor} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${card.textColor}`} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {percentage}%
                </p>
              </div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`${card.color} h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}