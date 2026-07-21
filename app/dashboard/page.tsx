'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';
import DashboardStats from '@/components/DashboardStats';
import DashboardChart from '@/components/DashboardChart';
import RecentActivity from '@/components/RecentActivity';
import { Loader2 } from 'lucide-react';

interface DashboardData {
  stats: {
    totalInvoices: number;
    draftInvoices: number;
    sentInvoices: number;
    paidInvoices: number;
    totalRevenue: number;
    uniqueClients: number;
    viewCount: number;
  };
  monthlyRevenue: {
    month: string;
    revenue: number;
    invoices: number;
  }[];
  recentActivity: {
    id: string;
    type: 'created' | 'sent' | 'paid' | 'viewed';
    invoiceNumber: string;
    customerName: string;
    amount: number;
    timestamp: string;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        No dashboard data available
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <DashboardStats stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <DashboardChart monthlyData={data.monthlyRevenue} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}