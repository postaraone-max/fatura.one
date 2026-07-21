'use client';

import { useI18n } from '@/lib/i18n/provider';
import { formatDistanceToNow } from 'date-fns';
import {
  FilePlus,
  Send,
  CheckCircle,
  Eye,
  Clock,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'created' | 'sent' | 'paid' | 'viewed';
  invoiceNumber: string;
  customerName: string;
  amount: number;
  timestamp: string;
}

interface ActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: ActivityProps) {
  const { t } = useI18n();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return <FilePlus className="w-4 h-4 text-blue-500" />;
      case 'sent':
        return <Send className="w-4 h-4 text-indigo-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'viewed':
        return <Eye className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      case 'sent':
        return 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800';
      case 'paid':
        return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
      case 'viewed':
        return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return t('dashboard.activity.created');
      case 'sent':
        return t('dashboard.activity.sent');
      case 'paid':
        return t('dashboard.activity.paid');
      case 'viewed':
        return t('dashboard.activity.viewed');
      default:
        return type;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dashboard.activity.title')}
        </h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            {t('dashboard.activity.empty')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('dashboard.activity.title')}
      </h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {activities.map((activity) => {
          const timeAgo = formatDistanceToNow(new Date(activity.timestamp), {
            addSuffix: true,
          });

          return (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(
                activity.type
              )} transition-colors hover:opacity-80`}
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {getActivityLabel(activity.type)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {timeAgo}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  <span className="font-medium">{activity.invoiceNumber}</span>
                  {' • '}
                  {activity.customerName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {activity.amount.toLocaleString()} IQD
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}